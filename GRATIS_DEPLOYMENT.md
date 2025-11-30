# 🎉 100% GRATIS Deployment - S7S

## Kein kostnad - Alt gratis!

Din S7S-app kan publiserast **heilt gratis** med desse tenestene:
- ✅ Vercel hosting: **GRATIS**
- ✅ Supabase database: **GRATIS**
- ✅ SSL-sertifikat: **GRATIS**
- ✅ URL: `s7s.vercel.app` **GRATIS**

**Total kostnad: 0 kr/år** 💰

Du får ein profesjonell URL som fungerer perfekt for testfasen!

---

## 📋 Kva du treng (totalt: ~12 min)

1. GitHub-konto (gratis)
2. Vercel-konto (gratis)
3. Supabase-konto (gratis)

Det er alt! Ingen kredittkort, ingen betaling, ingen hake! 🎊

---

## 🚀 Steg 1: Last opp til GitHub (3 min)

### 1.1 Opprett GitHub-konto (om du ikkje har)
- Gå til: https://github.com
- Klikk `Sign up`
- Følg instruksjonane (gratis!)

### 1.2 Opprett repository
1. Logg inn på GitHub
2. Klikk `+` øverst til høgre → `New repository`
3. Repository namn: `s7s`
4. Velg `Public` eller `Private` (begge er gratis)
5. **IKKJE** kryss av "Add a README file"
6. Klikk `Create repository`

### 1.3 Last opp koden
Opne PowerShell i prosjektmappa (`C:\Users\kjeti\CursorProjects\S7S`):

```powershell
# Initialiser git
git init

# Legg til alle filer
git add .

# Lag commit
git commit -m "S7S klar for deployment"

# Byt ut DITTBRUKARNAMN med ditt GitHub-brukarnamn
git branch -M main
git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git
git push -u origin main
```

**Ferdig!** Koden din er no på GitHub ✅

---

## 🗄️ Steg 2: Opprett gratis database (3 min)

### 2.1 Opprett Supabase-konto
- Gå til: https://supabase.com
- Klikk `Start your project`
- Logg inn med GitHub (enklast!)
- **100% gratis** - ingen kredittkort nødvendig

### 2.2 Opprett database-prosjekt
1. Klikk `New Project`
2. Organization: Lag ny (første gang) eller vel eksisterande
3. **Namn:** `s7s-database`
4. **Database Password:** 
   - Klikk `Generate a password` (eller lag eige)
   - **VIKTIG: Kopier og LAGRE passordet!** (du treng det seinare)
5. **Region:** Vel `Frankfurt` (eller nærmaste Europa)
6. **Pricing Plan:** `Free` (allereie valt)
7. Klikk `Create new project`
8. Vent 1-2 minutt mens databasen blir sett opp ☕

### 2.3 Hent DATABASE_URL
1. Når prosjektet er klart, klikk på prosjektnamnet (`s7s-database`)
2. Gå til `Settings` (⚙️ ikon i venstre meny) → `Database`
3. Scroll ned til `Connection string`
4. Vel `URI` (ikkje "Transaction" eller "Session")
5. Kopier heile strengen som ser slik ut:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
6. **VIKTIG:** Byt ut `[YOUR-PASSWORD]` med passordet du laga i steg 2.2
7. **Lagre denne URL-en** - lim den inn i ein notatblokk midlertidig

Eksempel på ferdig URL:
```
postgresql://postgres.abcdefg:MittSuperHemmelgePassord123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Ferdig!** Database er klar ✅

---

## ☁️ Steg 3: Deploy til Vercel (4 min)

### 3.1 Opprett Vercel-konto
- Gå til: https://vercel.com
- Klikk `Sign Up`
- Vel `Continue with GitHub`
- Godkjenn tilgong
- **100% gratis** - ingen kredittkort!

### 3.2 Import prosjektet
1. Du er no på Vercel Dashboard
2. Klikk `Add New...` → `Project`
3. Du ser lista over dine GitHub repositories
4. Finn `s7s` og klikk `Import`

### 3.3 Legg til Environment Variables

**VIKTIG!** Før du deployar, må du legge til desse variablane.

Under "Configure Project" finn du `Environment Variables`. Legg til desse **ein om gongen**:

---

#### **1. DATABASE_URL**
- **Name:** `DATABASE_URL`
- **Value:** Lim inn Supabase-URL-en frå steg 2.3
  ```
  postgresql://postgres.xxxxx:DITTPASSORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
  ```
- Klikk `Add`

---

#### **2. NEXTAUTH_SECRET**
- **Name:** `NEXTAUTH_SECRET`
- **Value:** Generer ein tilfeldig string:
  - Gå til: https://generate-secret.vercel.app/32
  - Kopier den lange strengen som blir generert
  - Lim inn her
- Klikk `Add`

---

#### **3. NEXTAUTH_URL**
- **Name:** `NEXTAUTH_URL`
- **Value:** `https://s7s.vercel.app`
  - **Merk:** Om Vercel foreslår eit anna namn (f.eks. `s7s-dittbrukarnamn.vercel.app`), bruk det i staden!
  - Du kan oppdatere dette etter deployment
- Klikk `Add`

---

#### **4. ADMIN_EMAIL**
- **Name:** `ADMIN_EMAIL`
- **Value:** `admin@saudail.no`
- Klikk `Add`

---

#### **5. ADMIN_PASSWORD**
- **Name:** `ADMIN_PASSWORD`
- **Value:** Lag eit sterkt passord for admin-innlogging
  - Eksempel: `S7sAdmin2025!`
  - **VIKTIG: LAGRE DETTE PASSORDET** - du treng det for å logge inn som admin
- Klikk `Add`

---

#### **6. VIPPS_NUMBER**
- **Name:** `VIPPS_NUMBER`
- **Value:** `994 58 575`
- Klikk `Add`

---

#### **7. CATALOG_PRICE**
- **Name:** `CATALOG_PRICE`
- **Value:** `550`
- Klikk `Add`

---

### 3.4 Deploy!
- Sjekk at alle 7 environment variables er lagt til
- Klikk `Deploy`
- Vent 2-3 minutt mens Vercel byggjer og deployar appen ☕
- Du ser ein framgangsindikator - dette er normalt!

### 3.5 Få din gratis URL
Når deployment er ferdig:
1. Du ser "Congratulations!" 🎉
2. Klikk på `Visit` eller screenshot-biletet
3. Din app er no live på ein URL som:
   - `https://s7s.vercel.app` ELLER
   - `https://s7s-brukarnamn.vercel.app`
4. **Lagre denne URL-en!**

---

## 🗃️ Steg 4: Set opp databasen (2 min)

No må me køyre migrations for å lage databasetabellar.

### 4.1 Opne PowerShell i prosjektmappa

```powershell
# Set DATABASE_URL midlertidig (lim inn DIN Supabase-URL)
$env:DATABASE_URL="postgresql://postgres.xxxxx:DITTPASSORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Generer Prisma client
npx prisma generate

# Køyr migrations (opprett tabellar)
npx prisma migrate deploy

# Seed databasen (opprett admin-brukar + dei 7 fjella)
npx tsx prisma/seed.ts
```

Du skal sjå:
- ✅ Grøne hakemarkar
- ✅ "Migration applied"
- ✅ "Admin user created"
- ✅ "7 peaks created"

**Ferdig!** Database er klar med data ✅

---

## ✅ Steg 5: Test at alt fungerer!

### 5.1 Test URL-en
Gå til din Vercel-URL (f.eks. `https://s7s.vercel.app`)

**Sjekk at du ser:**
- ✅ Forsida med S7S-logoen
- ✅ Alle seksjonar lastar inn
- ✅ "Logg inn" og "Registrer deg no" knappane

### 5.2 Test registrering
1. Klikk `Registrer deg no`
2. Fyll ut testdata:
   - Namn: `Test Brukar`
   - E-post: `test@example.com`
   - Telefon: `12345678`
   - T-skjorte: Vel ein størrelse
3. Klikk `Registrer`
4. Du blir sendt til dashboard
5. **Fungerer det?** ✅

### 5.3 Test admin-innlogging
1. Gå til: `https://s7s.vercel.app/admin/login`
2. Logg inn med:
   - **E-post:** `admin@saudail.no`
   - **Passord:** Det du sette i `ADMIN_PASSWORD` (steg 3.3.5)
3. Du skal sjå admin-panelet
4. Sjekk at du ser testbrukaren din
5. **Fungerer det?** ✅

### 5.4 Test betaling og katalog
1. I admin-panelet: Godkjenn betaling for testbrukaren
2. Logg inn som testbrukar igjen (`test@example.com`)
3. Du skal no sjå "Last ned PDF"-knappen
4. Klikk og sjekk at katalogen lastar ned
5. **Fungerer det?** ✅

### 5.5 Test fjellregistrering
1. Som innlogga testbrukar
2. Klikk på eit av fjella (f.eks. Kyrkjenuten)
3. Last opp eit testbilete
4. Vel dato
5. Klikk `Registrer bestigninga`
6. Sjekk at fjellkort viser "Fullført"
7. **Fungerer det?** ✅

### 5.6 Test sletting (admin)
1. Logg inn som admin
2. Finn testbrukaren
3. Klikk `Slett`-knappen
4. Bekreft
5. Sjekk at brukaren er borte
6. **Fungerer det?** ✅

---

## 🎉 Gratulerer! Du er live!

Din app er no **100% gratis** tilgjengeleg på internett! 🎊

### 📊 Kva du har no:

✅ **Live nettside:** `https://s7s.vercel.app`
✅ **Gratis hosting:** Vercel (uavgrensa trafikk!)
✅ **Gratis database:** Supabase (500MB)
✅ **Automatisk HTTPS:** SSL-sertifikat inkludert
✅ **Automatisk backup:** Kode trygt på GitHub
✅ **Automatisk deployment:** Push til GitHub = auto-deploy

### 💰 Totalkostnad:

| Teneste | Pris |
|---------|------|
| Hosting | **GRATIS** ✨ |
| Database | **GRATIS** ✨ |
| SSL | **GRATIS** ✨ |
| URL | **GRATIS** ✨ |
| **TOTALT** | **0 kr/år** 🎉 |

---

## 📱 Del URL-en!

Din app er klar til bruk! Del denne URL-en:

```
https://s7s.vercel.app
```

Med deltakarar, sponsorar, eller kven som helst! 🏔️

---

## 🔄 Oppdatere sida seinare

Om du vil gjere endringar:

```powershell
# Gjer endringane dine i koden
# Deretter:
git add .
git commit -m "Beskriv endringane"
git push
```

**Ferdig!** Vercel deployar automatisk den nye versjonen (1-2 min) ✨

---

## 🌐 Vil du ha eige domene seinare?

Når testfasen er over og du vil ha `www.s7s.no`:

1. Kjøp domenet (~100-200 kr/år)
2. Les `DOMENE_GUIDE.md`
3. Legg til domenet i Vercel (Settings → Domains)
4. Oppdater DNS-innstillingar
5. Ferdig! Både `s7s.no` og `s7s.vercel.app` fungerer

---

## ⚠️ Viktig å vite

### Gratis limits (meir enn nok for S7S!)

**Vercel:**
- ✅ 100GB bandwidth/månad
- ✅ Uavgrensa sidevisningar
- ✅ Uavgrensa deployments

**Supabase:**
- ✅ 500MB database (plass til tusenvis av brukarar)
- ✅ 1GB fillagring
- ✅ 50,000 aktive brukarar/månad

**Dette er LANGT meir enn nok for S7S-prosjektet!** 🎯

### Bilete-lagring

**No:** Bilete lagras midlertidig og kan forsvinne ved redeploy.

**Seinare:** Når du er klar, kan eg hjelpe deg å sette opp **Cloudinary** (også gratis, 25GB) for permanente bilete.

Gi beskjed når testfasen er over! 😊

---

## 🆘 Feilsøking

### Problem: "Cannot connect to database"
**Løysing:**
- Sjekk at DATABASE_URL er korrekt i Vercel
- Gå til Vercel → Settings → Environment Variables
- Sjekk at passordet i URL-en er riktig (inga hakeparenteser)

### Problem: "Admin login fungerer ikkje"
**Løysing:**
- Sjekk at du køyrde `npx tsx prisma/seed.ts`
- Sjekk at ADMIN_EMAIL og ADMIN_PASSWORD er korrekte i Vercel

### Problem: "Page not found"
**Løysing:**
- Vent 2-3 minutt etter deployment
- Sjekk at deployment var vellukka i Vercel
- Prøv å refresh sida

### Problem: "Bilete lastar ikkje opp"
**Løysing:**
- Dette er normalt - bilete er midlertidige no
- Testfunksjonen fungerer likevel
- Set opp Cloudinary seinare for permanente bilete

---

## 🎯 Neste steg

1. ✅ Del URL-en med folk som skal teste
2. ✅ Overvak admin-panelet regelmessig
3. ✅ Samle tilbakemeldingar under testfasen
4. ✅ Når testfasen er over: Vurder eige domene

---

## 📞 Treng du hjelp?

Om du får problem:
- Sjekk Vercel deployment logs (Deployments → klikk på deployment)
- Sjekk at alle environment variables er satt
- Les feilmeldingar nøye - dei gir gode hint!

---

**Lykke til med testfasen! 🏔️**

**Din S7S-app er no live og 100% gratis!** 🎊

