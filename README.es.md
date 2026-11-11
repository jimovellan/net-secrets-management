<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="images/logo-light.png">
    <img alt=".NET Secrets Manager" src="images/logo-light.png" width="520">
  </picture>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <b>Español</b> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.ar.md">العربية</a> ·
  <a href="README.bn.md">বাংলা</a> ·
  <a href="README.pt-BR.md">Português (Brasil)</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.ur.md">اردو</a>
</p>

Extensión de VS Code para mantener varios **entornos** (develop, qa, staging…) de [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) por proyecto y cambiar entre ellos con un clic.

## Características

- **Varios entornos por proyecto**: cada uno se guarda como `secrets.<entorno>.json` junto al `secrets.json` que usa .NET.
- **Activación con un clic**: el entorno activo se copia a `secrets.json`, así que `dotnet run` lo usa sin cambiar código.
- **Editor JSON integrado** con validación, protección contra la pérdida de cambios sin guardar y creación de entornos vacíos o copiados de otro.
- **Explorador de solo lectura** de todas las aplicaciones con User Secrets configurados en la máquina.
- **10 idiomas de interfaz**: English, 简体中文, हिन्दी, Español, Français, العربية, বাংলা, Português (Brasil), Русский y اردو (con diseño de derecha a izquierda).

## Capturas

**Lista de entornos:** el entorno activo aparece marcado y cualquier otro se puede activar desde la lista.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/environments-light.png">
  <img alt="Lista de entornos" src="images/environments-light.png">
</picture>

**Editor de secretos:** edita el JSON de un entorno sin activarlo.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/editor-light.png">
  <img alt="Editor de secretos" src="images/editor-light.png">
</picture>

**Explorador de secretos configurados:** se abre desde la barra de estado y lista todas las aplicaciones de la máquina.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/browser-light.png">
  <img alt="Explorador de secretos configurados" src="images/browser-light.png">
</picture>

> Las capturas muestran la interfaz en inglés. Cambia el idioma con el ajuste `net-secrets-manager.language`.

## Requisitos

- VS Code 1.142 o posterior.
- Un proyecto .NET con un archivo `.csproj`.
- Un elemento `UserSecretsId` en el `.csproj`. Si falta, ejecuta esto desde la carpeta del proyecto:

```bash
dotnet user-secrets init
```

## Inicio rápido

1. Haz clic derecho en tu `.csproj` en el Explorador y elige **Abrir gestor de secretos .NET** (o ejecuta ese comando desde la paleta de comandos con el `.csproj` abierto en el editor).
2. Se crea automáticamente el entorno `DEVELOP`. Si ya existía `secrets.json`, se usa su contenido como punto de partida.
3. Pulsa **Crear entorno**, escribe un nombre (`qa`, `staging`, `local-docker`…) y elige si copiar los secretos de otro entorno o empezar vacío.
4. Pulsa **Ver** para editar el JSON y **Guardar cambios** para guardarlo.
5. Pulsa **Fijar como activo** para que .NET use ese entorno.

Para explorar los secretos de todas las aplicaciones, pulsa **🔑 Gestor de secretos y entornos .NET** en la barra de estado o ejecuta **Explorar secretos configurados**.

## Ejemplo

Proyecto de ejemplo `Contoso.Api.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

Después de crear los entornos `qa` y `staging`, la carpeta de User Secrets queda así:

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # entorno activo y nombre visible
├── secrets.json             # copia del entorno activo (lo lee .NET)
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

`secrets.staging.json` (datos de ejemplo):

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

El código de la aplicación no cambia. Sigue leyendo User Secrets como siempre:

```csharp
var builder = WebApplication.CreateBuilder(args); // carga User Secrets en Development
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

Al activar `staging`, su contenido pasa a `secrets.json` y el siguiente `dotnet run` usa esos valores.

## Configuración

| Ajuste | Valores | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`, `en`, `zh-CN`, `hi`, `es`, `fr`, `ar`, `bn`, `pt-BR`, `ru`, `ur` | `en` | Idioma de la interfaz. `auto` sigue el idioma de VS Code. |

```json
{
  "net-secrets-manager.language": "es"
}
```

## Comandos

| Comando | Dónde | Qué hace |
| --- | --- | --- |
| **Abrir gestor de secretos .NET** | Menú contextual del `.csproj`, paleta de comandos | Abre el gestor de entornos de ese proyecto. |
| **Explorar secretos configurados** | Barra de estado, paleta de comandos | Lista de solo lectura de aplicaciones, entornos y valores. |

## Funcionamiento

- **Ubicación**: los archivos se guardan junto al `secrets.json` de .NET User Secrets:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux y macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **Sincronización**: al guardar el entorno activo también se actualiza `secrets.json`. Si editas `secrets.json` directamente en VS Code y lo guardas, los cambios se copian al entorno activo.
- **Nombres**: los entornos solo admiten letras, números, guiones y guiones bajos, y se guardan en minúsculas.
- **Migración**: si hay archivos `.active-env`, `secrets.json` o `secrets.*.json` en la carpeta del proyecto, se mueven al almacén de User Secrets. Nunca se sobrescriben archivos existentes; en ese caso se muestra una advertencia.

## Seguridad

> [!WARNING]
> Los archivos **no se cifran**, igual que en .NET User Secrets. Usa esta extensión solo para secretos de desarrollo y protege la cuenta del sistema operativo donde se guardan. No la uses para credenciales de producción.
