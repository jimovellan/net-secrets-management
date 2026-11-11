<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="images/logo-light.png">
    <img alt=".NET Secrets Manager" src="images/logo-light.png" width="520">
  </picture>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.ar.md">العربية</a> ·
  <a href="README.bn.md">বাংলা</a> ·
  <a href="README.pt-BR.md">Português (Brasil)</a> ·
  <a href="README.ru.md">Русский</a> ·
  <b>اردو</b>
</p>

ایک VS Code ایکسٹینشن جو ہر پروجیکٹ کے لیے [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) کے کئی **ماحول** (develop، qa، staging…) رکھتی ہے اور ایک کلک میں ان کے درمیان تبدیلی کی سہولت دیتی ہے۔

## خصوصیات

- **ہر پروجیکٹ کے لیے کئی ماحول**: ہر ماحول `secrets.<ماحول>.json` کے طور پر اس `secrets.json` کے ساتھ محفوظ ہوتا ہے جو .NET استعمال کرتا ہے۔
- **ایک کلک میں فعال کریں**: فعال ماحول `secrets.json` میں کاپی ہوتا ہے، اس لیے `dotnet run` کوڈ بدلے بغیر اسے استعمال کرتا ہے۔
- **بلٹ اِن JSON ایڈیٹر**: توثیق، غیر محفوظ تبدیلیوں کے ضائع ہونے سے تحفظ، اور خالی یا کسی دوسرے ماحول کی نقل سے نیا ماحول بنانا۔
- **صرف پڑھنے والا براؤزر**: مشین پر User Secrets والی تمام ایپلیکیشنز دیکھیں۔
- **انٹرفیس کی 10 زبانیں**: English، 简体中文، हिन्दी، Español، Français، العربية، বাংলা، Português (Brasil)، Русский اور اردو (دائیں سے بائیں ترتیب کے ساتھ)۔

## اسکرین شاٹس

**ماحول کی فہرست:** فعال ماحول نمایاں ہوتا ہے اور کسی بھی دوسرے کو فہرست سے ہی فعال کیا جا سکتا ہے۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/environments-light.png">
  <img alt="ماحول کی فہرست" src="images/environments-light.png">
</picture>

**سیکرٹ ایڈیٹر:** کسی ماحول کو فعال کیے بغیر اس کا JSON ترمیم کریں۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/editor-light.png">
  <img alt="سیکرٹ ایڈیٹر" src="images/editor-light.png">
</picture>

**ترتیب شدہ سیکرٹس کا براؤزر:** اسٹیٹس بار سے کھلتا ہے اور مشین کی تمام ایپلیکیشنز دکھاتا ہے۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/browser-light.png">
  <img alt="ترتیب شدہ سیکرٹس کا براؤزر" src="images/browser-light.png">
</picture>

> اسکرین شاٹس میں انگریزی انٹرفیس دکھایا گیا ہے۔ زبان `net-secrets-manager.language` سیٹنگ سے تبدیل کریں۔

## تقاضے

- VS Code 1.142 یا اس سے نیا۔
- `.csproj` فائل والا .NET پروجیکٹ۔
- `.csproj` میں `UserSecretsId` عنصر۔ اگر موجود نہ ہو تو پروجیکٹ فولڈر سے چلائیں:

```bash
dotnet user-secrets init
```

## فوری آغاز

1. Explorer میں اپنی `.csproj` پر رائٹ کلک کریں اور **.NET سیکرٹ مینیجر کھولیں** منتخب کریں (یا `.csproj` ایڈیٹر میں کھلی ہونے پر Command Palette سے یہی کمانڈ چلائیں)۔
2. `DEVELOP` ماحول خودکار طور پر بنتا ہے۔ اگر `secrets.json` پہلے سے موجود ہو تو اس کا مواد ابتدائی ڈیٹا کے طور پر استعمال ہوتا ہے۔
3. **ماحول بنائیں** پر کلک کریں، نام لکھیں (`qa`، `staging`، `local-docker`…) اور منتخب کریں کہ کسی دوسرے ماحول سے سیکرٹس کاپی کرنے ہیں یا خالی سے شروع کرنا ہے۔
4. JSON ترمیم کرنے کے لیے **دیکھیں** اور محفوظ کرنے کے لیے **تبدیلیاں محفوظ کریں** پر کلک کریں۔
5. .NET سے وہ ماحول استعمال کروانے کے لیے **فعال بنائیں** پر کلک کریں۔

تمام ایپلیکیشنز کے سیکرٹس دیکھنے کے لیے اسٹیٹس بار میں **🔑 .NET سیکرٹ اور ماحول مینیجر** پر کلک کریں یا **ترتیب شدہ سیکرٹس دیکھیں** کمانڈ چلائیں۔

## مثال

مثالی پروجیکٹ `Contoso.Api.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

`qa` اور `staging` ماحول بنانے کے بعد User Secrets فولڈر اس طرح دکھائی دیتا ہے:

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # active environment and display name
├── secrets.json             # copy of the active environment (read by .NET)
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

`secrets.staging.json` (مثالی ڈیٹا):

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

ایپلیکیشن کا کوڈ نہیں بدلتا؛ یہ پہلے کی طرح User Secrets پڑھتا ہے:

```csharp
var builder = WebApplication.CreateBuilder(args); // loads User Secrets in Development
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

`staging` فعال کرنے پر اس کا مواد `secrets.json` میں آ جاتا ہے اور اگلا `dotnet run` یہی قدریں استعمال کرتا ہے۔

## سیٹنگز

| سیٹنگ | قدریں | طے شدہ | تفصیل |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`, `en`, `zh-CN`, `hi`, `es`, `fr`, `ar`, `bn`, `pt-BR`, `ru`, `ur` | `en` | انٹرفیس کی زبان۔ `auto` VS Code کی ڈسپلے زبان کی پیروی کرتا ہے۔ |

```json
{
  "net-secrets-manager.language": "ur"
}
```

## کمانڈز

| کمانڈ | کہاں | کیا کرتی ہے |
| --- | --- | --- |
| **.NET سیکرٹ مینیجر کھولیں** | `.csproj` کا سیاقی مینو، Command Palette | اس پروجیکٹ کا ماحول مینیجر کھولتی ہے۔ |
| **ترتیب شدہ سیکرٹس دیکھیں** | اسٹیٹس بار، Command Palette | ایپلیکیشنز، ماحول اور قدروں کی صرف پڑھنے والی فہرست۔ |

## یہ کیسے کام کرتی ہے

- **مقام**: فائلیں .NET User Secrets کی `secrets.json` کے ساتھ محفوظ ہوتی ہیں:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux اور macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **ہم آہنگی**: فعال ماحول محفوظ کرنے پر `secrets.json` بھی اپ ڈیٹ ہوتی ہے۔ اگر آپ VS Code میں براہِ راست `secrets.json` ترمیم کر کے محفوظ کریں تو تبدیلیاں واپس فعال ماحول میں کاپی ہو جاتی ہیں۔
- **نام**: ماحول کے نام میں صرف حروف، اعداد، ہائفن اور انڈر اسکور استعمال ہو سکتے ہیں، اور یہ چھوٹے حروف میں محفوظ ہوتے ہیں۔
- **منتقلی**: اگر پروجیکٹ فولڈر میں `.active-env`، `secrets.json` یا `secrets.*.json` فائلیں ہوں تو انہیں User Secrets اسٹور میں منتقل کر دیا جاتا ہے۔ موجودہ فائلیں کبھی اوور رائٹ نہیں ہوتیں؛ اس صورت میں انتباہ دکھایا جاتا ہے۔

## سیکیورٹی

> [!WARNING]
> .NET User Secrets کی طرح فائلیں **انکرپٹ نہیں ہوتیں**۔ یہ ایکسٹینشن صرف ڈیولپمنٹ سیکرٹس کے لیے استعمال کریں اور اس آپریٹنگ سسٹم اکاؤنٹ کو محفوظ رکھیں جہاں یہ محفوظ ہیں۔ اسے پروڈکشن اسناد کے لیے استعمال نہ کریں۔
