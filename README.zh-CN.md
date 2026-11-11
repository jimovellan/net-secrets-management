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
  <b>简体中文</b> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.hi.md">हिन्दी</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.fr.md">Français</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ar.md">العربية</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.bn.md">বাংলা</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.pt-BR.md">Português (Brasil)</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ru.md">Русский</a> ·
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ur.md">اردو</a>
</p>

一个 VS Code 扩展，可为每个项目维护多个 [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) **环境**（develop、qa、staging……），并一键切换。

## 功能

- **每个项目多个环境**：每个环境保存为 `secrets.<环境>.json`，与 .NET 使用的 `secrets.json` 放在同一目录。
- **一键启用**：活动环境会被复制到 `secrets.json`，`dotnet run` 无需修改代码即可使用。
- **内置 JSON 编辑器**：支持校验、防止丢失未保存的更改，并可从空白或复制其他环境来创建新环境。
- **只读浏览器**：查看本机所有已配置 User Secrets 的应用。
- **10 种界面语言**：English、简体中文、हिन्दी、Español、Français、العربية、বাংলা、Português (Brasil)、Русский 和 اردو（支持从右到左布局）。

## 截图

**环境列表：** 活动环境会被标记，其他环境可直接在列表中启用。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
  <img alt="环境列表" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
</picture>

**密钥编辑器：** 编辑某个环境的 JSON，而无需启用它。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
  <img alt="密钥编辑器" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
</picture>

**已配置密钥浏览器：** 从状态栏打开，列出本机的所有应用。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
  <img alt="已配置密钥浏览器" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
</picture>

> 截图显示的是英文界面。可通过 `net-secrets-manager.language` 设置更改语言。

## 要求

- VS Code 1.142 或更高版本。
- 包含 `.csproj` 文件的 .NET 项目。
- `.csproj` 中包含 `UserSecretsId` 元素。如果没有，请在项目目录中运行：

```bash
dotnet user-secrets init
```

## 快速开始

1. 在资源管理器中右键单击 `.csproj`，选择 **打开 .NET 密钥管理器**（或在编辑器中打开 `.csproj` 时，从命令面板运行该命令）。
2. 系统会自动创建 `DEVELOP` 环境。如果已存在 `secrets.json`，将以其内容作为初始值。
3. 单击 **创建环境**，输入名称（`qa`、`staging`、`local-docker`……），并选择从其他环境复制密钥或从空环境开始。
4. 单击 **查看** 编辑 JSON，然后单击 **保存更改**。
5. 单击 **设为活动环境**，让 .NET 使用该环境。

要浏览所有应用的密钥，请单击状态栏中的 **🔑 .NET 密钥和环境**，或运行 **浏览已配置的密钥**。

## 示例

示例项目 `Contoso.Api.csproj`：

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

创建 `qa` 和 `staging` 环境后，User Secrets 目录如下：

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # 活动环境和显示名称
├── secrets.json             # 活动环境的副本（由 .NET 读取）
├── secrets.develop.json
├── secrets.qa.json
└── secrets.staging.json
```

`.active-env`：

```json
{
  "env": "develop",
  "projectName": "Contoso.Api"
}
```

`secrets.staging.json`（示例数据）：

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

应用代码无需修改，照常读取 User Secrets：

```csharp
var builder = WebApplication.CreateBuilder(args); // 在 Development 环境中加载 User Secrets
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

启用 `staging` 后，其内容会写入 `secrets.json`，下一次 `dotnet run` 将使用这些值。

## 设置

| 设置 | 取值 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`、`en`、`zh-CN`、`hi`、`es`、`fr`、`ar`、`bn`、`pt-BR`、`ru`、`ur` | `en` | 界面语言。`auto` 跟随 VS Code 的显示语言。 |

```json
{
  "net-secrets-manager.language": "zh-CN"
}
```

## 命令

| 命令 | 位置 | 作用 |
| --- | --- | --- |
| **打开 .NET 密钥管理器** | `.csproj` 上下文菜单、命令面板 | 打开该项目的环境管理器。 |
| **浏览已配置的密钥** | 状态栏、命令面板 | 只读查看应用、环境和值。 |

## 工作原理

- **位置**：文件保存在 .NET User Secrets 的 `secrets.json` 旁边：
  - Windows：`%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux 和 macOS：`~/.microsoft/usersecrets/<UserSecretsId>/`
- **同步**：保存活动环境时也会更新 `secrets.json`。如果在 VS Code 中直接编辑并保存 `secrets.json`，更改会复制回活动环境。
- **名称**：环境名称只能包含字母、数字、连字符和下划线，并以小写形式保存。
- **迁移**：如果项目目录中存在 `.active-env`、`secrets.json` 或 `secrets.*.json` 文件，它们会被移动到 User Secrets 存储中。现有文件绝不会被覆盖，此时会显示警告。

## 安全

> [!WARNING]
> 与 .NET User Secrets 一样，文件**未加密**。请仅将此扩展用于开发环境密钥，并保护存储这些文件的操作系统账户。不要用于生产环境凭据。
