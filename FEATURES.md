# ✨ Sauda Seven Summits - Funksjonar

## 🎯 Hovudfunksjonar

### 👥 For Deltakarar

#### ✅ Brukarregistrering
- Enkel registreringsprosess
- Samlar inn nødvendig informasjon:
  - Fullt namn
  - E-postadresse
  - Telefonnummer
  - T-skjorte størrelse (XS-XXL)
- Automatisk velkomst-e-post
- Validering av alle felt

#### 📊 Personleg Dashboard
- **Framdriftsoversikt:**
  - Visuell framgangsmåte (X/7 fjell)
  - Fargekoda status
  - Fullførte vs. gjenståande fjell

- **Fjellkort:**
  - Oversikt over alle 7 fjell
  - Namn, høgde, og beskrivelse
  - Status (fullført/ikkje fullført)
  - Visar bilde og dato for fullførte fjell

- **Registrering av fjelltur:**
  - Last opp bilete som bevis
  - Valfritt notatfelt
  - Enkel modal-basert opplasting
  - Automatisk oppdatering av framdrift

#### 🎉 Fullføringsfeiring
- Melding når alle 7 fjell er fullført
- Admin får automatisk e-post varsel
- Synleg "Fullført" badge på dashboard

### 🔐 For Administratorar

#### 📈 Admin Dashboard
- **Statistikk-kort:**
  - Totalt antal deltakarar
  - Antal som har fullført
  - Antal i gang
  - Antal som ikkje har starta

- **Deltakarliste:**
  - Komplett oversikt over alle deltakarar
  - Framdriftsmålar for kvar deltakar
  - Kontaktinformasjon (e-post, telefon)
  - T-skjorte størrelse
  - Registreringsdato
  - Fullføringsdato (om relevant)

#### 🔍 Søk og Filter
- **Søkefunksjon:**
  - Søk etter namn
  - Søk etter e-post
  - Live søk (sanntidsoppdatering)

- **Filter:**
  - Alle deltakarar
  - Berre fullførte
  - Berre i gang

#### 📊 Excel Eksport
- **Deltakarar-ark:**
  - All brukarinformasjon
  - Framdrift per brukar
  - Kolonne for kvart fjell med dato
  - Status (fullført/i gang)

- **Bestigningar-ark:**
  - Detaljert liste over alle registrerte turar
  - Namn, fjell, dato, tid
  - Notat frå deltakar

- **Funksjonar:**
  - Ein-klikk eksport
  - Automatisk filnamn med dato
  - Formatert og lett å lese

#### 🔒 Sikker Innlogging
- E-post og passord autentisering
- Hasha passord (bcrypt)
- Session management
- Automatisk utlogging

### 📧 E-post System

#### Velkomst-e-post
- Send automatisk ved registrering
- Inneheld:
  - Personleg helsing
  - Informasjon om utfordringa
  - Instruksjonar for å komme i gang

#### Fullførings-e-post (til admin)
- Send når deltakar fullfører alle 7 fjell
- Inneheld:
  - Deltakar namn og e-post
  - Link til admin-panel
  - Flott formatering

### 🎨 Design og UX

#### 🌄 Naturtema
- Fjellmotiv bakgrunnsbilete på hovudsida
- Blå og grå fargepalett
- S7S logo prominent plassert
- Moderne gradientar

#### 📱 Responsivt Design
- Fungerer perfekt på mobil
- Tablet-optimalisert
- Desktop-layout
- Touch-vennlege knappar

#### ⚡ Brukaropplevelse
- Raske lastestider
- Smooth overgangar og animasjonar
- Tydlege tilbakemeldingar
- Intuitivt design
- Bounce-animasjon på hovudside
- Hover-effektar
- Ladeanimasjonar

### 🛡️ Sikkerheit

#### ✅ Implementert
- Passord hashing (bcrypt)
- Protected admin ruter
- Input validering (client + server)
- CORS og XSS beskyttelse
- Session management
- Miljøvariablar for sensitive data

### 💾 Database

#### 📊 Struktur
- **SQLite** for utvikling (enkel oppsett)
- **PostgreSQL** support for produksjon
- **Prisma ORM** for type-sikker database tilgang
- Automatiske migreringer

#### 🔄 Relasjonar
- User ↔ Submissions (ein-til-mange)
- Peak ↔ Submissions (ein-til-mange)
- Unik constraint (brukar kan ikkje registrere same fjell to gonger)

### 🚀 Performance

#### ⚡ Optimalisering
- Next.js 14 App Router
- Server-side rendering
- Automatisk code splitting
- Image optimalisering (Next.js Image)
- Caching strategiar

### 📱 Progessive Web App Ready

Kan enkelt utvidas til PWA med:
- Offline support
- Push notifications
- App-ikon
- Installérbar

## 🎁 Bonusfunksjonar

### ✨ Ekstra detaljar
- GPS koordinatar (støtte i database)
- Notatfelt for kvar tur
- Timestamp for kvar registrering
- T-skjorte størrelse tracking
- Fullførings-dato tracking

### 🔮 Framtidige moglegheiter
- Leaderboard (rangering)
- Sosiale funksjonar (del bilete)
- QR-kode ved kvar topp
- Mobile app
- Push notifications
- Statistikk og grafer
- Badge system
- Kommentarfelt
- Vêrdata integrasjon

## 📊 Teknisk Stack

### Frontend
- ⚛️ React 18
- 🔷 TypeScript
- 🎨 Tailwind CSS
- 🎯 Lucide Icons
- 📝 React Hook Form

### Backend
- 🚀 Next.js 14 (App Router)
- 🗄️ Prisma ORM
- 🔐 NextAuth.js
- 📧 Nodemailer
- 📊 XLSX (Excel)
- 🔒 Bcrypt

### Database
- 💾 SQLite (dev)
- 🐘 PostgreSQL (prod)

## ✅ Produksjonsklart

- Komplett feilhåndtering
- Loading states
- Error boundaries
- Environment variables
- Secure authentication
- Data validation
- Type safety
- Linter-free code
- Dokumentert kode
- Setup scripts
- Deployment ready

---

**Resultat:** Ein fullstendig, produksjonsklart web-applikasjon for Sauda Seven Summits! 🏔️





