# ✅ Deployment Sjekkliste - S7S

Følg denne sjekklista i rekkefølgje for ein vellukka deployment!

---

## 📝 Før du startar

- [ ] Har du testakøyrt alt lokalt?
- [ ] Fungerer admin-innlogging?
- [ ] Fungerer registrering og fjellregistrering?
- [ ] Er katalogen på plass i `public/S7S-katalog.pdf`?

---

## 🌐 Steg 1: Domene (valfritt, men anbefalt)

**Om du vil ha `www.s7s.no`:**

- [ ] Gå til domeneshop.no eller one.com
- [ ] Søk etter `s7s.no`
- [ ] Kjøp domenet (~100-200 kr/år)
- [ ] Lagre innloggingsinfo

**Om du hoppar over no:**
- [ ] Du får `s7s.vercel.app` gratis
- [ ] Du kan legge til domene seinare

---

## 📦 Steg 2: Last opp til GitHub

- [ ] Opne PowerShell i prosjektmappa
- [ ] Køyr: `git init`
- [ ] Køyr: `git add .`
- [ ] Køyr: `git commit -m "Initial deployment"`
- [ ] Opprett repository på github.com
- [ ] Køyr: `git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git`
- [ ] Køyr: `git push -u origin main`
- [ ] Sjekk at koden er synleg på GitHub

---

## 🗄️ Steg 3: Database (Supabase)

- [ ] Gå til supabase.com
- [ ] Opprett konto (logg inn med GitHub)
- [ ] Klikk `New Project`
- [ ] Namn: `s7s-database`
- [ ] **Database Password:** Lag og LAGRE passordet!
- [ ] Region: Frankfurt (eller nærmaste)
- [ ] Klikk `Create new project`
- [ ] Vent til prosjektet er klart (1-2 min)
- [ ] Gå til Settings → Database
- [ ] Finn "Connection string" → URI
- [ ] Kopier URL-en
- [ ] **Byt ut [YOUR-PASSWORD]** med ditt passord
- [ ] Lagre denne URL-en trygt!

---

## ☁️ Steg 4: Deploy til Vercel

### 4.1 Opprett Vercel-konto
- [ ] Gå til vercel.com
- [ ] Klikk `Sign Up`
- [ ] Logg inn med GitHub
- [ ] Godkjenn Vercel

### 4.2 Import prosjekt
- [ ] Klikk `Add New...` → `Project`
- [ ] Finn og vel `s7s` repository
- [ ] Klikk `Import`

### 4.3 Environment Variables

**Legg til desse ein etter ein:**

- [ ] **DATABASE_URL**
  - Lim inn Supabase URL frå steg 3
  - Eksempel: `postgresql://postgres.xxx:PASSORD@...`

- [ ] **NEXTAUTH_SECRET**
  - Gå til: https://generate-secret.vercel.app/32
  - Kopier og lim inn strengen

- [ ] **NEXTAUTH_URL**
  - Med domene: `https://www.s7s.no`
  - Utan domene: `https://s7s.vercel.app`

- [ ] **ADMIN_EMAIL**
  - Verdi: `admin@saudail.no`

- [ ] **ADMIN_PASSWORD**
  - Lag eit sterkt passord
  - Eksempel: `S7sAdmin2025!`
  - **LAGRE PASSORDET!**

- [ ] **VIPPS_NUMBER**
  - Verdi: `994 58 575`

- [ ] **CATALOG_PRICE**
  - Verdi: `550`

### 4.4 Deploy
- [ ] Klikk `Deploy`
- [ ] Vent 2-3 minutt
- [ ] Sjekk at deployment er vellukka (grøn hake)
- [ ] Kopier Vercel-URL-en: `https://s7s.vercel.app`

---

## 🗃️ Steg 5: Set opp database

- [ ] Opne PowerShell i prosjektmappa
- [ ] Køyr: `$env:DATABASE_URL="DIN_SUPABASE_URL_HER"`
- [ ] Køyr: `npx prisma generate`
- [ ] Køyr: `npx prisma migrate deploy`
- [ ] Køyr: `npx tsx prisma/seed.ts`
- [ ] Sjekk for feilmeldingar (skal vere grøne ✓)

---

## 🌐 Steg 6: Legg til eige domene (om kjøpt)

### I Vercel
- [ ] Gå til prosjektet ditt
- [ ] Settings → Domains
- [ ] Skriv inn: `s7s.no`
- [ ] Klikk `Add`
- [ ] Vercel viser DNS-instruksjonar

### I Domeneshop
- [ ] Logg inn på domeneshop.no
- [ ] Gå til DNS-innstillingar for `s7s.no`
- [ ] **A Record:**
  - Host: `@`
  - Value: `76.76.21.21`
- [ ] **CNAME Record:**
  - Host: `www`
  - Value: `cname.vercel-dns.com.`
- [ ] Lagre endringane
- [ ] Vent 10-30 minutt

### Oppdater NEXTAUTH_URL
- [ ] Gå til Vercel → Settings → Environment Variables
- [ ] Endre `NEXTAUTH_URL` til `https://www.s7s.no`
- [ ] Klikk Save
- [ ] Gå til Deployments
- [ ] Klikk `...` → `Redeploy`

---

## ✅ Steg 7: Test at alt fungerer

### Test URL-ar
- [ ] Gå til URL-en din (Vercel eller eige domene)
- [ ] Sjekk at forsida lastar
- [ ] Sjekk at logoen vises
- [ ] Sjekk at alle seksjonar er riktige

### Test registrering
- [ ] Klikk `Registrer deg no`
- [ ] Fyll ut testdata
- [ ] Klikk registrer
- [ ] Sjekk at du kjem til dashboard

### Test admin
- [ ] Gå til `/admin/login`
- [ ] Logg inn med:
  - Email: `admin@saudail.no`
  - Passord: (det du sette i ADMIN_PASSWORD)
- [ ] Sjekk at du ser admin-panelet
- [ ] Sjekk at du ser testbrukaren din

### Test betaling
- [ ] I admin: Godkjenn betaling for testbrukar
- [ ] Logg inn som testbrukar igjen
- [ ] Sjekk at du ser katalog-nedlasting

### Test katalog
- [ ] Klikk `Last ned PDF`
- [ ] Sjekk at katalogen lastar ned

### Test fjellregistrering
- [ ] I dashboard: Klikk på eit fjell
- [ ] Last opp eit testbilete
- [ ] Vel dato
- [ ] Registrer
- [ ] Sjekk at det dukkar opp i lista

### Test slett brukar
- [ ] I admin: Prøv å slette testbrukaren
- [ ] Bekreft sletting
- [ ] Sjekk at brukaren er borte

---

## 🎉 Ferdig!

- [ ] Alt fungerardemo? Gratulerer! 🎊
- [ ] Lagre alle passord trygt
- [ ] Del URL-en med deltakarar
- [ ] Overvak admin-panelet regelmessig

---

## 📋 Oppsummering

**Du har no:**
✅ Ein live nettside på `www.s7s.no` (eller `s7s.vercel.app`)
✅ Gratis hosting på Vercel
✅ Gratis database på Supabase
✅ Automatisk HTTPS/SSL
✅ Automatisk deployment ved nye endringar

**Kostnader:**
- Hosting: **Gratis** ✨
- Database: **Gratis** ✨
- Domene: ~100-200 kr/år 💰
- **Totalt: 100-200 kr/år** (eller gratis med .vercel.app)

---

## 🆘 Problem?

Om noko ikkje fungerer:
- Les `QUICK_DEPLOYMENT.md` for meir detaljar
- Les `DOMENE_GUIDE.md` for domene-hjelp
- Sjekk Vercel deployment logs
- Sjekk at alle environment variables er riktige

---

**Lykke til! 🏔️**


