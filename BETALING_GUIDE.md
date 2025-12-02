# 💳 Vipps Betaling - Guide

## 📋 Oversikt

Deltakarar må betale kr 50,- for å få tilgang til S7S-katalogen. Etter registrering vil dei sjå betalingsinformasjon på dashboardet sitt.

## 👤 For Deltakarar

### 1. Registrer deg
- Gå til hovudsida og klikk "Registrer deg no"
- Fyll ut skjemaet

### 2. Logg inn
- Du blir automatisk sendt til dashboardet
- Øverst ser du ein **gul/oransje banner** med betalingsinformasjon

### 3. Betal med Vipps
- **Vipps til:** 123 45 678 (kan endrast i `.env`)
- **Beløp:** kr 50,-
- **Viktig:** Merk betalinga med ditt namn

### 4. Vent på godkjenning
- Admin vil sjå at du har registrert deg
- Når admin ser betalinga i Vipps, godkjenner dei i admin-panelet
- Du får automatisk tilgang til katalogen

### 5. Last ned katalogen
- Når betaling er godkjent, blir den gule banneren **grøn**
- Klikk på "Last ned PDF" for å laste ned S7S-katalogen

## 🔐 For Admin

### 1. Logg inn på admin-panelet
- Gå til `/admin/login`
- Logg inn med dine kredensial

### 2. Sjå betalingsstatus
- **Stats-kort:** Sjå kor mange som har betalt vs. ikkje betalt
- **Tabell:** "Betaling" kolonne viser status for kvar deltakar

### 3. Godkjenn betaling
- Sjekk Vipps for innbetalingar
- Finn personen i tabellen
- Klikk på **"Godkjenn"** knappen (oransje)
- Bekreft godkjenning
- Status endrar seg til **"Betalt"** (grøn)

### 4. Deltakar får tilgang
- Deltakar ser no grøn banner på dashboardet
- Kan laste ned katalogen umiddelbart

## ⚙️ Konfigurasjon

Rediger `.env` for å endre Vipps-nummer og pris:

```env
VIPPS_NUMBER="123 45 678"
CATALOG_PRICE="50"
```

## 📊 Database

Nye felt i User-tabellen:
- `hasPaid` (Boolean) - Om brukaren har betalt
- `paidAt` (DateTime) - Når betalinga vart godkjent

## 🔄 Workflow

```
Brukar registrerer seg
       ↓
Ser Vipps-info på dashboard
       ↓
Betaler med Vipps
       ↓
Admin ser ubetalt status
       ↓
Admin sjekker Vipps
       ↓
Admin godkjenner i panelet
       ↓
Brukar får tilgang til katalog
```

## ✅ Funksjonar

- ✅ Visuell indikator (gul = ikkje betalt, grøn = betalt)
- ✅ Admin kan godkjenne/avvise betaling
- ✅ Statistikk over betalingar i admin-panel
- ✅ Enkel ein-klikk godkjenning
- ✅ Timestamp for når betaling vart godkjent

## 💡 Tips

- Spør deltakarar om å merke Vipps-betaling med namn
- Sjekk Vipps før du godkjenner i admin-panelet
- Excel-eksporten viser også betalingsstatus

## 🚀 Produksjon

For produksjon kan dette oppgraderast til:
- Automatisk Vipps API-integrasjon
- Stripe/Klarna integrasjon
- Automatisk godkjenning
- Betalingsvarslingar



