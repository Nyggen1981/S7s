# 🏔️ Sauda Seven Summits - Oppsettveiledning

## Rask start (Windows)

### Metode 1: Automatisk oppsett

Kjør setup-scriptet i PowerShell:

```powershell
.\setup.ps1
```

Dette vil automatisk:
- Sjekke at Node.js er installert
- Kopiere logoen til riktig mappe
- Installere alle avhengigheter
- Sette opp databasen
- Fylle databasen med testdata

### Metode 2: Manuelt oppsett

Følg disse stega:

1. **Installer avhengigheter:**
   ```powershell
   npm install
   ```

2. **Kopier logoen:**
   ```powershell
   Copy-Item S7S.png public\S7S.png
   ```

3. **Sett opp databasen:**
   ```powershell
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Start appen:**
   ```powershell
   npm run dev
   ```

5. **Opne i nettleser:**
   ```
   http://localhost:3000
   ```

## 📧 E-post konfigurasjon (Viktig!)

For at appen skal kunne sende e-post når nokon fullfører alle 7 topper, må du konfigurere SMTP-innstillingar i `.env`:

### For Gmail:

1. Gå til Google-kontoen din → Sikkerhet
2. Aktiver 2-trinns bekreftelse (om ikkje allerede aktivert)
3. Gå til "App-passord"
4. Opprett nytt app-passord for "E-post"
5. Bruk dette passordet i `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=din@gmail.com
SMTP_PASSWORD=generert-app-passord-her
SMTP_FROM=noreply@saudasevensummits.no
```

### For andre e-postleverandører:

Finn SMTP-innstillingane for din e-postleverandør og oppdater `.env` tilsvarande.

## 🔐 Endre admin-passord

**VIKTIG:** Før du deployar til produksjon, endre admin-passordet:

1. Opne `.env`
2. Endre `ADMIN_PASSWORD` til noko sikkert
3. Kjør seed-scriptet på nytt:
   ```powershell
   npx tsx prisma/seed.ts
   ```

## 🗻 Fjelltopper 2024/2025

Appen er no sett opp med dei offisielle 7 toppene for 2024/2025 sesongen:

1. Kyrkjenuten (1602 moh)
2. Skaulen (1538 moh)
3. Skorvenuten (1124 moh)
4. Hustveitsåtå (1187 moh)
5. Storaheinuten (1265 moh)
6. Søre Tinden (1564 moh)
7. Nordreskårnuten (1273 moh)

Sjå **FJELL_2024_2025.md** for meir informasjon.

### Tilpasse beskrivingar

For å endre beskrivingane til fjella:

1. Opne `prisma/seed.ts`
2. Rediger `description` felt for kvart fjell
3. Kjør seed-scriptet på nytt:
   ```powershell
   npx tsx prisma/seed.ts
   ```

## 🎯 Testing av appen

### Brukar-delen:

1. Gå til `http://localhost:3000`
2. Klikk "Registrer deg no"
3. Fyll ut skjemaet med testdata
4. Du blir omdirigert til dashboard
5. Prøv å registrere ein fjelltur ved å laste opp eit bilete

### Admin-delen:

1. Gå til `http://localhost:3000/admin/login`
2. Logg inn med:
   - E-post: `admin@saudasevensummits.no`
   - Passord: `ChangeThisPassword123!`
3. Sjå oversikt over deltakarar
4. Test Excel-eksport

## 🚀 Deploy til produksjon

### Anbefalt: Vercel

1. Installer Vercel CLI:
   ```powershell
   npm i -g vercel
   ```

2. Logg inn:
   ```powershell
   vercel login
   ```

3. Deploy:
   ```powershell
   vercel
   ```

4. Sett miljøvariablar i Vercel Dashboard:
   - Alle variablar frå `.env`
   - Bruk ein produksjons-database (PostgreSQL anbefalt)

### Andre alternativ:

- Railway
- DigitalOcean App Platform
- Heroku
- AWS/Azure/GCP

## 📊 Database

Appen brukar SQLite som database i utvikling. For produksjon, byt til PostgreSQL:

1. Oppdater `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Oppdater `DATABASE_URL` i `.env` til PostgreSQL connection string

3. Kjør migrering:
   ```powershell
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

## 🔧 Feilsøking

### "Module not found" feil

```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Prisma feil

```powershell
npx prisma generate
npx prisma db push
```

### Port allereie i bruk

Endre port i `package.json`:
```json
"dev": "next dev -p 3001"
```

## 📞 Hjelp

Sjekk README.md for meir detaljert dokumentasjon.

## ✅ Sjekkliste før produksjon

- [ ] NEXTAUTH_SECRET endra til ein sterk, tilfeldig verdi
- [ ] Admin-passord endra
- [ ] SMTP konfigurert og testa
- [ ] Database bytta til PostgreSQL (eller anna produksjons-database)
- [ ] Fjellnamn og beskrivingar oppdatert
- [ ] Logo og design tilpassa
- [ ] Testa all funksjonalitet
- [ ] Backup-strategi på plass

