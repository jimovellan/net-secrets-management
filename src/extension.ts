import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getLanguage, getMessages, t } from './localization';

// Configura el gestor de entornos y registra sus comandos y sincronizadores.
export function activate(context: vscode.ExtensionContext) {
    const userSecretsRoot = process.platform === 'win32'
        ? path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Microsoft', 'UserSecrets')
        : path.join(os.homedir(), '.microsoft', 'usersecrets');
    let currentUserSecretsId: string | undefined;
    let currentProjectName: string | undefined;
    let rootPath = '';
    let projectFileName = '';
    let secretsDirectory = '';
    let activeEnvFile = '';
    let mainSecretsFile = '';
    let initialProjectName = '';

    interface ConfiguredSecretsStore {
        id: string;
        name: string;
        directory: string;
        environments: string[];
        activeEnv: string;
    }

    // Enumera aplicaciones con archivos existentes en User Secrets.
    function getConfiguredSecretsStores(): ConfiguredSecretsStore[] {
        try {
            const stores: ConfiguredSecretsStore[] = [];
            for (const id of fs.readdirSync(userSecretsRoot)) {
                const directory = path.join(userSecretsRoot, id);
                if (!fs.statSync(directory).isDirectory()) continue;

                const files = fs.readdirSync(directory);
                const environments = files
                    .map(file => file.match(/^secrets\.(.+)\.json$/)?.[1])
                    .filter((env): env is string => Boolean(env && isValidEnvironmentName(env)))
                    .sort((left, right) => left.localeCompare(right));
                const hasMainSecrets = files.includes('secrets.json');
                if (environments.length === 0 && !hasMainSecrets) continue;
                if (environments.length === 0) environments.push('develop');

                let config: { projectName?: string; env?: string } = {};
                try {
                    config = JSON.parse(fs.readFileSync(path.join(directory, '.active-env'), 'utf8'));
                } catch (e) {}

                const defaultEnv = environments.includes('develop') ? 'develop' : environments[0];
                stores.push({
                    id,
                    name: config.projectName || (id === currentUserSecretsId ? currentProjectName : undefined) || id,
                    directory,
                    environments,
                    activeEnv: config.env && environments.includes(config.env) ? config.env : defaultEnv
                });
            }
            return stores.sort((left, right) => left.name.localeCompare(right.name));
        } catch (e) {
            return [];
        }
    }

    // Lee los valores únicamente después de seleccionar una aplicación y un entorno.
    function getEnvironmentValues(store: ConfiguredSecretsStore, env: string): { text: string; data?: unknown } {
        const environmentFile = path.join(store.directory, `secrets.${env}.json`);
        const secretsFile = !fs.existsSync(environmentFile) && env === 'develop'
            ? path.join(store.directory, 'secrets.json')
            : environmentFile;
        const content = fs.readFileSync(secretsFile, 'utf8');
        try {
            const data = parseSecretsJson(content);
            return { text: JSON.stringify(data, null, 2), data };
        } catch (e) {
            return { text: content };
        }
    }

    // Abre una página con navegación visible: aplicaciones, entornos y valores.
    // Activa un entorno de cualquier aplicación: copia sus secretos a secrets.json y lo registra en .active-env.
    function activateStoreEnvironment(store: ConfiguredSecretsStore, env: string): boolean {
        const environmentFile = path.join(store.directory, `secrets.${env}.json`);
        if (!isValidEnvironmentName(env) || !store.environments.includes(env) || !fs.existsSync(environmentFile)) {
            vscode.window.showErrorMessage(t('invalidEnvironment'));
            return false;
        }
        const configFile = path.join(store.directory, '.active-env');
        let config: Record<string, unknown> = {};
        try {
            const existing = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
                config = existing;
            }
        } catch (e) {}
        config.env = env;
        try {
            fs.copyFileSync(environmentFile, path.join(store.directory, 'secrets.json'));
            fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
        } catch (e) {
            vscode.window.showErrorMessage(t('invalidEnvironment'));
            return false;
        }
        vscode.window.showInformationMessage(t('environmentSwitched', { env: env.toUpperCase() }));
        return true;
    }

    // Guarda el nombre visible de una aplicación conservando el resto de su configuración.
    function renameConfiguredStore(store: ConfiguredSecretsStore, newName: string): boolean {
        const configFile = path.join(store.directory, '.active-env');
        let config: Record<string, unknown> = { env: store.activeEnv };
        try {
            const existing = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
                config = existing;
            }
        } catch (e) {}
        config.projectName = newName;
        try {
            fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
            return true;
        } catch (e) {
            return false;
        }
    }

    // Borra el archivo de un entorno tras confirmarlo; nunca el activo ni el último disponible.
    async function deleteEnvironmentFile(
        directory: string,
        env: string,
        activeEnv: string,
        environments: string[]
    ): Promise<boolean> {
        if (!isValidEnvironmentName(env) || !environments.includes(env)) {
            vscode.window.showErrorMessage(t('invalidEnvironment'));
            return false;
        }
        if (env === activeEnv) {
            vscode.window.showWarningMessage(t('cannotDeleteActiveEnvironment', { env: env.toUpperCase() }));
            return false;
        }
        if (environments.length <= 1) {
            vscode.window.showWarningMessage(t('cannotDeleteLastEnvironment'));
            return false;
        }
        const confirm = t('deleteEnvironment');
        const choice = await vscode.window.showWarningMessage(
            t('confirmDeleteEnvironment', { env: env.toUpperCase() }),
            { modal: true },
            confirm
        );
        if (choice !== confirm) {
            return false;
        }
        try {
            fs.unlinkSync(path.join(directory, `secrets.${env}.json`));
            vscode.window.showInformationMessage(t('environmentDeleted', { env: env.toUpperCase() }));
            return true;
        } catch (e) {
            vscode.window.showErrorMessage(t('environmentDeleteFailed'));
            return false;
        }
    }

    function browseConfiguredSecrets() {
        let stores = getConfiguredSecretsStores();
        const language = getLanguage();
        const direction = language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';
        const messages = getMessages(language);
        const panel = vscode.window.createWebviewPanel(
            'configuredSecretsBrowser',
            t('browseSecretsTitle'),
            vscode.ViewColumn.One,
            { enableScripts: true, localResourceRoots: [] }
        );

        panel.webview.html = `<!DOCTYPE html>
            <html lang="${language}" dir="${direction}">
            <head><meta charset="UTF-8"><style>
                body { padding: 20px; max-width: 1000px; margin: 0 auto; color: var(--vscode-editor-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
                h1, h2 { margin-top: 0; }
                .breadcrumb { color: var(--vscode-descriptionForeground); margin: 8px 0 20px; }
                .breadcrumb button { border: 0; background: none; color: var(--vscode-textLink-foreground); cursor: pointer; padding: 0; }
                .list { border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-sideBar-background); }
                .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-bottom: 1px solid var(--vscode-panel-border); }
                .row:last-child { border-bottom: 0; }
                .name { font-weight: 600; }
                .meta, .empty { color: var(--vscode-descriptionForeground); }
                .row button { width: auto; }
                button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 0; border-radius: 3px; padding: 7px 12px; cursor: pointer; font-family: inherit; font-size: inherit; }
                button:hover { background: var(--vscode-button-hoverBackground); }
                .actions { display: flex; gap: 8px; flex-shrink: 0; }
                button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
                button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
                pre { padding: 16px; overflow: auto; white-space: pre-wrap; background: var(--vscode-textCodeBlock-background); font-family: var(--vscode-editor-font-family); }
                .values-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
                .values-toolbar .meta { margin: 0; }
                .toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .toolbar-actions button { display: inline-flex; align-items: center; gap: 6px; }
                .json-view { padding: 12px 0; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-textCodeBlock-background); font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); line-height: 1.7; overflow: auto; }
                .json-line { padding-inline-end: 16px; white-space: pre-wrap; word-break: break-all; }
                .json-line:hover, .json-line:focus-within { background: var(--vscode-list-hoverBackground); }
                .json-key { color: var(--vscode-debugTokenExpression-name, #9cdcfe); }
                .json-string { color: var(--vscode-debugTokenExpression-string, #ce9178); }
                .json-number { color: var(--vscode-debugTokenExpression-number, #b5cea8); }
                .json-boolean, .json-null { color: var(--vscode-debugTokenExpression-boolean, #569cd6); }
                .json-punct { color: var(--vscode-descriptionForeground); }
                .json-value.masked { color: var(--vscode-descriptionForeground); letter-spacing: 1px; }
                .line-actions { display: inline-flex; gap: 2px; margin-inline-start: 10px; vertical-align: middle; opacity: 0; }
                .json-line:hover .line-actions, .json-line:focus-within .line-actions { opacity: 1; }
                @media (hover: none) { .line-actions { opacity: 1; } }
                button.icon-button { background: transparent; color: var(--vscode-icon-foreground); padding: 3px; line-height: 0; width: auto; }
                button.icon-button:hover { background: var(--vscode-toolbar-hoverBackground); }
                button.icon-button.copied, .toolbar-actions button.copied { color: var(--vscode-testing-iconPassed); }
                @media (max-width: 520px) { body { padding: 12px; } .row { align-items: stretch; flex-direction: column; } .actions { flex-direction: column; } .row button { width: 100%; } }
            </style></head>
            <body>
                <h1 id="pageTitle">${messages.applications}</h1>
                <nav id="breadcrumb" class="breadcrumb"></nav>
                <main id="content"></main>
                <script>
                    const vscode = acquireVsCodeApi();
                    const text = ${JSON.stringify(messages)};
                    let selectedProject;

                    function showApplications(applications) {
                        document.getElementById('pageTitle').textContent = text.applications;
                        document.getElementById('breadcrumb').replaceChildren();
                        const content = document.getElementById('content');
                        content.replaceChildren();
                        if (applications.length === 0) {
                            const empty = document.createElement('p');
                            empty.className = 'empty';
                            empty.textContent = text.noConfiguredSecrets;
                            content.appendChild(empty);
                            return;
                        }
                        const list = document.createElement('div');
                        list.className = 'list';
                        applications.forEach(app => {
                            const row = document.createElement('div');
                            row.className = 'row';
                            const info = document.createElement('div');
                            const name = document.createElement('div');
                            name.className = 'name';
                            name.textContent = app.name;
                            info.appendChild(name);
                            const id = document.createElement('div');
                            id.className = 'meta';
                            id.textContent = app.id;
                            info.appendChild(id);
                            row.appendChild(info);
                            const actions = document.createElement('div');
                            actions.className = 'actions';
                            const rename = document.createElement('button');
                            rename.className = 'secondary';
                            rename.textContent = text.renameProject;
                            rename.addEventListener('click', () => vscode.postMessage({ command: 'renameApplication', id: app.id }));
                            actions.appendChild(rename);
                            const button = document.createElement('button');
                            button.textContent = text.viewEnvironments;
                            button.addEventListener('click', () => {
                                selectedProject = app;
                                vscode.postMessage({ command: 'selectApplication', id: app.id });
                            });
                            actions.appendChild(button);
                            row.appendChild(actions);
                            list.appendChild(row);
                        });
                        content.appendChild(list);
                    }

                    function showEnvironments(project) {
                        selectedProject = project;
                        document.getElementById('pageTitle').textContent = project.name;
                        const breadcrumb = document.getElementById('breadcrumb');
                        breadcrumb.replaceChildren();
                        const back = document.createElement('button');
                        back.textContent = '‹ ' + text.backToApplications;
                        back.addEventListener('click', () => vscode.postMessage({ command: 'getApplications' }));
                        breadcrumb.appendChild(back);
                        const list = document.createElement('div');
                        list.className = 'list';
                        project.environments.forEach(env => {
                            const row = document.createElement('div');
                            row.className = 'row';
                            const name = document.createElement('div');
                            name.className = 'name';
                            name.textContent = env.toUpperCase() + (env === project.activeEnv ? ' · ' + text.active : '');
                            row.appendChild(name);
                            const actions = document.createElement('div');
                            actions.className = 'actions';
                            if (env !== project.activeEnv) {
                                const activate = document.createElement('button');
                                activate.className = 'secondary';
                                activate.textContent = text.pinAsActive;
                                activate.addEventListener('click', () => vscode.postMessage({ command: 'activateEnvironment', id: project.id, env }));
                                actions.appendChild(activate);
                            }
                            if (env !== project.activeEnv && project.environments.length > 1) {
                                const remove = document.createElement('button');
                                remove.className = 'secondary';
                                remove.textContent = text.deleteEnvironment;
                                remove.addEventListener('click', () => vscode.postMessage({ command: 'deleteEnvironment', id: project.id, env }));
                                actions.appendChild(remove);
                            }
                            const button = document.createElement('button');
                            button.textContent = text.viewSecrets;
                            button.addEventListener('click', () => {
                                document.getElementById('content').innerHTML = '';
                                const loading = document.createElement('p');
                                loading.className = 'meta';
                                loading.textContent = text.loadingSecrets;
                                document.getElementById('content').appendChild(loading);
                                vscode.postMessage({ command: 'selectEnvironment', id: project.id, env });
                            });
                            actions.appendChild(button);
                            row.appendChild(actions);
                            list.appendChild(row);
                        });
                        const content = document.getElementById('content');
                        content.replaceChildren(list);
                    }

                    function showValues(project, env, values, data) {
                        document.getElementById('pageTitle').textContent = text.secretsViewerTitle
                            .replace('{project}', project.name)
                            .replace('{env}', env.toUpperCase());
                        const breadcrumb = document.getElementById('breadcrumb');
                        breadcrumb.replaceChildren();
                        const back = document.createElement('button');
                        back.textContent = '‹ ' + text.viewEnvironments;
                        back.addEventListener('click', () => vscode.postMessage({ command: 'selectApplication', id: project.id }));
                        breadcrumb.appendChild(back);
                        const content = document.getElementById('content');
                        content.replaceChildren();
                        const toolbar = document.createElement('div');
                        toolbar.className = 'values-toolbar';
                        const note = document.createElement('p');
                        note.className = 'meta';
                        note.textContent = text.secretsReadOnly;
                        toolbar.appendChild(note);
                        const toolbarActions = document.createElement('div');
                        toolbarActions.className = 'toolbar-actions';
                        toolbar.appendChild(toolbarActions);
                        content.appendChild(toolbar);

                        const secrets = [];
                        const hasData = data !== undefined && data !== null && typeof data === 'object';
                        if (hasData) {
                            const toggleAll = document.createElement('button');
                            toggleAll.className = 'secondary';
                            const refreshToggleAll = () => {
                                const allVisible = secrets.length > 0 && secrets.every(secret => secret.revealed);
                                toggleAll.innerHTML = allVisible ? ICONS.eyeClosed : ICONS.eye;
                                toggleAll.appendChild(document.createTextNode(allVisible ? text.hideValues : text.showValues));
                            };
                            toggleAll.addEventListener('click', () => {
                                const reveal = !secrets.every(secret => secret.revealed);
                                secrets.forEach(secret => secret.setRevealed(reveal));
                                refreshToggleAll();
                            });
                            const view = document.createElement('div');
                            view.className = 'json-view';
                            renderJson(view, data, secrets, refreshToggleAll);
                            refreshToggleAll();
                            if (secrets.length > 0) {
                                toolbarActions.appendChild(toggleAll);
                            }
                            content.appendChild(view);
                        } else {
                            const pre = document.createElement('pre');
                            pre.textContent = values;
                            content.appendChild(pre);
                        }

                        const copyAll = document.createElement('button');
                        const resetCopyAll = () => {
                            copyAll.classList.remove('copied');
                            copyAll.innerHTML = ICONS.copy;
                            copyAll.appendChild(document.createTextNode(text.copyJson));
                        };
                        resetCopyAll();
                        copyAll.addEventListener('click', () => {
                            copyText(values);
                            copyAll.classList.add('copied');
                            copyAll.innerHTML = ICONS.check;
                            copyAll.appendChild(document.createTextNode(text.copied));
                            setTimeout(resetCopyAll, 1500);
                        });
                        toolbarActions.appendChild(copyAll);
                    }

                    const svg = path => '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="' + path + '"/></svg>';
                    const ICONS = {
                        copy: svg('M4 4V1.5l.5-.5h8l.5.5v10l-.5.5H11v2.5l-.5.5h-8l-.5-.5v-10l.5-.5H4zm1 0h5.5l.5.5V11h1V2H5v2zM3 5v9h7V5H3z'),
                        check: svg('M13.65 3.65 6 11.29 2.35 7.65l-.7.7L6 12.71l8.35-8.36-.7-.7z'),
                        eye: svg('M8 3C4.5 3 1.8 5.2 1 8c.8 2.8 3.5 5 7 5s6.2-2.2 7-5c-.8-2.8-3.5-5-7-5zm0 9c-2.8 0-5-1.7-5.9-4C3 5.7 5.2 4 8 4s5 1.7 5.9 4c-.9 2.3-3.1 4-5.9 4zm0-6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'),
                        eyeClosed: svg('M1.6 1.6l12.8 12.8-.7.7-2.4-2.4c-1 .5-2.1.8-3.3.8-3.5 0-6.2-2.2-7-5 .4-1.4 1.3-2.7 2.5-3.6L.9 2.3l.7-.7zm2.6 3.3C3.3 5.6 2.6 6.7 2.1 8 3 10.3 5.2 12 8 12c.9 0 1.7-.2 2.5-.5L9.1 10.1A2.5 2.5 0 0 1 5.9 6.9L4.2 4.9zM8 4c2.8 0 5 1.7 5.9 4-.3.8-.8 1.6-1.4 2.2l.7.7c.8-.8 1.4-1.8 1.8-2.9-.8-2.8-3.5-5-7-5-.8 0-1.6.1-2.3.3l.8.8C6.9 4 7.4 4 8 4z')
                    };
                    const MASK = '••••••••';

                    function copyText(value) {
                        vscode.postMessage({ command: 'copyToClipboard', text: value });
                    }

                    function textSpan(className, value) {
                        const element = document.createElement('span');
                        element.className = className;
                        element.textContent = value;
                        return element;
                    }

                    function iconButton(icon, label, onClick) {
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.className = 'icon-button';
                        button.innerHTML = icon;
                        button.title = label;
                        button.setAttribute('aria-label', label);
                        button.addEventListener('click', onClick);
                        return button;
                    }

                    // Pinta el JSON línea a línea con colores; los valores empiezan ocultos.
                    function renderJson(container, root, secrets, onRevealChange) {
                        function addLine(depth, parts) {
                            const line = document.createElement('div');
                            line.className = 'json-line';
                            line.style.paddingInlineStart = 'calc(16px + ' + (depth * 2) + 'ch)';
                            parts.forEach(part => line.appendChild(part));
                            container.appendChild(line);
                            return line;
                        }

                        function walk(value, depth, key, isLast) {
                            const prefix = key === undefined
                                ? []
                                : [textSpan('json-key', JSON.stringify(key)), textSpan('json-punct', ': ')];
                            const comma = isLast ? [] : [textSpan('json-punct', ',')];
                            if (value !== null && typeof value === 'object') {
                                const isArray = Array.isArray(value);
                                const entries = isArray ? value.map((item, index) => [undefined, item]) : Object.entries(value);
                                const open = isArray ? '[' : '{';
                                const close = isArray ? ']' : '}';
                                if (entries.length === 0) {
                                    addLine(depth, [...prefix, textSpan('json-punct', open + close), ...comma]);
                                    return;
                                }
                                addLine(depth, [...prefix, textSpan('json-punct', open)]);
                                entries.forEach(([childKey, child], index) => walk(child, depth + 1, childKey, index === entries.length - 1));
                                addLine(depth, [textSpan('json-punct', close), ...comma]);
                                return;
                            }

                            const type = value === null ? 'null' : typeof value;
                            const display = type === 'string' ? JSON.stringify(value) : String(value);
                            const raw = type === 'string' ? value : String(value);
                            const valueSpan = textSpan('json-value json-' + type, '');
                            const secret = { revealed: false };
                            const eye = iconButton(ICONS.eye, text.showValue, () => {
                                secret.setRevealed(!secret.revealed);
                                onRevealChange();
                            });
                            secret.setRevealed = revealed => {
                                secret.revealed = revealed;
                                valueSpan.textContent = revealed ? display : MASK;
                                valueSpan.classList.toggle('masked', !revealed);
                                const label = revealed ? text.hideValue : text.showValue;
                                eye.innerHTML = revealed ? ICONS.eyeClosed : ICONS.eye;
                                eye.title = label;
                                eye.setAttribute('aria-label', label);
                            };
                            secret.setRevealed(false);
                            secrets.push(secret);

                            const copy = iconButton(ICONS.copy, text.copyValue, () => {
                                copyText(raw);
                                copy.innerHTML = ICONS.check;
                                copy.classList.add('copied');
                                copy.title = text.copied;
                                setTimeout(() => {
                                    copy.innerHTML = ICONS.copy;
                                    copy.classList.remove('copied');
                                    copy.title = text.copyValue;
                                }, 1500);
                            });
                            const actions = document.createElement('span');
                            actions.className = 'line-actions';
                            actions.append(eye, copy);
                            addLine(depth, [...prefix, valueSpan, ...comma, actions]);
                        }

                        walk(root, 0, undefined, true);
                    }

                    window.addEventListener('message', event => {
                        const message = event.data;
                        if (message.command === 'applications') showApplications(message.applications);
                        if (message.command === 'environments') showEnvironments(message.project);
                        if (message.command === 'values') showValues(message.project, message.env, message.values, message.data);
                    });
                    window.onload = () => vscode.postMessage({ command: 'getApplications' });
                </script>
            </body></html>`;

        panel.webview.onDidReceiveMessage(async message => {
            if (message.command === 'copyToClipboard' && typeof message.text === 'string') {
                await vscode.env.clipboard.writeText(message.text);
                vscode.window.setStatusBarMessage(`$(check) ${t('copied')}`, 2000);
                return;
            }
            if (message.command === 'deleteEnvironment' || message.command === 'activateEnvironment') {
                stores = getConfiguredSecretsStores();
                const store = stores.find(candidate => candidate.id === message.id);
                if (!store) {
                    return;
                }
                const changed = message.command === 'activateEnvironment'
                    ? activateStoreEnvironment(store, message.env)
                    : await deleteEnvironmentFile(store.directory, message.env, store.activeEnv, store.environments);
                if (!changed) {
                    return;
                }
                stores = getConfiguredSecretsStores();
                const updated = stores.find(candidate => candidate.id === message.id);
                if (!updated) {
                    return;
                }
                panel.webview.postMessage({
                    command: 'environments',
                    project: {
                        id: updated.id,
                        name: updated.name,
                        activeEnv: updated.activeEnv,
                        environments: updated.environments
                    }
                });
            }
            if (message.command === 'renameApplication') {
                const store = stores.find(candidate => candidate.id === message.id);
                if (!store) {
                    return;
                }
                const input = await vscode.window.showInputBox({
                    title: t('renameProject'),
                    prompt: t('renameProjectPrompt', { id: store.id }),
                    value: store.name === store.id ? '' : store.name,
                    validateInput: value => value.trim() ? undefined : t('projectNameRequired')
                });
                const newName = input?.trim();
                if (!newName) {
                    return;
                }
                if (!renameConfiguredStore(store, newName)) {
                    vscode.window.showErrorMessage(t('projectNameUpdateFailed'));
                    return;
                }
                vscode.window.showInformationMessage(t('projectNameUpdated', { name: newName }));
                stores = getConfiguredSecretsStores();
                panel.webview.postMessage({
                    command: 'applications',
                    applications: stores.map(({ id, name }) => ({ id, name }))
                });
            }
            if (message.command === 'getApplications') {
                panel.webview.postMessage({
                    command: 'applications',
                    applications: stores.map(({ id, name }) => ({ id, name }))
                });
            }
            if (message.command === 'selectApplication') {
                const store = stores.find(candidate => candidate.id === message.id);
                if (!store) return;
                panel.webview.postMessage({
                    command: 'environments',
                    project: {
                        id: store.id,
                        name: store.name,
                        activeEnv: store.activeEnv,
                        environments: store.environments
                    }
                });
            }
            if (message.command === 'selectEnvironment') {
                const store = stores.find(candidate => candidate.id === message.id);
                if (!store || !store.environments.includes(message.env)) return;
                try {
                    const { text, data } = getEnvironmentValues(store, message.env);
                    panel.webview.postMessage({
                        command: 'values',
                        project: { id: store.id, name: store.name },
                        env: message.env,
                        values: text,
                        data
                    });
                } catch (e) {
                    vscode.window.showErrorMessage(t('secretsReadFailed'));
                }
            }
        }, undefined, context.subscriptions);
    }

    // Publica el navegador global en la barra y permite abrirlo desde la paleta de comandos.
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'net-secrets-manager.browseSecrets';
    context.subscriptions.push(statusBarItem);
    function updateStatusBar() {
        statusBarItem.text = `$(key) ${t('panelTitle')}`;
        statusBarItem.tooltip = t('statusTooltip');
        statusBarItem.show();
    }
    updateStatusBar();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('net-secrets-manager.language')) updateStatusBar();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('net-secrets-manager.browseSecrets', browseConfiguredSecrets));

    // Resuelve el .csproj recibido desde el menú contextual o el editor activo.
    function resolveProjectPath(resourceUri?: vscode.Uri): string | undefined {
        const candidate = resourceUri ?? vscode.window.activeTextEditor?.document.uri;
        if (candidate && path.extname(candidate.fsPath).toLowerCase() === '.csproj') {
            return candidate.fsPath;
        }
        vscode.window.showErrorMessage(t('projectFileMissing'));
        return undefined;
    }

    // Inicializa el proyecto únicamente cuando se invoca el comando sobre su .csproj.
    function initializeProjectManager(projectPath: string): boolean {
        const projectContent = fs.readFileSync(projectPath, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
        const projectUserSecretsId = projectContent.match(/<UserSecretsId(?:\s[^>]*)?>\s*([^<]+?)\s*<\/UserSecretsId\s*>/i)?.[1].trim();
        if (!projectUserSecretsId || !/^[a-z0-9][a-z0-9._-]*$/i.test(projectUserSecretsId)) {
            vscode.window.showErrorMessage(t('userSecretsIdMissing'));
            return false;
        }

        rootPath = path.dirname(projectPath);
        projectFileName = path.basename(projectPath);
        currentUserSecretsId = projectUserSecretsId;
        currentProjectName = path.basename(projectFileName, '.csproj');
        initialProjectName = currentProjectName;
        secretsDirectory = path.join(userSecretsRoot, projectUserSecretsId);
        fs.mkdirSync(secretsDirectory, { recursive: true });
        activeEnvFile = path.join(secretsDirectory, '.active-env');
        mainSecretsFile = path.join(secretsDirectory, 'secrets.json');

        const legacyFiles = fs.readdirSync(rootPath).filter(file =>
            file === '.active-env' || file === 'secrets.json' || /^secrets\..+\.json$/.test(file)
        );
        const migrationConflicts: string[] = [];
        const migrationFailures: string[] = [];
        for (const file of legacyFiles) {
            const source = path.join(rootPath, file);
            const destination = path.join(secretsDirectory, file);
            if (fs.existsSync(destination)) {
                migrationConflicts.push(file);
                continue;
            }
            try {
                fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
                fs.unlinkSync(source);
            } catch (e) {
                migrationFailures.push(file);
            }
        }
        if (migrationConflicts.length > 0 || migrationFailures.length > 0) {
            const files = [...migrationConflicts, ...migrationFailures].join(', ');
            vscode.window.showWarningMessage(t('migrationWarning', { files }));
        }

        const hasEnvironmentFiles = fs.readdirSync(secretsDirectory).some(file => /^secrets\..+\.json$/.test(file));
        if (!hasEnvironmentFiles) {
            const developFile = path.join(secretsDirectory, 'secrets.develop.json');
            if (fs.existsSync(mainSecretsFile)) {
                fs.copyFileSync(mainSecretsFile, developFile);
            } else {
                fs.writeFileSync(developFile, JSON.stringify({}, null, 2));
            }
        }

        const config = getActiveConfig();
        const activeSecretsFile = getEnvironmentFilePath(config.env);
        if (fs.existsSync(activeSecretsFile)) {
            fs.copyFileSync(activeSecretsFile, mainSecretsFile);
        }
        return true;
    }

    // Lista los archivos de entorno del almacén de User Secrets.
    function getAvailableEnvironments(): string[] {
        try {
            const files = fs.readdirSync(secretsDirectory);
            const envs: string[] = [];
            for (const file of files) {
                const match = file.match(/^secrets\.(.+)\.json$/);
                if (match && isValidEnvironmentName(match[1])) {
                    envs.push(match[1]);
                }
            }
            return envs.length > 0 ? envs : ['develop'];
        } catch (e) {
            return ['develop'];
        }
    }

    // Lee la configuración activa o crea una con el entorno predeterminado.
    function getActiveConfig(): { env: string; projectName: string } {
        const availableEnvs = getAvailableEnvironments();
        let defaultEnv = availableEnvs.includes('develop') ? 'develop' : availableEnvs[0];

        try {
            if (fs.existsSync(activeEnvFile)) {
                const data = JSON.parse(fs.readFileSync(activeEnvFile, 'utf8'));
                const activeEnv = availableEnvs.includes(data.env) ? data.env : defaultEnv;
                return {
                    env: activeEnv,
                    projectName: data.projectName || initialProjectName
                };
            }
        } catch (e) {}
        
        const defaultConfig = { env: defaultEnv, projectName: initialProjectName };
        fs.writeFileSync(activeEnvFile, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }

    // Abre el panel y conecta sus acciones con las funciones de gestión.
    const openDashboardCmd = vscode.commands.registerCommand('net-secrets-manager.openDashboard', (resourceUri?: vscode.Uri) => {
        const projectPath = resolveProjectPath(resourceUri);
        if (!projectPath || !initializeProjectManager(projectPath)) return;

        const panel = vscode.window.createWebviewPanel(
            'secretsDashboard',
            t('panelTitle'),
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();

        // Atiende los mensajes que el panel web envía a la extensión.
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'getData':
                    sendDataToWebview(panel);
                    break;
                case 'selectEnv':
                    sendDataToWebview(panel, message.env);
                    break;
                case 'pinEnv':
                    switchEnvironment(message.env);
                    sendDataToWebview(panel, message.env, false, message.navigateTo ?? 'detail');
                    updateStatusBar();
                    break;
                case 'createEnv':
                    const createdEnv = createNewEnvironment(
                        message.envName,
                        message.baseEnv,
                        message.secretsData,
                        message.env
                    );
                    sendDataToWebview(panel, createdEnv ?? message.env, !createdEnv, createdEnv ? 'detail' : 'create');
                    updateStatusBar();
                    break;
                case 'deleteEnv':
                    void deleteEnvironmentFile(
                        secretsDirectory,
                        message.env,
                        getActiveConfig().env,
                        getAvailableEnvironments()
                    ).then(deleted => {
                        if (deleted) {
                            sendDataToWebview(panel, undefined, false, 'list');
                        }
                    });
                    break;
                case 'confirmNavigation':
                    void confirmPendingNavigation(panel, message);
                    break;
                case 'updateProjectName':
                    updateProjectNameConfig(message.newName);
                    sendDataToWebview(panel);
                    updateStatusBar();
                    break;
                case 'saveSecrets':
                    panel.webview.postMessage({
                        command: 'saveResult',
                        env: message.env,
                        saved: saveSecretsToFile(message.env, message.secretsData)
                    });
                    break;
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(openDashboardCmd);

    // Confirma cómo tratar cambios pendientes antes de cambiar de pantalla.
    async function confirmPendingNavigation(panel: vscode.WebviewPanel, message: any) {
        const saveAndContinue = t('saveAndContinue');
        const discardChanges = t('discardChanges');
        const stayOnPage = t('stayOnPage');
        const choice = await vscode.window.showWarningMessage(
            t('unsavedChanges'),
            { modal: true },
            saveAndContinue,
            discardChanges,
            stayOnPage
        );

        if (choice === saveAndContinue && !saveSecretsToFile(message.currentEnv, message.secretsData)) {
            return;
        }
        if (choice !== saveAndContinue && choice !== discardChanges) {
            return;
        }
        panel.webview.postMessage({
            command: 'navigationConfirmed',
            target: message.target,
            env: message.env
        });
    }

    // Envía al panel la configuración activa y los secretos del entorno seleccionado.
    function sendDataToWebview(
        panel: vscode.WebviewPanel,
        selectedEnv?: string,
        preserveSecretsEditor = false,
        navigateTo?: 'list' | 'detail' | 'create'
    ) {
        const config = getActiveConfig();
        const availableEnvs = getAvailableEnvironments();
        const environmentToShow = selectedEnv && isValidEnvironmentName(selectedEnv) && availableEnvs.includes(selectedEnv)
            ? selectedEnv
            : config.env;
        const targetFile = getEnvironmentFilePath(environmentToShow);
        let secretsContent = "{}";
        try {
            if (fs.existsSync(targetFile)) {
                secretsContent = fs.readFileSync(targetFile, 'utf8');
            }
        } catch(e) {}

        panel.webview.postMessage({
            command: 'loadData',
            config,
            availableEnvs,
            selectedEnv: environmentToShow,
            secretsJson: secretsContent,
            preserveSecretsEditor,
            navigateTo
        });
    }

    // Activa un entorno y copia sus secretos al secrets.json que consume .NET.
    function switchEnvironment(env: string) {
        if (!isValidEnvironmentName(env) || !getAvailableEnvironments().includes(env)) {
            vscode.window.showErrorMessage(t('invalidEnvironment'));
            return;
        }
        const config = getActiveConfig();
        config.env = env;
        fs.writeFileSync(activeEnvFile, JSON.stringify(config, null, 2));

        const targetFile = getEnvironmentFilePath(env);
        if (fs.existsSync(targetFile)) {
            fs.copyFileSync(targetFile, mainSecretsFile);
        }
        vscode.window.showInformationMessage(t('environmentSwitched', { env: env.toUpperCase() }));
    }

    // Crea un entorno vacío o copia los secretos de otro entorno como base.
    function createNewEnvironment(
        envName: string,
        baseEnv: string | undefined,
        secretsData: string,
        selectedEnv: string
    ): string | undefined {
        if (!envName) return;
        const cleanName = envName.trim().toLowerCase();
        if (!isValidEnvironmentName(cleanName)) {
            vscode.window.showErrorMessage(t('invalidEnvironmentName'));
            return;
        }
        const newFile = getEnvironmentFilePath(cleanName);
        if (fs.existsSync(newFile)) {
            vscode.window.showWarningMessage(t('environmentExists', { env: cleanName }));
            return;
        }
        if (baseEnv && (!isValidEnvironmentName(baseEnv) || !getAvailableEnvironments().includes(baseEnv))) {
            vscode.window.showErrorMessage(t('invalidBaseEnvironment'));
            return;
        }
        try {
            const baseContent = !baseEnv
                ? '{}'
                : baseEnv === selectedEnv
                    ? secretsData
                    : fs.readFileSync(getEnvironmentFilePath(baseEnv), 'utf8');
            const parsedSecrets = parseSecretsJson(baseContent);
            fs.writeFileSync(newFile, JSON.stringify(parsedSecrets, null, 2));
            const message = baseEnv
                ? t('environmentCreatedFrom', { env: cleanName, base: baseEnv })
                : t('environmentCreatedEmpty', { env: cleanName });
            vscode.window.showInformationMessage(message);
            return cleanName;
        } catch (e) {
            vscode.window.showErrorMessage(t('environmentCreateFailed'));
        }
    }

    // Rechaza nombres que podrían formar rutas o nombres de archivo no permitidos.
    function isValidEnvironmentName(env: string): boolean {
        return /^[a-z0-9][a-z0-9_-]*$/i.test(env);
    }

    // Retira el BOM UTF-8 que .NET acepta pero JSON.parse no interpreta.
    function parseSecretsJson(secretsJson: string): ReturnType<typeof JSON.parse> {
        return JSON.parse(secretsJson.replace(/^\uFEFF/, ''));
    }

    // Construye la ruta del archivo JSON para un entorno.
    function getEnvironmentFilePath(env: string): string {
        return path.join(secretsDirectory, `secrets.${env}.json`);
    }

    // Actualiza el nombre del proyecto guardado en la configuración activa.
    function updateProjectNameConfig(newName: string) {
        const config = getActiveConfig();
        config.projectName = newName;
        fs.writeFileSync(activeEnvFile, JSON.stringify(config, null, 2));
        vscode.window.showInformationMessage(t('projectNameUpdated', { name: newName }));
    }

    // Valida y guarda secretos; sincroniza el archivo principal si el entorno está activo.
    function saveSecretsToFile(env: string, secretsData: string): boolean {
        if (!isValidEnvironmentName(env)) {
            vscode.window.showErrorMessage(t('invalidEnvironment'));
            return false;
        }
        const targetFile = getEnvironmentFilePath(env);
        try {
            const parsed = parseSecretsJson(secretsData);
            fs.writeFileSync(targetFile, JSON.stringify(parsed, null, 2));
            
            const config = getActiveConfig();
            if (env === config.env) {
                fs.copyFileSync(targetFile, mainSecretsFile);
            }
            vscode.window.showInformationMessage(t('secretsSaved', { env }));
            return true;
        } catch (e) {
            vscode.window.showErrorMessage(t('invalidSecretsJson'));
            return false;
        }
    }

    // Mantiene sincronizado el entorno activo cuando se guarda secrets.json en VS Code.
    let saveDocumentListener = vscode.workspace.onDidSaveTextDocument(document => {
        const filePath = document.uri.fsPath;
        const config = getActiveConfig();

        if (filePath === mainSecretsFile) {
            const targetEnvFile = getEnvironmentFilePath(config.env);
            fs.copyFileSync(mainSecretsFile, targetEnvFile);
        } else {
            const availableEnvs = getAvailableEnvironments();
            for (const env of availableEnvs) {
                if (filePath === getEnvironmentFilePath(env)) {
                    if (env !== config.env) {
                        // Se actualizó un entorno aislado sin alterar el principal en curso
                    }
                    break;
                }
            }
        }
    });
    context.subscriptions.push(saveDocumentListener);

    // Genera el HTML del panel y sus controles de gestión.
    function getWebviewContent(): string {
        const language = getLanguage();
        const text = getMessages(language);
        const direction = language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';
        return `<!DOCTYPE html>
        <html lang="${language}" dir="${direction}">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: var(--vscode-font-family); color: var(--vscode-editor-foreground); background-color: var(--vscode-editor-background); padding: 20px; max-width: 1040px; margin: 0 auto; }
                h2, h3 { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 8px; }
                .screen[hidden] { display: none; }
                .app-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--vscode-panel-border); }
                .app-header h2 { border: 0; margin: 0; }
                .active-banner { margin: 4px 0; white-space: nowrap; }
                .breadcrumb { color: var(--vscode-descriptionForeground); margin: 8px 0 20px; }
                .breadcrumb-separator { padding: 0 6px; }
                input, select, button, textarea { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 8px; margin-top: 6px; border-radius: 4px; box-sizing: border-box; font-family: inherit; font-size: inherit; }
                input, select, textarea { width: 100%; }
                button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; font-weight: 600; }
                button:hover { background: var(--vscode-button-hoverBackground); }
                button:disabled { opacity: 0.6; cursor: default; }
                .back-button { background: transparent; color: var(--vscode-textLink-foreground); padding: 4px 0; }
                .screen-heading, .environment-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
                .environment-card { margin-top: 16px; padding: 16px; border: 1px solid var(--vscode-panel-border); border-radius: 6px; background: var(--vscode-sideBar-background); }
                .screen-heading h3 { margin-top: 0; }
                .environment-actions button { width: auto; margin: 0; }
                .environment-list { margin-top: 12px; }
                .environment-row { padding: 12px 0; border-bottom: 1px solid var(--vscode-panel-border); }
                .environment-row:last-child { border-bottom: 0; padding-bottom: 0; }
                .environment-heading, .environment-actions { display: flex; align-items: center; gap: 10px; }
                .environment-name { font-weight: 600; }
                .environment-status { color: var(--vscode-testing-iconPassed); border: 1px solid currentColor; border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 600; }
                .environment-actions { flex-wrap: wrap; }
                .detail-toolbar { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); background: var(--vscode-editor-background); }
                .detail-actions { display: flex; gap: 8px; }
                .detail-toolbar button { width: auto; margin: 0; }
                .danger-action { background: transparent; color: var(--vscode-errorForeground); border: 1px solid var(--vscode-errorForeground); }
                .danger-action:hover { background: var(--vscode-inputValidation-errorBackground); }
                .primary-action { background: var(--vscode-button-prominent-background); color: var(--vscode-button-prominent-foreground); }
                .project-settings { margin-top: 28px; padding-top: 14px; border-top: 1px solid var(--vscode-panel-border); }
                .project-settings summary { cursor: pointer; color: var(--vscode-textLink-foreground); }
                .project-settings button, #createScreen > button[type="button"] { width: auto; }
                textarea { height: min(60vh, 500px); min-height: 220px; resize: vertical; font-family: var(--vscode-editor-font-family); }
                .field { margin: 16px 0; }
                .field label { display: block; }
                .description, .save-status { color: var(--vscode-descriptionForeground); font-size: 12px; }
                .save-status { min-height: 18px; }
                .screen-title { margin-top: 14px; }
                @media (max-width: 520px) {
                    body { padding: 12px; }
                    .app-header, .screen-heading, .environment-row, .detail-toolbar { align-items: stretch; flex-direction: column; }
                    .active-banner { white-space: normal; }
                    .environment-actions, .detail-actions { width: 100%; flex-direction: column; align-items: stretch; }
                    .environment-actions button, .detail-toolbar button { width: 100%; }
                }
            </style>
        </head>
        <body>
            <header class="app-header">
                <h2>⚙️ ${text.panelTitle}</h2>
                <p class="active-banner">${text.active}: <strong id="activeEnvSummary"></strong></p>
            </header>
            <nav id="breadcrumb" class="breadcrumb" aria-label="${text.environments}"></nav>
            
            <section id="listScreen" class="screen">
                <div class="screen-heading">
                    <h3 class="screen-title" tabindex="-1">${text.environments}</h3>
                    <button onclick="showCreateScreen()">${text.createEnvironment}</button>
                </div>
                <div class="environment-card">
                    <div id="environmentList" class="environment-list"></div>
                </div>
                <details class="project-settings">
                    <summary>${text.projectSettings}</summary>
                    <label for="projectNameInput">${text.projectName}</label>
                    <input type="text" id="projectNameInput" />
                    <button onclick="saveProjectName()">${text.updateProjectName}</button>
                </details>
            </section>

            <section id="detailScreen" class="screen" hidden>
                <div class="detail-toolbar">
                    <button type="button" class="back-button" onclick="showEnvironmentList()">‹ ${text.backToEnvironments}</button>
                    <div class="detail-actions">
                        <button id="pinEnvButton" onclick="pinEnv()">${text.pinAsActive}</button>
                        <button id="saveSecretsButton" class="primary-action" onclick="saveSecrets()">${text.saveChanges}</button>
                    </div>
                </div>
                <h3 id="detailEnvTitle" class="screen-title" tabindex="-1"></h3>
                <p id="detailEnvStatus"></p>
                <div class="field">
                    <label for="secretsEditor">${text.environmentSecrets}</label>
                    <textarea id="secretsEditor"></textarea>
                </div>
                <p id="saveStatus" class="save-status" aria-live="polite"></p>
            </section>

            <section id="createScreen" class="screen" hidden>
                <button type="button" class="back-button" onclick="showEnvironmentList()">‹ ${text.backToEnvironments}</button>
                <h3>${text.createEnvironment}</h3>
                <div class="field">
                    <label for="newEnvInput">${text.environmentName}</label>
                    <input type="text" id="newEnvInput" placeholder="${text.environmentNamePlaceholder}" required />
                </div>
                <div class="field">
                    <label for="baseEnvSelect">${text.copySecretsFrom}</label>
                    <select id="baseEnvSelect"></select>
                </div>
                <p class="description">${text.copyUnsavedNotice}</p>
                <button onclick="createEnv()">${text.createEnvironment}</button>
                <button type="button" class="back-button" onclick="showEnvironmentList()">${text.cancel}</button>
            </section>

            <script>
                const vscode = acquireVsCodeApi();
                const text = ${JSON.stringify(text)};
                const state = { activeEnv: '', selectedEnv: '', availableEnvs: [], screen: 'list', dirty: false, savedSecrets: '' };

                // Solicita los datos iniciales cuando se carga el panel.
                window.onload = () => { vscode.postMessage({ command: 'getData' }); };

                // Muestra una de las pantallas principales del panel.
                function showScreen(name) {
                    state.screen = name;
                    document.querySelectorAll('.screen').forEach(screen => {
                        screen.hidden = screen.id !== name + 'Screen';
                    });
                    const breadcrumb = document.getElementById('breadcrumb');
                    breadcrumb.replaceChildren();
                    const root = document.createElement('span');
                    root.textContent = text.environments;
                    breadcrumb.appendChild(root);
                    if (name !== 'list') {
                        const separator = document.createElement('span');
                        separator.className = 'breadcrumb-separator';
                        separator.textContent = '/';
                        breadcrumb.appendChild(separator);
                        const current = document.createElement('span');
                        current.textContent = name === 'detail' ? state.selectedEnv.toUpperCase() : text.createEnvironment;
                        breadcrumb.appendChild(current);
                    }
                }

                // Vuelve a la lista de entornos.
                function showEnvironmentList() {
                    requestNavigation('list');
                }

                // Abre el formulario de creación y propone como base el entorno inspeccionado.
                function showCreateScreen() {
                    requestNavigation('create');
                }

                // Protege los cambios del editor antes de abandonar su detalle.
                function requestNavigation(target, env) {
                    if (!state.dirty) {
                        performNavigation(target, env);
                        return;
                    }
                    vscode.postMessage({
                        command: 'confirmNavigation',
                        target,
                        env,
                        currentEnv: state.selectedEnv,
                        secretsData: document.getElementById('secretsEditor').value
                    });
                }

                // Completa la navegación aprobada y lleva el foco al contenido nuevo.
                function performNavigation(target, env) {
                    state.dirty = false;
                    if (target === 'detail') {
                        state.selectedEnv = env;
                        showScreen('detail');
                        vscode.postMessage({ command: 'selectEnv', env });
                    } else if (target === 'create') {
                        document.getElementById('newEnvInput').value = '';
                        document.getElementById('baseEnvSelect').value = state.selectedEnv || state.activeEnv;
                        showScreen('create');
                        document.getElementById('newEnvInput').focus();
                    } else {
                        showScreen('list');
                        document.querySelector('#listScreen h3').focus();
                    }
                }

                // Actualiza el estado del borrador y evita activar datos que aún no se guardaron.
                function updateEditState() {
                    const editor = document.getElementById('secretsEditor');
                    state.dirty = editor.value !== state.savedSecrets;
                    const pinButton = document.getElementById('pinEnvButton');
                    const isActive = state.selectedEnv === state.activeEnv;
                    pinButton.disabled = isActive || state.dirty;
                    pinButton.textContent = isActive ? text.pinned : text.pinAsActive;
                    document.getElementById('detailEnvStatus').textContent = state.dirty
                        ? text.saveBeforeActivate
                        : isActive ? text.environmentActive : text.environmentNotActive;
                }

                // Construye la lista de entornos sin mezclarla con el detalle o la creación.
                function renderEnvironmentList() {
                    const list = document.getElementById('environmentList');
                    list.replaceChildren();
                    state.availableEnvs.forEach(env => {
                        const row = document.createElement('div');
                        row.className = 'environment-row';

                        const heading = document.createElement('div');
                        heading.className = 'environment-heading';
                        const name = document.createElement('span');
                        name.className = 'environment-name';
                        name.textContent = env.toUpperCase();
                        heading.appendChild(name);

                        if (env === state.activeEnv) {
                            const status = document.createElement('span');
                            status.className = 'environment-status';
                            status.textContent = text.active;
                            heading.appendChild(status);
                        }
                        row.appendChild(heading);

                        const actions = document.createElement('div');
                        actions.className = 'environment-actions';
                        const viewButton = document.createElement('button');
                        viewButton.textContent = text.viewEnvironment;
                        viewButton.addEventListener('click', () => openEnvironment(env));
                        actions.appendChild(viewButton);
                        if (env !== state.activeEnv) {
                            const activateButton = document.createElement('button');
                            activateButton.textContent = text.pinAsActive;
                            activateButton.addEventListener('click', () => pinEnv(env, 'list'));
                            actions.appendChild(activateButton);
                            if (state.availableEnvs.length > 1) {
                                const deleteButton = document.createElement('button');
                                deleteButton.className = 'danger-action';
                                deleteButton.textContent = text.deleteEnvironment;
                                deleteButton.addEventListener('click', () => vscode.postMessage({ command: 'deleteEnv', env }));
                                actions.appendChild(deleteButton);
                            }
                        }
                        row.appendChild(actions);
                        list.appendChild(row);
                    });
                }

                // Refresca los controles al recibir datos desde la extensión.
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'saveResult') {
                        if (message.saved) {
                            state.savedSecrets = document.getElementById('secretsEditor').value;
                            state.dirty = false;
                            const savedMessage = message.env === state.activeEnv ? text.savedActive : text.savedInactive;
                            document.getElementById('saveStatus').textContent = savedMessage
                                .replace('{env}', message.env.toUpperCase())
                                .replace('{active}', state.activeEnv.toUpperCase());
                        } else {
                            document.getElementById('saveStatus').textContent = text.invalidSecretsJson;
                        }
                        updateEditState();
                        return;
                    }
                    if (message.command === 'navigationConfirmed') {
                        performNavigation(message.target, message.env);
                        return;
                    }
                    if (message.command === 'loadData') {
                        state.activeEnv = message.config.env;
                        state.selectedEnv = message.selectedEnv;
                        state.availableEnvs = message.availableEnvs;
                        document.getElementById('projectNameInput').value = message.config.projectName;
                        document.getElementById('activeEnvSummary').textContent = state.activeEnv.toUpperCase();
                        document.getElementById('detailEnvTitle').textContent = state.selectedEnv.toUpperCase();
                        renderEnvironmentList();

                        const baseSelect = document.getElementById('baseEnvSelect');
                        const previousBase = baseSelect.value;
                        baseSelect.replaceChildren();
                        const emptyOption = document.createElement('option');
                        emptyOption.value = '';
                        emptyOption.innerText = text.emptyBase;
                        baseSelect.appendChild(emptyOption);
                        state.availableEnvs.forEach(env => {
                            const opt = document.createElement('option');
                            opt.value = env;
                            opt.innerText = env.toUpperCase();
                            baseSelect.appendChild(opt);
                        });
                        baseSelect.value = state.availableEnvs.includes(previousBase)
                            ? previousBase
                            : state.selectedEnv || state.activeEnv;

                        const pinButton = document.getElementById('pinEnvButton');

                        if (!message.preserveSecretsEditor) {
                            document.getElementById('secretsEditor').value = message.secretsJson;
                            state.savedSecrets = message.secretsJson;
                            state.dirty = false;
                            document.getElementById('saveStatus').textContent = '';
                        }
                        updateEditState();
                        if (message.navigateTo) {
                            showScreen(message.navigateTo);
                            if (message.navigateTo === 'detail') {
                                document.getElementById('newEnvInput').value = '';
                                document.getElementById('detailEnvTitle').focus();
                            }
                        }
                    }
                });

                // Abre el detalle y carga los secretos del entorno sin activarlo.
                function openEnvironment(env) {
                    requestNavigation('detail', env);
                }

                // Fija el entorno seleccionado como activo para la aplicacion .NET.
                function pinEnv(env = state.selectedEnv, navigateTo = 'detail') {
                    vscode.postMessage({ command: 'pinEnv', env, navigateTo });
                }

                // Solicita crear un entorno desde el JSON que se está editando.
                function createEnv() {
                    const input = document.getElementById('newEnvInput');
                    if (input.reportValidity()) {
                        const envName = input.value;
                        const env = state.selectedEnv;
                        const baseEnv = document.getElementById('baseEnvSelect').value;
                        const secretsData = document.getElementById('secretsEditor').value;
                        vscode.postMessage({ command: 'createEnv', envName, baseEnv, secretsData, env });
                    }
                }

                // Envía el nuevo nombre de proyecto a la extensión.
                function saveProjectName() {
                    const newName = document.getElementById('projectNameInput').value;
                    vscode.postMessage({ command: 'updateProjectName', newName });
                }

                // Envía los secretos editados para validarlos y guardarlos.
                function saveSecrets() {
                    const env = state.selectedEnv;
                    const secretsData = document.getElementById('secretsEditor').value;
                    document.getElementById('saveStatus').textContent = '';
                    vscode.postMessage({ command: 'saveSecrets', env, secretsData });
                }

                document.getElementById('secretsEditor').addEventListener('input', updateEditState);
            </script>
        </body>
        </html>`;
    }
}

// No hay recursos adicionales que liberar al desactivar la extensión.
export function deactivate() {}