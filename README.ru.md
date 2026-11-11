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
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.pt-BR.md">Português (Brasil)</a> ·
  <b>Русский</b> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ur.md">اردو</a>
</p>

Расширение VS Code, которое хранит несколько **сред** (develop, qa, staging…) [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) для каждого проекта и переключает их одним щелчком.

## Возможности

- **Несколько сред на проект**: каждая хранится в файле `secrets.<среда>.json` рядом с `secrets.json`, который использует .NET.
- **Активация одним щелчком**: активная среда копируется в `secrets.json`, и `dotnet run` использует её без изменения кода.
- **Встроенный редактор JSON** с проверкой, защитой от потери несохранённых изменений и созданием пустых сред или копий других сред.
- **Просмотр только для чтения** всех приложений на компьютере, для которых настроены User Secrets.
- **10 языков интерфейса**: English, 简体中文, हिन्दी, Español, Français, العربية, বাংলা, Português (Brasil), Русский и اردو (с раскладкой справа налево).

## Скриншоты

**Список сред:** активная среда отмечена, любую другую можно активировать прямо из списка.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
  <img alt="Список сред" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
</picture>

**Редактор секретов:** редактируйте JSON среды, не активируя её.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
  <img alt="Редактор секретов" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
</picture>

**Просмотр настроенных секретов:** открывается из строки состояния и показывает все приложения на компьютере.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
  <img alt="Просмотр настроенных секретов" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
</picture>

> На скриншотах показан интерфейс на английском. Язык меняется параметром `net-secrets-manager.language`.

## Требования

- VS Code 1.142 или новее.
- Проект .NET с файлом `.csproj`.
- Элемент `UserSecretsId` в `.csproj`. Если его нет, выполните в папке проекта:

```bash
dotnet user-secrets init
```

## Быстрый старт

1. Щёлкните правой кнопкой по `.csproj` в проводнике и выберите **Открыть менеджер секретов .NET** (или запустите эту команду из палитры команд, когда `.csproj` открыт в редакторе).
2. Среда `DEVELOP` создаётся автоматически. Если `secrets.json` уже существовал, его содержимое станет отправной точкой.
3. Нажмите **Создать среду**, введите имя (`qa`, `staging`, `local-docker`…) и выберите, копировать ли секреты из другой среды или начать с пустой.
4. Нажмите **Открыть**, чтобы отредактировать JSON, и **Сохранить изменения**, чтобы сохранить его.
5. Нажмите **Сделать активной**, чтобы .NET использовал эту среду.

Чтобы просмотреть секреты всех приложений, нажмите **🔑 Менеджер секретов и сред .NET** в строке состояния или выполните **Просмотреть настроенные секреты**.

## Пример

Пример проекта `Contoso.Api.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

После создания сред `qa` и `staging` папка User Secrets выглядит так:

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # активная среда и отображаемое имя
├── secrets.json             # копия активной среды (читается .NET)
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

`secrets.staging.json` (пример данных):

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

Код приложения не меняется — он, как обычно, читает User Secrets:

```csharp
var builder = WebApplication.CreateBuilder(args); // загружает User Secrets в Development
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

При активации `staging` её содержимое копируется в `secrets.json`, и следующий `dotnet run` использует эти значения.

## Настройки

| Параметр | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`, `en`, `zh-CN`, `hi`, `es`, `fr`, `ar`, `bn`, `pt-BR`, `ru`, `ur` | `en` | Язык интерфейса. `auto` следует языку отображения VS Code. |

```json
{
  "net-secrets-manager.language": "ru"
}
```

## Команды

| Команда | Где | Что делает |
| --- | --- | --- |
| **Открыть менеджер секретов .NET** | Контекстное меню `.csproj`, палитра команд | Открывает менеджер сред проекта. |
| **Просмотреть настроенные секреты** | Строка состояния, палитра команд | Список приложений, сред и значений только для чтения. |

## Как это работает

- **Расположение**: файлы хранятся рядом с `secrets.json` из .NET User Secrets:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux и macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **Синхронизация**: при сохранении активной среды обновляется и `secrets.json`. Если отредактировать и сохранить `secrets.json` прямо в VS Code, изменения копируются обратно в активную среду.
- **Имена**: имена сред могут содержать только буквы, цифры, дефисы и подчёркивания и сохраняются в нижнем регистре.
- **Миграция**: файлы `.active-env`, `secrets.json` или `secrets.*.json` из папки проекта переносятся в хранилище User Secrets. Существующие файлы никогда не перезаписываются — вместо этого показывается предупреждение.

## Безопасность

> [!WARNING]
> Как и в .NET User Secrets, файлы **не шифруются**. Используйте расширение только для секретов разработки и защищайте учётную запись операционной системы, в которой они хранятся. Не используйте его для учётных данных production.
