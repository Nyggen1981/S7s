# 🏔️ Sauda Seven Summits - Prosjektstatus

## ✅ Fullført Funksjonalitet

### Brukarfunksjonar
- ✅ Brukarregistrering med navn, e-post, telefon, t-skjortestørrelse
- ✅ Automatisk "husk meg" (localStorage) - slepp å logge inn kvar gong
- ✅ Dashboard med framdriftsoversikt (X/7 fjell)
- ✅ Registrering av fjellturar med:
  - Bilde-opplasting
  - Dato-veljar (kan velje tidlegare dato)
  - Valfritt notatfelt
- ✅ "Min Side" - brukarar kan oppdatere sin informasjon
- ✅ Visuell framgang med progress bar
- ✅ Fullføringsbevis når alle 7 fjell er klatra

### Admin-funksjonar
- ✅ Sikker admin-innlogging (NextAuth)
- ✅ Admin-panel med statistikk
- ✅ Oversikt over alle deltakarar
- ✅ Klikkbare radarfor å sjå kva fjell kvar deltakar har besteget
- ✅ Søk og filter funksjonalitet
- ✅ Excel-eksport (to ark: Deltakarar + Bestigningar)
- ✅ E-post varsling til admin ved fullføring

### Design
- ✅ Moderne naturtema med blå/grå fargar
- ✅ S7S logo integrert
- ✅ Fullt responsiv (mobil, tablet, desktop)
- ✅ Flott hero-seksjon med bakgrunnsbilete
- ✅ Smooth animasjonar og hover-effektar

### Fjella (2024/2025 sesong)
1. Kyrkjenuten - 1602 moh
2. Skaulen - 1538 moh
3. Skorvenuten - 1124 moh
4. Hustveitsåtå - 1187 moh
5. Storaheinuten - 1265 moh
6. Søre Tinden - 1564 moh
7. Nordreskårnuten - 1273 moh

## 🔧 Teknisk Stack
- Next.js 14 med TypeScript
- Prisma ORM med SQLite (PostgreSQL-klar)
- NextAuth for autentisering
- Tailwind CSS for styling
- Nodemailer for e-post
- XLSX for Excel-eksport

## 📁 Viktige Filer
- `.env` - Miljøvariablar (admin login, SMTP, etc.)
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed-data (fjell og admin)
- `README.md` - Fullstendig dokumentasjon
- `SETUP_GUIDE.md` - Oppsettguide

## ⚙️ Miljøvariablar (.env)
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
ADMIN_EMAIL="kristina@saudail.no"
ADMIN_PASSWORD="L3n0v011"
```

## 🚀 Korleis starte appen

```powershell
# Installasjon (første gong)
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start utviklingsserver
npm run dev

# Åpne i nettlesar
http://localhost:3001
```

## 🏗️ Produksjonsoppsett

### Anbefalt: Vercel
1. Push prosjektet til GitHub
2. Importer til Vercel
3. Legg til miljøvariablar frå `.env`
4. Byt til PostgreSQL database
5. Deploy!

### Database for produksjon
Endre i `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📧 E-post Oppsett (Valgfritt)
For å aktivere e-post varslingar, legg til i `.env`:
```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="din@gmail.com"
SMTP_PASSWORD="app-passord"
SMTP_FROM="noreply@saudasevensummits.no"
```

## 🎯 Siste Endringar
- ✅ Lagt til "Logg inn" som hovudknapp på framsida
- ✅ "Registrer deg no" som liten link under
- ✅ Fjerna "Kom i gang no" CTA-knapp
- ✅ Lagt til mørk bakgrunn rundt logo
- ✅ Implementert "husk meg" funksjonalitet
- ✅ Lagt til "Logg ut" knapp
- ✅ Lagt til dato-veljar for fjellregistrering
- ✅ Admin kan klikke på deltakarar for å sjå detaljar

## 📝 Neste Steg (Opsjonelt)
- [ ] Deploy til produksjon (Vercel/Railway)
- [ ] Sett opp PostgreSQL database
- [ ] Konfigurer SMTP for e-post
- [ ] Legg til logo med transparent bakgrunn
- [ ] Test med ekte brukarar
- [ ] Sett opp backup-strategi

## 💾 Database Filer
- `prisma/dev.db` - SQLite database (lokal utvikling)
- `/public/uploads/` - Opplasta bilete (ikkje i git)

## 🔐 Sikkerheit
- Passord er hasha med bcrypt
- Admin-ruter er beskytta med NextAuth
- Input validering på alle skjema
- CSRF-beskyttelse via NextAuth
- Miljøvariablar for sensitive data

---

**Status:** ✅ Produksjonsklår!
**Sist oppdatert:** 2024-11-29





