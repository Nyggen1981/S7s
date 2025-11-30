# Sauda Seven Summits 🏔️

Ein moderne web-applikasjon for Sauda Seven Summits-utfordringa - eit årslang prosjekt der deltakarar skal bestige alle 7 fjelltopper i Sauda.

## 🚀 Publiser sida - 100% GRATIS!

**Alt er klart for deployment! Velg din guide:**

### 🎉 START HER: `GRATIS_DEPLOYMENT.md` (Anbefalt for testfase)
**12 min | 0 kr/år** - Få s7s.vercel.app live utan å betale noko!
- ✅ Gratis hosting på Vercel
- ✅ Gratis database på Supabase  
- ✅ Gratis URL: `s7s.vercel.app`
- ✅ **TOTALT: 0 kr/år** 🎉

### 🌐 Med eige domene (Seinare, når testfasen er over)
- **DOMENE_GUIDE.md** - Korleis få `www.s7s.no` (~100-200 kr/år)
- **DEPLOYMENT_CHECKLIST.md** - Komplett sjekkliste med domene

### 📚 Andre guider:
- **QUICK_DEPLOYMENT.md** - Detaljert guide med alle alternativ
- **DEPLOYMENT_GUIDE.md** - Teknisk guide
- **ENV_SETUP.md** - Environment variables

### 💰 Kostnadsoversikt:
| Alternativ | Kostnad |
|------------|---------|
| **Gratis (s7s.vercel.app)** | **0 kr/år** ✨ |
| Med domene (www.s7s.no) | 100-200 kr/år 💰 |

---

## 🌟 Funksjonar

- **Brukarregistrering** - Registrer deg med namn, e-post, telefon og t-skjorte størrelse
- **Fjellregistrering** - Last opp bilete som bevis når du har vore på ein topp
- **Framdriftssporing** - Sjå din eigen framdrift og kva fjell du har fullført
- **Admin-panel** - Komplett oversikt over alle deltakarar og deira framdrift
- **Excel-eksport** - Eksporter alle data til Excel med eit klikk
- **E-post varsling** - Automatisk e-post til admin når nokon fullfører alle 7 topper
- **Flott design** - Moderne UI med naturbilder og S7S-logoen

## 🚀 Kom i gang

### Føresetnadar

- Node.js 18+ 
- npm eller yarn

### Installasjon

1. Installer avhengigheiter:

```bash
npm install
```

2. Kopier `.env.example` til `.env` og juster verdiane:

```bash
copy .env.example .env
```

Rediger `.env` og fyll inn:
- Database-URL (standard SQLite fungerer fint)
- NEXTAUTH_SECRET (generer ein tilfeldig streng)
- SMTP-innstillingar for e-post (valgfritt, men tilrådd)
- Admin e-post og passord

3. Sett opp databasen:

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

4. Start utviklingsserveren:

```bash
npm run dev
```

Appen er no tilgjengeleg på [http://localhost:3000](http://localhost:3000)

## 📧 E-post oppsett

For å aktivere e-post varslingar, treng du å konfigurere SMTP-innstillingar i `.env`:

### Gmail eksempel:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=din@gmail.com
SMTP_PASSWORD=din-app-passord
SMTP_FROM=noreply@saudasevensummits.no
```

**Merk:** For Gmail må du bruke eit "App Password" i staden for ditt vanlige passord. Dette kan du generere i Google-kontoen din under Sikkerhet > 2-trinns bekreftelse > App-passord.

## 👤 Admin-innlogging

Standard admin-innlogging (endre dette i `.env`):
- E-post: `admin@saudasevensummits.no`
- Passord: `ChangeThisPassword123!`

Gå til [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 🗄️ Databasestruktur

Applikasjonen brukar SQLite som database (kan enkelt byttest til PostgreSQL eller MySQL ved behov):

- **User** - Brukarar/deltakarar
- **Peak** - Dei 7 fjelltoppene (2024/2025 sesong)
- **Submission** - Registrerte fjellturar med bilete
- **Admin** - Admin-brukarar

## 🏔️ Dei 7 toppene (2024/2025)

1. **Kyrkjenuten** - 1602 moh (høgaste!)
2. **Skaulen** - 1538 moh
3. **Skorvenuten** - 1124 moh
4. **Hustveitsåtå** - 1187 moh
5. **Storaheinuten** - 1265 moh
6. **Søre Tinden** - 1564 moh
7. **Nordreskårnuten** - 1273 moh

Sjå **FJELL_2024_2025.md** for meir detaljar.

## 📝 Tilpassing av fjell

For å endre beskrivingane på dei 7 fjelltoppene, rediger `prisma/seed.ts` og kjør:

```bash
npx tsx prisma/seed.ts
```

## 📦 Produksjonsoppsett

### Bygg for produksjon:

```bash
npm run build
npm start
```

### Deploy-alternativ:

- **Vercel** (tilrådd for Next.js)
- **Railway**
- **DigitalOcean**
- **AWS/Azure/GCP**

**Viktig for produksjon:**
1. Bruk ein produksjons-database (PostgreSQL tilrådd)
2. Endre NEXTAUTH_SECRET til ein sterk, tilfeldig verdi
3. Konfigurer SMTP for e-post
4. Endre admin-passordet
5. Sett opp backup av databasen

## 🔒 Sikkerheit

- Passord blir hasha med bcrypt
- Admin-ruter er beskytta med NextAuth
- Bilete blir lagra lokalt (kan byttest til cloud storage)
- Input validering på alle skjema

## 📊 Excel-eksport

Admin kan eksportere all data til Excel som inneheld:
- **Deltakere-ark**: Oversikt over alle deltakarar med framdrift
- **Bestigningar-ark**: Detaljert liste over alle registrerte fjellturar

## 🎨 Teknologi

- **Next.js 14** - React-rammeverk
- **TypeScript** - Type-sikkerheit
- **Prisma** - Database ORM
- **NextAuth** - Autentisering
- **Tailwind CSS** - Styling
- **Lucide Icons** - Ikoner
- **XLSX** - Excel-generering
- **Nodemailer** - E-post sending

## 📞 Support

For spørsmål eller problem, kontakt admin på e-posten sett i `.env`.

## 📄 Lisens

© 2024 Sauda Seven Summits. Alle rettar reservert.

