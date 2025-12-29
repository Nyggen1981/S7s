# Environment Variables Setup

Før du deployer, må du sette opp desse environment variables:

## Database (Neon)
```
DATABASE_URL="postgresql://brukar:passord@ep-xxxx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://brukar:passord@ep-xxxx.eu-west-2.aws.neon.tech/neondb?sslmode=require"
```

**Merk:** 
- `DATABASE_URL` bruker pooler-tilkopling (med `-pooler` i hostname) for betre ytelse
- `DIRECT_URL` bruker direkte tilkopling (utan `-pooler`) for migrasjonar

## NextAuth
```
NEXTAUTH_SECRET="generer-ein-tilfeldig-string-her"
NEXTAUTH_URL="https://ditt-domene.vercel.app"
```

## Admin bruker
```
ADMIN_EMAIL="admin@saudail.no"
ADMIN_PASSWORD="dittAdminPassord"
```

## E-post (valfritt)
```
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER="booking@saudail.no"
SMTP_PASSWORD="Arena-2025"
SMTP_FROM="booking@saudail.no"
```

**Alternativt (gamle variabelnavn støttes også):**
```
EMAIL_HOST="smtp.office365.com"
EMAIL_PORT="587"
EMAIL_USER="booking@saudail.no"
EMAIL_PASS="Arena-2025"
EMAIL_FROM="booking@saudail.no"
```

**Merk for Office365:**
- Bruker STARTTLS (port 587)
- Passordet er det samme som e-postkontoens passord
- `SMTP_FROM` bør være samme som `SMTP_USER` for Office365

## Vipps og Katalog
```
VIPPS_NUMBER="994 58 575"
CATALOG_PRICE="550"
```

## Generer NEXTAUTH_SECRET
Køyr denne kommandoen:
```bash
openssl rand -base64 32
```

Eller bruk: https://generate-secret.vercel.app/32

## Oppsett av Neon Database

1. Gå til [neon.tech](https://neon.tech) og opprett ein konto
2. Lag eit nytt prosjekt
3. Kopier connection string frå dashboard
4. Bruk pooler-URL for `DATABASE_URL` og direkte URL for `DIRECT_URL`
5. Køyr `npx prisma db push` for å opprette tabellane
6. Køyr `npx prisma db seed` for å legge inn fjella
