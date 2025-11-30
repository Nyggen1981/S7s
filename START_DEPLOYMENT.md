# 🚀 START HER - Publiser S7S 

## 🎉 100% GRATIS eller med eige domene?

### Anbefalt for testfase: **GRATIS (0 kr/år)**

📖 **Les: `GRATIS_DEPLOYMENT.md`**
- ✅ 12 minutt til live
- ✅ Gratis hosting + database
- ✅ URL: `s7s.vercel.app`
- ✅ **0 kr/år**
- ✅ Perfekt for testfase!

### Med eige domene: **www.s7s.no (~100-200 kr/år)**

📖 **Les: `QUICK_DEPLOYMENT.md`**
- ⏱️ 15 minutt til live
- 🌐 Eige domene: `www.s7s.no`
- 💰 ~100-200 kr/år

---

## 📝 Kva eg har førebudd for deg:

✅ Oppdatert database til PostgreSQL (produksjon-klar)
✅ Laga deployment-konfigurasjon for Vercel
✅ Komplett gratis guide utan kostnad
✅ Guide for eige domene (seinare)

---

## ⚡ Gratis deployment - 4 enkle steg:

### 1️⃣ Opprett gratis kontoar (3 min)
- [GitHub](https://github.com) - for kode
- [Supabase](https://supabase.com) - for database
- [Vercel](https://vercel.com) - for hosting
- **Ingen kredittkort nødvendig!**

### 2️⃣ Last opp til GitHub (3 min)
```powershell
git init
git add .
git commit -m "Initial commit"
# Opprett repository på github.com, deretter:
git remote add origin https://github.com/DITTBRUKARNAMN/s7s.git
git push -u origin main
```

### 3️⃣ Få database-URL frå Supabase (3 min)
- Opprett nytt prosjekt på Supabase
- Gå til Settings → Database
- Kopier "Connection string" (URI)

### 4️⃣ Deploy på Vercel (5 min)
- Logg inn med GitHub
- Import s7s-repositoryet
- Legg til environment variables (sjå nedanfor)
- Klikk Deploy!

---

## 🔑 Environment Variables (viktig!)

Når du deployer på Vercel, legg til desse:

| Namn | Verdi | Kvar du får den |
|------|-------|-----------------|
| `DATABASE_URL` | `postgresql://postgres:...` | Frå Supabase |
| `NEXTAUTH_SECRET` | Tilfeldig string | https://generate-secret.vercel.app/32 |
| `NEXTAUTH_URL` | `https://s7s.vercel.app` | Din Vercel-URL |
| `ADMIN_EMAIL` | `admin@saudail.no` | Som du vil |
| `ADMIN_PASSWORD` | Trygt passord | Som du vil |
| `VIPPS_NUMBER` | `994 58 575` | Ditt nummer |
| `CATALOG_PRICE` | `550` | Prisen |

---

## 📖 Treng meir hjelp?

Les den fullstendige guiden:
👉 **DEPLOYMENT_GUIDE.md**

Der finn du:
- Detaljerte skjermbilete
- Trinn-for-trinn instruksjonar
- Feilsøking
- Tips for eige domene

---

## ⚠️ Viktig å vite

**Biletopplasting:**
No lagrar appen bilete lokalt. I produksjon vil desse forsvinne ved neste deployment.

**Løysing:** Bruk Cloudinary (gratis 25GB). Gi beskjed når du er klar, så hjelper eg deg med det!

**E-post:**
E-postnotifikasjonar er valfritt. Du kan sette det opp seinare.

---

## 🎯 Resultat

Når du er ferdig har du:
- ✅ Ein live nettside på https://s7s.vercel.app
- ✅ Gratis PostgreSQL database
- ✅ Automatisk deployment ved nye endringar
- ✅ SSL-sertifikat (https) inkludert
- ✅ Total kostnad: **GRATIS!** (eller 100 kr/år med eige domene)

---

**Lykke til! Gi beskjed om du treng hjelp undervegs! 🏔️**

