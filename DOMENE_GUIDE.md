# 🌐 Domene-guide - Få www.s7s.no

## Kvifor eige domene?

I staden for `s7s.vercel.app` får du:
- ✅ `www.s7s.no` - Profesjonelt og lett å hugse
- ✅ Auka merkevarebygging
- ✅ Meir tillit frå brukarar
- ✅ Enklare å markedsføre

**Kostnad:** ~100-200 kr/år (einaste kostnaden!)

---

## 🛒 Kjøp domene - Steg for steg

### Alternativ 1: Domeneshop.no (anbefalt for .no)

**Steg 1: Sjekk tilgjenge**
1. Gå til https://domene.shop
2. Søk etter: `s7s.no`
3. Om ledig: Flott! Gå vidare
4. Om tatt: Prøv alternativ:
   - `saudasevensummits.no`
   - `s7s.com`
   - `sauda7summits.no`

**Steg 2: Kjøp domenet**
1. Legg domenet i handlekorga
2. Vel lengde (1 år = billigast å starte med)
3. **VIKTIG:** Du treng IKKJE netthotell, e-post, eller andre tillegg!
4. Gå til kasse og betal (~89-149 kr)
5. Du får tilgang til DNS-innstillingar med ein gang

---

### Alternativ 2: One.com (billigare)

1. Gå til https://www.one.com/no
2. Søk etter `s7s.no`
3. Kjøp domenet (~50-100 kr/år)
4. Vel berre domene, ikkje hosting-pakke

---

## 🔧 DNS-oppsett (koble domene til Vercel)

### I Vercel (gjør dette først)

1. Logg inn på Vercel
2. Vel `s7s` prosjektet
3. Gå til `Settings` → `Domains`
4. Skriv inn domenet ditt (f.eks. `s7s.no`)
5. Klikk `Add`
6. Vercel vil vise deg kva DNS-oppføringar du treng

### I Domeneshop.no

**Steg 1: Gå til DNS-innstillingar**
1. Logg inn på domeneshop.no
2. Klikk på domenet ditt (`s7s.no`)
3. Vel `DNS-innstillingar`

**Steg 2: Slett eksisterande oppføringar**
- Slett eventuelle A-record og CNAME-record som allereie finst

**Steg 3: Legg til nye oppføringar**

**For s7s.no (root-domene):**
```
Type: A
Host: @ (eller la stå tomt)
TTL: 3600
Value: 76.76.21.21
```

**For www.s7s.no:**
```
Type: CNAME
Host: www
TTL: 3600
Value: cname.vercel-dns.com.
```

**Steg 4: Lagre**
- Klikk `Lagre` eller `Oppdater`
- Vent 5-30 minutt (DNS-propagering)

### I One.com

1. Logg inn
2. Gå til `Administrer domene` → `DNS-innstillingar`
3. Legg til same oppføringar som over

---

## 🔄 Oppdater Vercel etter domene er aktivt

### Sjekk at domenet er aktivt

1. I Vercel, under `Settings` → `Domains`
2. Status skal vise `Valid` (kan ta opp til 30 min)

### Oppdater NEXTAUTH_URL

**VIKTIG!** Du må oppdatere environment variable:

1. I Vercel: `Settings` → `Environment Variables`
2. Finn `NEXTAUTH_URL`
3. Klikk `Edit`
4. Endre frå: `https://s7s.vercel.app`
5. Til: `https://www.s7s.no` (eller ditt domene)
6. Klikk `Save`

### Redeploy sida

1. Gå til `Deployments`
2. Finn nyaste deployment
3. Klikk `...` (tre prikkar)
4. Vel `Redeploy`
5. Vent 1-2 minutt

---

## ✅ Test at alt fungerer

### Test URL-ar

Alle desse skal fungere:
- ✅ `https://s7s.no`
- ✅ `https://www.s7s.no`
- ✅ `http://s7s.no` → Auto-redirect til https
- ✅ `https://s7s.vercel.app` (backup-URL)

### Test funksjonalitet

1. **Forside:** Last inn korrekt?
2. **Registrering:** Fungerer?
3. **Dashboard:** Kan du logge inn?
4. **Admin:** Fungerer admin-panel?

---

## 🎯 URL-prioritering

Vercel set automatisk opp:
- **Primær:** `www.s7s.no`
- **Redirect:** `s7s.no` → `www.s7s.no`
- **Backup:** `s7s.vercel.app`

Dette betyr at folk kan skrive både `s7s.no` og `www.s7s.no`, og begge fungerer! 🎉

---

## 📧 E-post på eige domene (valfritt)

Om du vil ha e-post på `post@s7s.no`:

### Billigaste løysing: Gmail + Custom Domain
1. G Suite Basic: ~50 kr/månad per brukar
2. Eller bruk Domeneshop sin e-postpakke: ~20 kr/månad

### Gratis løysing: Vidarekopling
- Set opp e-post-vidarekopling i Domeneshop
- `post@s7s.no` → `post@saudail.no`

---

## 🆘 Feilsøking

### Problem: "Domain not found" etter 30 min

**Løysing:**
```bash
# Sjekk DNS-propagering
# Gå til: https://dnschecker.org
# Skriv inn: s7s.no
# Sjekk at A-record peikar til 76.76.21.21
```

### Problem: "Invalid Configuration"

**Sjekk:**
- Er DNS-oppføringane korrekte?
- Har du lagra endringane i Domeneshop?
- Har du venta minst 5-10 minutt?

### Problem: "Mixed Content" eller "Not Secure"

**Løysing:**
- Vercel gir automatisk gratis SSL-sertifikat
- Sjekk at du brukar `https://` (ikkje `http://`)
- Vent 5 minutt etter domenet er aktivt

---

## 💡 Tips

1. **Kjøp domenet tidleg:** Innan nokon andre tek det!
2. **Auto-fornyelse:** Slå på auto-fornyelse så du ikkje mistar domenet
3. **Privacy protection:** Dei fleste domene-leverandørar tilbyr gratis WHOIS-skjerming
4. **E-post:** Vurder om du vil ha eigen e-post seinare

---

## 📊 Samanlikning av domene-leverandørar

| Leverandør | .no pris/år | .com pris/år | Support | DNS-admin |
|------------|-------------|--------------|---------|-----------|
| Domeneshop | 89-149 kr | 119-149 kr | 🇳🇴 Norsk | ⭐⭐⭐⭐⭐ |
| One.com | 50-100 kr | 80-120 kr | 🇳🇴 Norsk | ⭐⭐⭐⭐ |
| Namecheap | - | 80-140 kr | 🇬🇧 Engelsk | ⭐⭐⭐⭐⭐ |

**Anbefaling:** Domeneshop for .no domene

---

**Lykke til med ditt nye domene! 🌐**

