# ✅ Gratis Deployment Sjekkliste

**12 minutt til din app er live - heilt gratis!**

---

## 📦 Steg 1: GitHub (3 min)

- [ ] Gå til github.com og opprett konto (om du ikkje har)
- [ ] Klikk `+` → `New repository`
- [ ] Namn: `s7s`
- [ ] Klikk `Create repository`
- [ ] Kopier kommandoane GitHub viser deg

**I PowerShell (prosjektmappa):**
```powershell
git init
git add .
git commit -m "S7S deployment"
git branch -M main
git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git
git push -u origin main
```

- [ ] ✅ Koden er no på GitHub!

---

## 🗄️ Steg 2: Supabase Database (3 min)

- [ ] Gå til supabase.com
- [ ] Logg inn med GitHub
- [ ] Klikk `New Project`
- [ ] Namn: `s7s-database`
- [ ] **Database Password:** Generer og LAGRE passordet
- [ ] Region: `Frankfurt`
- [ ] Klikk `Create new project`
- [ ] Vent 1-2 minutt

**Hent DATABASE_URL:**
- [ ] Gå til Settings → Database
- [ ] Finn "Connection string" → `URI`
- [ ] Kopier URL-en
- [ ] Byt ut `[YOUR-PASSWORD]` med ditt passord
- [ ] Lagre URL-en i ein notatblokk

- [ ] ✅ Database er klar!

---

## ☁️ Steg 3: Vercel Deploy (4 min)

- [ ] Gå til vercel.com
- [ ] Klikk `Sign Up` → `Continue with GitHub`
- [ ] Klikk `Add New...` → `Project`
- [ ] Vel `s7s` repository
- [ ] Klikk `Import`

**Legg til Environment Variables (ein om gongen):**

- [ ] **DATABASE_URL** = (Lim inn Supabase-URL)
- [ ] **NEXTAUTH_SECRET** = (Gå til https://generate-secret.vercel.app/32)
- [ ] **NEXTAUTH_URL** = `https://s7s.vercel.app`
- [ ] **ADMIN_EMAIL** = `admin@saudail.no`
- [ ] **ADMIN_PASSWORD** = (Lag passord og LAGRE det!)
- [ ] **VIPPS_NUMBER** = `994 58 575`
- [ ] **CATALOG_PRICE** = `550`

- [ ] Klikk `Deploy`
- [ ] Vent 2-3 minutt
- [ ] Kopier URL-en (f.eks. `s7s.vercel.app`)

- [ ] ✅ Sida er live!

---

## 🗃️ Steg 4: Setup Database (2 min)

**I PowerShell (prosjektmappa):**

```powershell
# Lim inn DIN Supabase-URL
$env:DATABASE_URL="postgresql://postgres.xxxxx:PASSORD@..."

npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

- [ ] Sjå grøne hakemarkar
- [ ] "Admin user created"
- [ ] "7 peaks created"

- [ ] ✅ Database er sett opp!

---

## ✅ Steg 5: Test (5 min)

**Gå til din URL (f.eks. s7s.vercel.app):**

- [ ] Forsida lastar?
- [ ] Logo vises?
- [ ] Klikk `Registrer deg no` og opprett testbrukar
- [ ] Dashboard vises?

**Test admin:**
- [ ] Gå til `/admin/login`
- [ ] Logg inn med: `admin@saudail.no` / ditt passord
- [ ] Admin-panel vises?
- [ ] Ser du testbrukaren?

**Test betaling:**
- [ ] Godkjenn betaling for testbrukar (admin)
- [ ] Logg inn som testbrukar
- [ ] Katalog-nedlasting vises?
- [ ] PDF lastar ned?

**Test fjellregistrering:**
- [ ] Klikk på eit fjell
- [ ] Last opp testbilete
- [ ] Registrer
- [ ] Vises som fullført?

- [ ] ✅ Alt fungerer!

---

## 🎉 FERDIG!

Din app er no **100% gratis** live på internett!

### 📊 Kva du har:

✅ Live nettside: `https://s7s.vercel.app`
✅ Gratis hosting (uavgrensa)
✅ Gratis database (500MB)
✅ Automatisk HTTPS
✅ **Total kostnad: 0 kr/år** 🎊

---

## 📱 Del URL-en!

```
https://s7s.vercel.app
```

Testfasen kan starte! 🏔️

---

## 🔄 Gjere endringar seinare?

```powershell
# Endre kode
git add .
git commit -m "Beskriv endring"
git push
```

Vercel deployar automatisk! (1-2 min)

---

## 💡 Tips

**Under testfasen:**
- Overvak admin-panelet regelmessig
- Samle tilbakemeldingar
- Test alle funksjonar

**Når testfasen er over:**
- Les `DOMENE_GUIDE.md` for å få `www.s7s.no`
- Set opp Cloudinary for permanente bilete
- Konfigurer e-post (valfritt)

---

**Gratulerer! S7S er live! 🎊**

