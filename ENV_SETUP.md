# Environment Variables Setup

Før du deployer, må du sette opp desse environment variables:

## Database
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

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
EMAIL_FROM="post@saudail.no"
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="din-email@example.com"
EMAIL_PASS="ditt-passord"
```

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

