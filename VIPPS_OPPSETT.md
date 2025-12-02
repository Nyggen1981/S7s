# 💳 Vipps Oppsett

## ⚙️ Konfigurere Vipps-nummer

Rediger `.env` fila og endre desse verdiane:

```env
VIPPS_NUMBER="ditt-vipps-nummer"
CATALOG_PRICE="50"
```

**Eksempel:**
```env
VIPPS_NUMBER="987 65 432"
CATALOG_PRICE="75"
```

## 🔄 Oppdatere etter endring

Etter at du har endra `.env`:

1. **Stopp serveren** (Ctrl+C i terminalen)
2. **Start serveren på nytt:**
   ```powershell
   npm run dev
   ```
3. Nye verdiar blir automatisk lasta

## 📱 Kva brukarar ser

Når ein brukar logger inn og **ikkje har betalt**, vises:

```
💳 Betal med Vipps:
Vipps til: [DITT NUMMER]
Beløp: kr [PRIS],-
Merk betalinga med ditt namn
```

## ✅ Admin Workflow

### Når betaling kjem inn i Vipps:

1. **Sjekk Vipps** - Sjå kven som har betalt
2. **Logg inn på admin** - Gå til `/admin`
3. **Finn personen** - Bruk søk om nødvendig
4. **Klikk "Godkjenn"** - Oransje knapp i Betaling-kolonnen
5. **Bekreft** - Klikk OK i dialogen
6. Status endrar seg til "Betalt" (grøn)

### Brukar får automatisk:
- ✅ Grøn banner på dashboardet
- ✅ "Last ned PDF" knapp
- ✅ Tilgang til katalogen

## 📊 Tracking

Admin-panelet viser:
- **Stats-kort:** "Betalt" og "Ubetalt" teller
- **Tabell:** Betalingsstatus for kvar deltakar
- **Excel-eksport:** Inneheld betaling-kolonner

## 🔐 Sikkerheit

- Kun admin kan godkjenne betalingar
- Brukarar ser berre sin eigen betalingsstatus
- Katalogen er beskytta - kun tilgjengeleg etter betaling

## 💡 Tips

1. **Konsistent nummer:** Bruk same Vipps-nummer overalt
2. **Merk betalingar:** Be brukarar merke med namn
3. **Rask godkjenning:** Godkjenn betalingar raskt for god service
4. **Excel-eksport:** Bruk for å sjå oversikt over betalingar

## 🎯 Standard verdiar

Om du ikkje set verdiar i `.env`:
- **Vipps-nummer:** 123 45 678 (placeholder)
- **Pris:** kr 50,-

**Husk å endre desse før produksjon!**



