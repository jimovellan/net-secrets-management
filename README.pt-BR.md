<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/logo-light.png">
    <img alt=".NET Secrets Manager" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/logo-light.png" width="520">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.md">English</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.es.md">Español</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.zh-CN.md">简体中文</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.hi.md">हिन्दी</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.fr.md">Français</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ar.md">العربية</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.bn.md">বাংলা</a> ·
  <b>Português (Brasil)</b> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ru.md">Русский</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ur.md">اردو</a>
</p>

Extensão do VS Code para manter vários **ambientes** (develop, qa, staging…) de [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) por projeto e alternar entre eles com um clique.

## Recursos

- **Vários ambientes por projeto**: cada um é salvo como `secrets.<ambiente>.json`, ao lado do `secrets.json` usado pelo .NET.
- **Ativação com um clique**: o ambiente ativo é copiado para `secrets.json`, então o `dotnet run` passa a usá-lo sem alterar o código.
- **Editor JSON integrado** com validação, proteção contra perda de alterações não salvas e criação de ambientes vazios ou copiados de outro.
- **Navegador somente leitura** de todos os aplicativos com User Secrets configurados na máquina.
- **10 idiomas de interface**: English, 简体中文, हिन्दी, Español, Français, العربية, বাংলা, Português (Brasil), Русский e اردو (com layout da direita para a esquerda).

## Capturas de tela

**Lista de ambientes:** o ambiente ativo fica destacado e qualquer outro pode ser ativado direto da lista.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
  <img alt="Lista de ambientes" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
</picture>

**Editor de segredos:** edite o JSON de um ambiente sem ativá-lo.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
  <img alt="Editor de segredos" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
</picture>

**Navegador de segredos configurados:** aberto pela barra de status, lista todos os aplicativos da máquina.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
  <img alt="Navegador de segredos configurados" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
</picture>

> As capturas mostram a interface em inglês. Altere o idioma com a configuração `net-secrets-manager.language`.

## Requisitos

- VS Code 1.142 ou posterior.
- Um projeto .NET com um arquivo `.csproj`.
- Um elemento `UserSecretsId` no `.csproj`. Se ele não existir, execute na pasta do projeto:

```bash
dotnet user-secrets init
```

## Início rápido

1. Clique com o botão direito no seu `.csproj` no Explorer e escolha **Abrir gerenciador de segredos .NET** (ou execute esse comando pela Paleta de Comandos com o `.csproj` aberto no editor).
2. O ambiente `DEVELOP` é criado automaticamente. Se `secrets.json` já existia, o conteúdo dele é usado como ponto de partida.
3. Clique em **Criar ambiente**, digite um nome (`qa`, `staging`, `local-docker`…) e escolha se quer copiar os segredos de outro ambiente ou começar vazio.
4. Clique em **Visualizar** para editar o JSON e em **Salvar alterações** para salvá-lo.
5. Clique em **Definir como ativo** para que o .NET use esse ambiente.

Para explorar os segredos de todos os aplicativos, clique em **🔑 Gerenciador de segredos e ambientes .NET** na barra de status ou execute **Explorar segredos configurados**.

## Exemplo

Projeto de exemplo `Contoso.Api.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

Depois de criar os ambientes `qa` e `staging`, a pasta do User Secrets fica assim:

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # ambiente ativo e nome de exibição
├── secrets.json             # cópia do ambiente ativo (lido pelo .NET)
├── secrets.develop.json
├── secrets.qa.json
└── secrets.staging.json
```

`.active-env`:

```json
{
  "env": "develop",
  "projectName": "Contoso.Api"
}
```

`secrets.staging.json` (dados de exemplo):

```json
{
  "ConnectionStrings:Default": "Server=sql-staging.contoso.local;Database=Contoso;User Id=app;Password=St4g!ng-Pa55",
  "Jwt:Issuer": "https://auth.staging.contoso.dev",
  "Jwt:SigningKey": "c2VjcmV0LXN0YWdpbmcta2V5LTEyMzQ1Njc4OTA=",
  "Stripe:ApiKey": "sk_test_51Hx_EXAMPLE_staging",
  "Smtp:Host": "smtp.mailtrap.io",
  "FeatureFlags:NewCheckout": "true"
}
```

O código do aplicativo não muda. Ele continua lendo os User Secrets normalmente:

```csharp
var builder = WebApplication.CreateBuilder(args); // carrega os User Secrets em Development
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

Ao ativar `staging`, o conteúdo dele vai para `secrets.json` e o próximo `dotnet run` usa esses valores.

## Configurações

| Configuração | Valores | Padrão | Descrição |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`, `en`, `zh-CN`, `hi`, `es`, `fr`, `ar`, `bn`, `pt-BR`, `ru`, `ur` | `en` | Idioma da interface. `auto` segue o idioma de exibição do VS Code. |

```json
{
  "net-secrets-manager.language": "pt-BR"
}
```

## Comandos

| Comando | Onde | O que faz |
| --- | --- | --- |
| **Abrir gerenciador de segredos .NET** | Menu de contexto do `.csproj`, Paleta de Comandos | Abre o gerenciador de ambientes do projeto. |
| **Explorar segredos configurados** | Barra de status, Paleta de Comandos | Lista somente leitura de aplicativos, ambientes e valores. |

## Como funciona

- **Local**: os arquivos são salvos ao lado do `secrets.json` do .NET User Secrets:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux e macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **Sincronização**: ao salvar o ambiente ativo, `secrets.json` também é atualizado. Se você editar e salvar `secrets.json` diretamente no VS Code, as alterações são copiadas de volta para o ambiente ativo.
- **Nomes**: os ambientes aceitam apenas letras, números, hifens e sublinhados, e são salvos em minúsculas.
- **Migração**: se houver arquivos `.active-env`, `secrets.json` ou `secrets.*.json` na pasta do projeto, eles são movidos para o armazenamento do User Secrets. Arquivos existentes nunca são sobrescritos; nesse caso, é exibido um aviso.

## Segurança

> [!WARNING]
> Assim como no .NET User Secrets, os arquivos **não são criptografados**. Use esta extensão apenas para segredos de desenvolvimento e proteja a conta do sistema operacional onde eles ficam armazenados. Não a use para credenciais de produção.
