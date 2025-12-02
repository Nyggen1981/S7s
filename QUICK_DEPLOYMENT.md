# 🚀 Rask Deployment Guide - S7S

## ✅ Alt er klart for deployment!

Din app er no 100% klar til å publiserast. Følg desse stega for å få `www.s7s.no` live!

---

## 📋 Kva du treng (totalt: ~15 min)

1. **GitHub-konto** (gratis) - for kode
2. **Vercel-konto** (gratis) - for hosting
3. **Supabase-konto** (gratis) - for database
4. **Domene** (~100-200 kr/år) - for `www.s7s.no`

---

## 🌐 Domene-alternativ for `www.s7s.no`

### Anbefalt: Kjøp domene først (5 min)

**Beste alternativ for norsk domene:**

1. **Domeneshop.no** (anbefalt for norske domene)
   - Pris: ~89-149 kr/år
   - Gå til: https://domene.shop
   - Søk etter: `s7s.no`
   - Om ledig: Kjøp det! (tar 2 min)
   - Om tatt: Prøv `saudasevensummits.no` eller `s7s.com`

2. **One.com** (billigare)
   - Pris: ~50-100 kr/år
   - Gå til: https://www.one.com/no
   - Søk etter domene

3. **Gratis alternativ (midlertidig)**
   - Vercel gir deg: `s7s.vercel.app` (gratis)
   - Du kan alltid legge til eige domene seinare!

---

## 🚀 Steg 1: Last opp til GitHub (3 min)

### 1.1 Opne PowerShell i prosjektmappa

```powershell
# Initialiser git (om ikkje allereie gjort)
git init

# Legg til alle filer
git add .

# Lag commit
git commit -m "Klar for deployment - Sauda Seven Summits"
```

### 1.2 Opprett repository på GitHub

1. Gå til https://github.com
2. Logg inn (eller opprett konto)
3. Klikk `+` → `New repository`
4. Namn: `s7s`
5. Set som `Private` (om du vil)
6. Klikk `Create repository`

### 1.3 Push koden

```powershell
# Byt ut DITTBRUKARNAMN med ditt GitHub-brukarnamn
git branch -M main
git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git
git push -u origin main
```

---

## 🗄️ Steg 2: Opprett Database (3 min)

### 2.1 Gå til Supabase
- URL: https://supabase.com
- Klikk `Start your project`
- Logg inn med GitHub

### 2.2 Opprett prosjekt
- Klikk `New Project`
- Organization: Lag ny eller vel eksisterande
- Namn: `s7s-database`
- **Database Password:** Lag eit sterkt passord og **LAGRE DET!**
- Region: `Frankfurt` (eller nærmaste Europa)
- Klikk `Create new project`
- Vent 1-2 minutt

### 2.3 Hent DATABASE_URL
1. I Supabase dashboard, klikk på prosjektet ditt
2. Gå til `Settings` (⚙️ ikon) → `Database`
3. Scroll ned til `Connection string`
4. Vel `URI`
5. Kopier strengen (ser slik ut):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
6. **VIKTIG:** Byt ut `[YOUR-PASSWORD]` med passordet du laga i steg 2.2
7. Lagre denne URL-en - du treng den i neste steg!

---

## ☁️ Steg 3: Deploy til Vercel (5 min)

### 3.1 Logg inn på Vercel
- Gå til: https://vercel.com
- Klikk `Sign Up`
- Vel `Continue with GitHub`
- Godkjenn Vercel

### 3.2 Import prosjektet
- Klikk `Add New...` → `Project`
- Finn `s7s` i lista over repositories
- Klikk `Import`

### 3.3 Legg til Environment Variables

**VIKTIG!** Før du deployar, må du legge til desse variablane:

Klikk `Environment Variables` og legg til:

#### 1. DATABASE_URL
**Name:** `DATABASE_URL`  
**Value:** (Lim inn URL-en frå Supabase - steg 2.3)
```
postgresql://postgres.xxxxx:DITTPASSORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

#### 2. NEXTAUTH_SECRET
**Name:** `NEXTAUTH_SECRET`  
**Value:** Gå til https://generate-secret.vercel.app/32 og kopier strengen

#### 3. NEXTAUTH_URL
**Name:** `NEXTAUTH_URL`  
**Value:** (Vel basert på domene)
- Med eige domene: `https://www.s7s.no`
- Utan eige domene (no): `https://s7s.vercel.app`
- **Tips:** Du kan endre dette seinare!

#### 4. ADMIN_EMAIL
**Name:** `ADMIN_EMAIL`  
**Value:** `admin@saudail.no`

#### 5. ADMIN_PASSWORD
**Name:** `ADMIN_PASSWORD`  
**Value:** `VelgEitTrygtPassord123!` (byt til ditt eige!)

#### 6. VIPPS_NUMBER
**Name:** `VIPPS_NUMBER`  
**Value:** `994 58 575`

#### 7. CATALOG_PRICE
**Name:** `CATALOG_PRICE`  
**Value:** `550`

### 3.4 Deploy!
- Klikk `Deploy`
- Vent 2-3 minutt ☕
- Du får ein URL: `https://s7s.vercel.app`

---

## 🗃️ Steg 4: Set opp databasen (2 min)

### 4.1 Køyr migrations i PowerShell

```powershell
# Set DATABASE_URL midlertidig
$env:DATABASE_URL="postgresql://postgres.xxxxx:PASSORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Generer Prisma client
npx prisma generate

# Køyr migrations
npx prisma migrate deploy

# Seed databasen (opprett admin + fjell)
npx tsx prisma/seed.ts
```

**Ferdig!** Din app er no live på: `https://s7s.vercel.app` 🎉

---

## 🌐 Steg 5: Legg til eige domene `www.s7s.no` (valfritt, 5 min)

### 5.1 I Vercel dashboard

1. Vel prosjektet `s7s`
2. Klikk `Settings` → `Domains`
3. Skriv inn: `s7s.no` og klikk `Add`
4. Vercel vil også automatisk legge til `www.s7s.no`
5. Du får instruksjonar for DNS-oppsett

### 5.2 I Domeneshop (eller din domene-leverandør)

1. Logg inn på domeneshop.no
2. Gå til `DNS-innstillingar` for `s7s.no`
3. Legg til desse DNS-oppføringane:

**A Record (for s7s.no):**
```
Type: A
Host: @
Value: 76.76.21.21
```

**CNAME Record (for www.s7s.no):**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com.
```

4. Lagre endringane
5. Vent 5-30 minutt (DNS-propagering)

### 5.3 Oppdater NEXTAUTH_URL

1. I Vercel: `Settings` → `Environment Variables`
2. Finn `NEXTAUTH_URL`
3. Endre frå `https://s7s.vercel.app` til `https://www.s7s.no`
4. Klikk `Save`
5. Gå til `Deployments` → Klikk `...` på nyaste deployment → `Redeploy`

---

## ✅ Test at alt fungerer

Gå til `https://www.s7s.no` (eller `https://s7s.vercel.app`)

1. **Forside:** Sjekk at logoen og all tekst er riktig
2. **Registrer testbrukar:** Prøv å registrere deg
3. **Admin-login:** Logg inn på `/admin/login`
   - Email: `admin@saudail.no`
   - Passord: Det du satte i ADMIN_PASSWORD
4. **Godkjenn betaling:** Test betalingsgodkjenning
5. **Last ned katalog:** Sjekk at PDF-en lastar ned
6. **Registrer fjell:** Last opp eit testbilete

---

## 🎯 URL-oversikt

Når alt er satt opp har du:
- ✅ `https://s7s.no` → Din hovudside
- ✅ `https://www.s7s.no` → Same side (fungerer begge vegar)
- ✅ `https://s7s.vercel.app` → Vercel-URL (fungerer alltid)

---

## 💰 Kostnadsoversikt

| Teneste | Pris |
|---------|------|
| Vercel Hosting | **Gratis** ✨ |
| Supabase Database | **Gratis** (opp til 500MB) ✨ |
| Domene (s7s.no) | ~100-200 kr/år 💰 |
| **TOTALT** | **100-200 kr/år** 🎉 |

---

## 🆘 Feilsøking

### Problem: "Cannot connect to database"
- Sjekk at DATABASE_URL er korrekt i Vercel
- Sjekk at du bytta ut [YOUR-PASSWORD] med ekte passord

### Problem: "Admin login fungerer ikkje"
- Sjekk at du køyrde `npx tsx prisma/seed.ts`
- Sjekk at ADMIN_EMAIL og ADMIN_PASSWORD er riktige

### Problem: "Bilete lastar ikkje opp"
- Dette er normalt i starten. Bilete vil forsvinne ved neste deployment.
- Løysing: Set opp Cloudinary (gi beskjed når du er klar!)

### Problem: "Katalogen lastar ikkje ned"
- Sjekk at `public/S7S-katalog.pdf` eksisterer
- Den skal vere der no!

---

## 🎊 Gratulerer!

Din S7S-app er no live på internett! 🏔️

**Neste steg:**
- Del URL-en med deltakarar
- Test grundig
- Set opp Cloudinary for permanente bilete (gi beskjed!)
- Konfigurer e-post (valfritt)

**Support:**
Treng du hjelp? Les `DEPLOYMENT_GUIDE.md` for meir detaljert info!

---

**Lykke til med Sauda Seven Summits 2025/2026! 🎿⛰️**


