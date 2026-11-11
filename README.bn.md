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
  <b>বাংলা</b> ·
  <a href="README.pt-BR.md">Português (Brasil)</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.ur.md">اردو</a>
</p>

একটি VS Code এক্সটেনশন, যা প্রতিটি প্রজেক্টের জন্য [.NET User Secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets)-এর একাধিক **এনভায়রনমেন্ট** (develop, qa, staging…) রাখে এবং এক ক্লিকে সেগুলোর মধ্যে বদল করতে দেয়।

## বৈশিষ্ট্য

- **প্রতি প্রজেক্টে একাধিক এনভায়রনমেন্ট**: প্রতিটি এনভায়রনমেন্ট `secrets.<এনভায়রনমেন্ট>.json` হিসেবে .NET-এর ব্যবহৃত `secrets.json`-এর পাশে সংরক্ষিত হয়।
- **এক ক্লিকে সক্রিয়করণ**: সক্রিয় এনভায়রনমেন্ট `secrets.json`-এ কপি হয়, তাই কোড না বদলেই `dotnet run` সেটি ব্যবহার করে।
- **বিল্ট-ইন JSON এডিটর**: যাচাই, সংরক্ষণ না করা পরিবর্তন হারানো থেকে সুরক্ষা, এবং খালি বা অন্য এনভায়রনমেন্টের কপি থেকে নতুন এনভায়রনমেন্ট তৈরি।
- **শুধু-পড়ার ব্রাউজার**: মেশিনে User Secrets কনফিগার করা সব অ্যাপ্লিকেশন দেখুন।
- **১০টি ইন্টারফেস ভাষা**: English, 简体中文, हिन्दी, Español, Français, العربية, বাংলা, Português (Brasil), Русский এবং اردو (ডান থেকে বাম লেআউটসহ)।

## স্ক্রিনশট

**এনভায়রনমেন্ট তালিকা:** সক্রিয় এনভায়রনমেন্ট চিহ্নিত থাকে, আর অন্য যেকোনোটি তালিকা থেকেই সক্রিয় করা যায়।

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/environments-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/environments-light.png">
  <img alt="এনভায়রনমেন্ট তালিকা" src="images/environments-light.png">
</picture>

**সিক্রেট এডিটর:** কোনো এনভায়রনমেন্ট সক্রিয় না করেই তার JSON সম্পাদনা করুন।

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/editor-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/editor-light.png">
  <img alt="সিক্রেট এডিটর" src="images/editor-light.png">
</picture>

**কনফিগার করা সিক্রেট ব্রাউজার:** স্ট্যাটাস বার থেকে খোলে এবং মেশিনের সব অ্যাপ্লিকেশন দেখায়।

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/browser-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="images/browser-light.png">
  <img alt="কনফিগার করা সিক্রেট ব্রাউজার" src="images/browser-light.png">
</picture>

> স্ক্রিনশটে ইংরেজি ইন্টারফেস দেখানো হয়েছে। `net-secrets-manager.language` সেটিং দিয়ে ভাষা বদলান।

## প্রয়োজনীয়তা

- VS Code 1.142 বা তার পরের সংস্করণ।
- `.csproj` ফাইলসহ একটি .NET প্রজেক্ট।
- `.csproj`-এ একটি `UserSecretsId` এলিমেন্ট। না থাকলে প্রজেক্ট ফোল্ডার থেকে চালান:

```bash
dotnet user-secrets init
```

## দ্রুত শুরু

1. Explorer-এ আপনার `.csproj`-এ রাইট-ক্লিক করে **.NET সিক্রেট ম্যানেজার খুলুন** বেছে নিন (অথবা `.csproj` এডিটরে খোলা থাকা অবস্থায় Command Palette থেকে একই কমান্ড চালান)।
2. `DEVELOP` এনভায়রনমেন্ট স্বয়ংক্রিয়ভাবে তৈরি হয়। আগে থেকে `secrets.json` থাকলে তার বিষয়বস্তু শুরুর ডেটা হিসেবে ব্যবহৃত হয়।
3. **এনভায়রনমেন্ট তৈরি করুন**-এ ক্লিক করে একটি নাম লিখুন (`qa`, `staging`, `local-docker`…) এবং অন্য এনভায়রনমেন্ট থেকে সিক্রেট কপি করবেন নাকি খালি শুরু করবেন তা বেছে নিন।
4. JSON সম্পাদনা করতে **দেখুন** এবং সংরক্ষণ করতে **পরিবর্তন সংরক্ষণ করুন**-এ ক্লিক করুন।
5. .NET যেন সেই এনভায়রনমেন্ট ব্যবহার করে, সেজন্য **সক্রিয় হিসেবে সেট করুন**-এ ক্লিক করুন।

সব অ্যাপ্লিকেশনের সিক্রেট দেখতে স্ট্যাটাস বারে **🔑 .NET সিক্রেট ও এনভায়রনমেন্ট ম্যানেজার**-এ ক্লিক করুন অথবা **কনফিগার করা সিক্রেট দেখুন** কমান্ড চালান।

## উদাহরণ

উদাহরণ প্রজেক্ট `Contoso.Api.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <UserSecretsId>aa8777eb-605c-4fc9-a17e-bab7fc9f9dda</UserSecretsId>
  </PropertyGroup>
</Project>
```

`qa` ও `staging` এনভায়রনমেন্ট তৈরির পর User Secrets ফোল্ডার এমন দেখায়:

```text
~/.microsoft/usersecrets/aa8777eb-605c-4fc9-a17e-bab7fc9f9dda/
├── .active-env              # সক্রিয় এনভায়রনমেন্ট ও প্রদর্শিত নাম
├── secrets.json             # সক্রিয় এনভায়রনমেন্টের কপি (.NET এটি পড়ে)
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

`secrets.staging.json` (উদাহরণ ডেটা):

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

অ্যাপ্লিকেশনের কোড বদলায় না; এটি আগের মতোই User Secrets পড়ে:

```csharp
var builder = WebApplication.CreateBuilder(args); // Development-এ User Secrets লোড করে
var connectionString = builder.Configuration.GetConnectionString("Default");
var issuer = builder.Configuration["Jwt:Issuer"];
```

`staging` সক্রিয় করলে তার বিষয়বস্তু `secrets.json`-এ যায় এবং পরের `dotnet run` সেই মানগুলো ব্যবহার করে।

## সেটিংস

| সেটিং | মান | ডিফল্ট | বিবরণ |
| --- | --- | --- | --- |
| `net-secrets-manager.language` | `auto`, `en`, `zh-CN`, `hi`, `es`, `fr`, `ar`, `bn`, `pt-BR`, `ru`, `ur` | `en` | ইন্টারফেসের ভাষা। `auto` VS Code-এর প্রদর্শন ভাষা অনুসরণ করে। |

```json
{
  "net-secrets-manager.language": "bn"
}
```

## কমান্ড

| কমান্ড | কোথায় | কী করে |
| --- | --- | --- |
| **.NET সিক্রেট ম্যানেজার খুলুন** | `.csproj`-এর কনটেক্সট মেনু, Command Palette | সেই প্রজেক্টের এনভায়রনমেন্ট ম্যানেজার খোলে। |
| **কনফিগার করা সিক্রেট দেখুন** | স্ট্যাটাস বার, Command Palette | অ্যাপ্লিকেশন, এনভায়রনমেন্ট ও মানের শুধু-পড়ার তালিকা। |

## এটি কীভাবে কাজ করে

- **অবস্থান**: ফাইলগুলো .NET User Secrets-এর `secrets.json`-এর পাশে সংরক্ষিত হয়:
  - Windows: `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`
  - Linux ও macOS: `~/.microsoft/usersecrets/<UserSecretsId>/`
- **সিঙ্ক**: সক্রিয় এনভায়রনমেন্ট সংরক্ষণ করলে `secrets.json`-ও আপডেট হয়। VS Code-এ সরাসরি `secrets.json` সম্পাদনা করে সংরক্ষণ করলে পরিবর্তনগুলো সক্রিয় এনভায়রনমেন্টে ফিরে কপি হয়।
- **নাম**: এনভায়রনমেন্টের নামে শুধু অক্ষর, সংখ্যা, হাইফেন ও আন্ডারস্কোর চলে, এবং ছোট হাতের অক্ষরে সংরক্ষিত হয়।
- **মাইগ্রেশন**: প্রজেক্ট ফোল্ডারে `.active-env`, `secrets.json` বা `secrets.*.json` ফাইল থাকলে সেগুলো User Secrets স্টোরে সরানো হয়। বিদ্যমান ফাইল কখনো ওভাররাইট হয় না; সেক্ষেত্রে একটি সতর্কবার্তা দেখানো হয়।

## নিরাপত্তা

> [!WARNING]
> .NET User Secrets-এর মতোই ফাইলগুলো **এনক্রিপ্ট করা হয় না**। এই এক্সটেনশন শুধু ডেভেলপমেন্ট সিক্রেটের জন্য ব্যবহার করুন এবং যে অপারেটিং সিস্টেম অ্যাকাউন্টে সেগুলো সংরক্ষিত, সেটি সুরক্ষিত রাখুন। প্রোডাকশন ক্রেডেনশিয়ালের জন্য এটি ব্যবহার করবেন না।
