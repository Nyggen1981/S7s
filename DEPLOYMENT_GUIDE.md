# 🚀 Deployment Guide - Sauda Seven Summits

Følg desse stega for å publisere S7S-appen gratis!

## 📋 Før du startar

Du treng:
- GitHub-konto (gratis)
- Vercel-konto (gratis)
- Supabase-konto (gratis database)

---

## Steg 1: Opprett GitHub-konto og repository

### 1.1 Opprett GitHub-konto
- Gå til [github.com](https://github.com)
- Klikk "Sign up" og følg instruksjonane

### 1.2 Installer Git (om du ikkje har det)
- Last ned frå [git-scm.com](https://git-scm.com/)
- Installer med standardinnstillingar

### 1.3 Last opp prosjektet til GitHub

**I terminalen (PowerShell) i prosjektmappa:**

```powershell
# Initialiser git
git init

# Legg til alle filer
git add .

# Lag første commit
git commit -m "Initial commit - Sauda Seven Summits"

# Opprett repository på github.com først, deretter:
git branch -M main
git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git
git push -u origin main
```

---

## Steg 2: Opprett gratis database (Supabase)

### 2.1 Opprett Supabase-konto
- Gå til [supabase.com](https://supabase.com)
- Klikk "Start your project" og logg inn med GitHub

### 2.2 Opprett nytt prosjekt
- Klikk "New Project"
- Namn: `s7s-database`
- Database Password: **Lagre dette passordet!**
- Region: Vel nærmaste (t.d. Frankfurt)
- Klikk "Create new project" (tar 1-2 minutt)

### 2.3 Hent database-URL
- I Supabase dashboard, gå til "Settings" → "Database"
- Finn "Connection string" → "URI"
- Kopier denne URL-en (ser slik ut):
  ```
  postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
  ```
- **Byt ut `[PASSWORD]` med passordet du laga i steg 2.2**

---

## Steg 3: Deploy til Vercel

### 3.1 Opprett Vercel-konto
- Gå til [vercel.com](https://vercel.com)
- Klikk "Sign Up"
- Vel "Continue with GitHub"

### 3.2 Import prosjektet
- Klikk "Add New..." → "Project"
- Finn `s7s` repository
- Klikk "Import"

### 3.3 Legg til Environment Variables
**VIKTIG!** Før du klikkar "Deploy", legg til desse:

Klikk "Environment Variables" og legg til:

**DATABASE_URL**
```
postgresql://postgres:DITTPASSORD@db.xxx.supabase.co:5432/postgres
```
(Den du kopierte frå Supabase)

**NEXTAUTH_SECRET**
- Gå til https://generate-secret.vercel.app/32
- Kopier den genererte strengen
- Lim inn som verdi

**NEXTAUTH_URL**
```
https://s7s.vercel.app
```
(eller ditt eige domene)

**ADMIN_EMAIL**
```
admin@saudail.no
```

**ADMIN_PASSWORD**
```
VelgEitTrygtPassord123!
```

**VIPPS_NUMBER**
```
994 58 575
```

**CATALOG_PRICE**
```
550
```

### 3.4 Deploy!
- Klikk "Deploy"
- Vent 2-3 minutt
- Ferdig! 🎉

---

## Steg 4: Set opp databasen

### 4.1 Køyr migrations
Efter deployment, gå til Vercel dashboard:
- Vel prosjektet ditt
- Klikk "Settings" → "General"
- Scroll ned til "Build Command"
- Under "Deployment Protection", finn terminalknappen

**ELLER** køyr lokalt med produksjons-URL:

```powershell
# Sett DATABASE_URL midlertidig
$env:DATABASE_URL="postgresql://postgres:PASSORD@db.xxx.supabase.co:5432/postgres"

# Køyr migrations
npx prisma migrate deploy

# Seed databasen (opprett admin + fjell)
npx tsx prisma/seed.ts
```

---

## Steg 5: Test sida!

Din side er no live på:
```
https://s7s.vercel.app
```
(eller den URL-en Vercel gav deg)

**Test:**
1. Besøk sida
2. Registrer ein testbrukar
3. Logg inn på admin med: `admin@saudail.no` / ditt passord
4. Godkjenn betaling for testbrukar
5. Test nedlasting av katalog

---

## ⚠️ VIKTIG: Biletopplasting

No lagrar appen bilete i `public/uploads/`, men dette fungerer **IKKJE** i produksjon.

### Kortsiktig løysing (for testing):
Bilete blir lasta opp, men forsvinn ved neste deployment.

### Langvarig løysing (anbefalt):
Bruk **Cloudinary** (gratis 25GB):

1. Opprett konto på [cloudinary.com](https://cloudinary.com)
2. Få API-nøklar
3. Legg til i Vercel environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
4. Oppdater kode til å bruke Cloudinary

*Gi beskjed om du vil ha hjelp med dette!*

---

## 🎯 Eige domene (valfritt)

### Kjøp domene
- domeneshop.no: ~100 kr/år
- one.com: ~50 kr/år

### Koble til Vercel
1. I Vercel dashboard → Settings → Domains
2. Legg til ditt domene (f.eks. `saudasevensummits.no`)
3. Følg DNS-instruksjonane frå Vercel
4. Oppdater `NEXTAUTH_URL` til ditt nye domene

---

## 📞 Hjelp og support

Om du får problem:
- Sjekk Vercel deployment logs
- Sjekk at alle environment variables er satt
- Sjekk at database-URL er korrekt
- Les feilmeldingar nøye

---

## ✅ Sjekkliste

- [ ] GitHub repository oppretta
- [ ] Supabase database oppretta
- [ ] DATABASE_URL kopiert
- [ ] Vercel-konto oppretta
- [ ] Alle environment variables lagt til
- [ ] Deployment vellukka
- [ ] Database migrations køyrt
- [ ] Admin-brukar fungerer
- [ ] Testregistrering fungerer
- [ ] Katalog-nedlasting fungerer

---

**Gratulerer! Din S7S-app er no live! 🎉🏔️**


