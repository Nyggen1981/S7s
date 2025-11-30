# 📁 Sauda Seven Summits - Prosjektstruktur

## 🎯 Oversikt

```
S7S/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 🏠 Hovudside (landing page)
│   ├── layout.tsx               # Global layout
│   ├── globals.css              # Global CSS stilar
│   │
│   ├── register/                # 📝 Brukarregistrering
│   │   └── page.tsx
│   │
│   ├── dashboard/               # 📊 Brukar dashboard
│   │   └── page.tsx
│   │
│   ├── admin/                   # 🔐 Admin-seksjonen
│   │   ├── login/
│   │   │   └── page.tsx        # Admin login
│   │   └── page.tsx            # Admin dashboard
│   │
│   └── api/                     # 🔌 API Routes
│       ├── auth/
│       │   └── [...nextauth]/   # NextAuth autentisering
│       ├── register/            # Brukarregistrering API
│       ├── user/                # Hent brukardata
│       ├── peaks/               # Hent fjellliste
│       ├── submit-peak/         # Registrer fjelltur
│       └── admin/
│           ├── users/           # Admin: Hent alle brukarar
│           └── export/          # Admin: Excel eksport
│
├── components/                   # ⚛️ React komponentar
│   └── AdminDashboard.tsx       # Admin dashboard komponent
│
├── lib/                         # 🛠️ Utilities og konfigurering
│   ├── prisma.ts               # Prisma database client
│   ├── auth.ts                 # NextAuth konfigurasjon
│   ├── email.ts                # E-post sending
│   └── utils.ts                # Hjelpefunksjonar
│
├── prisma/                      # 🗄️ Database
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script (initial data)
│
├── types/                       # 📘 TypeScript type definitions
│   └── next-auth.d.ts
│
├── public/                      # 🖼️ Statiske filer
│   └── S7S.png                 # Logo
│
├── middleware.ts                # 🔒 NextAuth middleware
├── .env                        # ⚙️ Miljøvariablar (konfigurasjon)
├── setup.ps1                   # 🚀 Setup script
├── QUICK_START.md              # ⚡ Rask start guide
├── SETUP_GUIDE.md              # 📖 Detaljert oppsettguide
└── README.md                   # 📚 Hovuddokumentasjon
```

## 🗺️ Brukarflyt

### Deltakar:
1. **Hovudside** (`/`) → Informasjon om utfordringa
2. **Registrering** (`/register`) → Registrer deg som deltakar
3. **Dashboard** (`/dashboard`) → Sjå framdrift og registrer fjellturar
   - Vis fullførte fjell
   - Last opp bilete for nye fjell
   - Sjå totalt framdrift (X/7)

### Admin:
1. **Admin login** (`/admin/login`) → Logg inn som admin
2. **Admin dashboard** (`/admin`) → Oversikt over alle deltakarar
   - Sjå statistikk
   - Søk og filtrer deltakarar
   - Eksporter data til Excel

## 🔌 API Endpoints

| Endpoint | Metode | Funksjon |
|----------|--------|----------|
| `/api/register` | POST | Registrer ny brukar |
| `/api/user?email=` | GET | Hent brukardata |
| `/api/peaks` | GET | Hent alle fjell |
| `/api/submit-peak` | POST | Registrer fjelltur med bilete |
| `/api/admin/users` | GET | Hent alle brukarar (krever auth) |
| `/api/admin/export` | GET | Eksporter til Excel (krever auth) |

## 🗄️ Database tabeller

### User
- Brukarinformasjon
- Felt: name, email, phone, tshirtSize, createdAt, completedAt

### Peak
- Fjellinformasjon
- Felt: name, description, elevation, order

### Submission
- Registrerte fjellturar
- Felt: userId, peakId, imagePath, submittedAt, notes

### Admin
- Admin-brukarar
- Felt: email, password (hashed), name

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Moderne ikoner
- **Custom theme** - Naturtema med blå og grå tonar

## 🔐 Sikkerheit

- **NextAuth** - Autentisering for admin
- **Bcrypt** - Passord hashing
- **Middleware** - Beskyttar admin-ruter
- **Form validering** - På både client og server

## 📧 E-post funksjonar

- **Velkomst-e-post** - Når brukar registrerer seg
- **Fullførings-e-post** - Til admin når nokon fullfører alle 7 topper

## 🚀 Deployment

Standard Next.js deployment:
- Vercel (anbefalt)
- Railway
- DigitalOcean
- AWS/Azure/GCP

## 📦 Hovudavhengigheter

- `next` - React framework
- `react` - UI library
- `prisma` - Database ORM
- `next-auth` - Autentisering
- `tailwindcss` - CSS framework
- `xlsx` - Excel generering
- `nodemailer` - E-post sending
- `bcryptjs` - Passord hashing




