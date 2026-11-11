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
  <a href="https://github.com/jimovellan/net-secrets-management/blob/main/README.ru.md">Русский</a> ·
  <b>اردو</b>
</p>

ایک VS Code ایکسٹینشن جو ہر پروجیکٹ کے لیے [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) کے کئی **ماحول** (develop، qa، staging…) رکھتی ہے اور ایک کلک میں ان کے درمیان تبدیلی کی سہولت دیتی ہے۔

## خصوصیات

- **ہر پروجیکٹ کے لیے کئی ماحول**: ہر ماحول `secrets.<ماحول>.json` کے طور پر اس `secrets.json` کے ساتھ محفوظ ہوتا ہے جو .NET استعمال کرتا ہے۔
- **ایک کلک میں فعال کریں**: فعال ماحول `secrets.json` میں کاپی ہوتا ہے، اس لیے `dotnet run` کوڈ بدلے بغیر اسے استعمال کرتا ہے۔
- **بلٹ اِن JSON ایڈیٹر**: توثیق، غیر محفوظ تبدیلیوں کے ضائع ہونے سے تحفظ، اور خالی یا کسی دوسرے ماحول کی نقل سے نیا ماحول بنانا۔
- **ماحول حذف کرنا** تصدیق کے ساتھ۔ فعال ماحول اور پروجیکٹ کا آخری ماحول محفوظ رہتے ہیں۔
- **ترتیب شدہ سیکرٹس کا براؤزر**: مشین پر User Secrets والی تمام ایپلیکیشنز کے لیے۔ صرف ID دکھانے والے پروجیکٹس کا نام بدلیں، ماحول فعال یا حذف کریں، اور اقدار کو رنگین JSON میں دیکھیں — جو بطورِ طے شدہ چھپی ہوتی ہیں، ہر قدر یا پورا JSON کاپی کرنے کے بٹنوں کے ساتھ۔
- **انٹرفیس کی 10 زبانیں**: English، 简体中文، हिन्दी، Español، Français، العربية، বাংলা، Português (Brasil)، Русский اور اردو (دائیں سے بائیں ترتیب کے ساتھ)۔

## اسکرین شاٹس

**ماحول کی فہرست:** فعال ماحول نمایاں ہوتا ہے اور کسی بھی دوسرے کو فہرست سے ہی فعال کیا جا سکتا ہے۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
  <img alt="ماحول کی فہرست" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/environments-light.png">
</picture>

**سیکرٹ ایڈیٹر:** کسی ماحول کو فعال کیے بغیر اس کا JSON ترمیم کریں۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
  <img alt="سیکرٹ ایڈیٹر" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/editor-light.png">
</picture>

**ترتیب شدہ سیکرٹس کا براؤزر:** اسٹیٹس بار سے کھلتا ہے اور مشین کی تمام ایپلیکیشنز دکھاتا ہے۔ صرف ID دکھانے والے پروجیکٹس کا نام بدلا جا سکتا ہے۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
  <img alt="ترتیب شدہ سیکرٹس کا براؤزر" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-light.png">
</picture>

**ایپلیکیشن کے ماحول:** پروجیکٹ کھولے بغیر کوئی بھی ماحول فعال یا حذف کریں۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-environments-light.png">
  <img alt="براؤزر میں ماحول" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/browser-environments-light.png">
</picture>

**سیکرٹس کا منظر:** رنگین JSON، اقدار بطورِ طے شدہ چھپی ہوئی؛ ہر قدر دکھائیں یا کاپی کریں، یا پورا JSON کاپی کریں۔

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/secrets-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/secrets-light.png">
  <img alt="سیکرٹس کا منظر" src="https://raw.githubusercontent.com/jimovellan/net-secrets-management/main/images/secrets-light.png">
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

تمام ایپلیکیشنز کے ساتھ کام کرنے کے لیے اسٹیٹس بار میں **🔑 .NET سیکرٹ اور ماحول مینیجر** پر کلک کریں یا **ترتیب شدہ سیکرٹس دیکھیں** چلائیں۔ وہاں آپ پروجیکٹ کا **نام تبدیل کریں**، ماحول کو **فعال بنائیں** یا **حذف کریں**، اور سیکرٹس دکھانے اور کاپی کرنے کے لیے **اقدار دیکھیں** کھول سکتے ہیں۔

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
| **ترتیب شدہ سیکرٹس دیکھیں** | اسٹیٹس بار، Command Palette | ایپلیکیشنز اور ماحول کی فہرست: پروجیکٹس کا نام بدلیں، ماحول فعال یا حذف کریں، اور اقدار دیکھیں یا کاپی کریں۔ |

## یہ کیسے کام کرتی ہے

- **مقام**: فائلیں .NET User Secrets کی `secrets.json` کے ساتھ محفوظ ہوتی ہیں:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux اور macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **ہم آہنگی**: فعال ماحول محفوظ کرنے پر `secrets.json` بھی اپ ڈیٹ ہوتی ہے۔ اگر آپ VS Code میں براہِ راست `secrets.json` ترمیم کر کے محفوظ کریں تو تبدیلیاں واپس فعال ماحول میں کاپی ہو جاتی ہیں۔
- **نام**: ماحول کے نام میں صرف حروف، اعداد، ہائفن اور انڈر اسکور استعمال ہو سکتے ہیں، اور یہ چھوٹے حروف میں محفوظ ہوتے ہیں۔
- **حذف کرنا**: تصدیق کے بعد ماحول حذف کرنے سے اس کی `secrets.<ماحول>.json` فائل ہٹ جاتی ہے۔ فعال ماحول حذف نہیں کیا جا سکتا (پہلے کوئی دوسرا فعال کریں)، اور نہ ہی پروجیکٹ کا آخری ماحول۔
- **دکھایا جانے والا نام**: پروجیکٹ کا نام بدلنے سے صرف `.active-env` میں `projectName` محفوظ ہوتا ہے؛ سیکرٹ فائلیں تبدیل نہیں ہوتیں۔
- **منتقلی**: اگر پروجیکٹ فولڈر میں `.active-env`، `secrets.json` یا `secrets.*.json` فائلیں ہوں تو انہیں User Secrets اسٹور میں منتقل کر دیا جاتا ہے۔ موجودہ فائلیں کبھی اوور رائٹ نہیں ہوتیں؛ اس صورت میں انتباہ دکھایا جاتا ہے۔

## سیکیورٹی

> [!WARNING]
> .NET User Secrets کی طرح فائلیں **انکرپٹ نہیں ہوتیں**۔ یہ ایکسٹینشن صرف ڈیولپمنٹ سیکرٹس کے لیے استعمال کریں اور اس آپریٹنگ سسٹم اکاؤنٹ کو محفوظ رکھیں جہاں یہ محفوظ ہیں۔ اسے پروڈکشن اسناد کے لیے استعمال نہ کریں۔
