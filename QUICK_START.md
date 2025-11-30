# ⚡ Sauda Seven Summits - Rask Start

## 🚀 Start appen på 2 minutt

### 1. Kjør setup (velg ein av metodene):

**Automatisk (anbefalt):**
```powershell
.\setup.ps1
```

**Eller manuelt:**
```powershell
npm install
Copy-Item S7S.png public\S7S.png
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 2. Start appen:
```powershell
npm run dev
```

### 3. Opne i nettleser:
- **Hovudside:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

### 4. Test admin-panel:
- **E-post:** admin@saudasevensummits.no
- **Passord:** ChangeThisPassword123!

## 📝 Neste steg

1. ✅ Test brukarregistrering
2. ✅ Test opplasting av fjellbilete
3. ✅ Sjekk admin-panelet
4. ⚙️ Rediger `.env` for e-post oppsett
5. 🏔️ Tilpass fjellnamna i `prisma/seed.ts`

## 📚 Meir informasjon

- **Fullstendig guide:** SETUP_GUIDE.md
- **Dokumentasjon:** README.md

---

**Tips:** Appen fungerer utan e-post oppsett, men du vil ikkje få varslingar når nokon fullfører. Sjå SETUP_GUIDE.md for SMTP-konfigurasjon.




