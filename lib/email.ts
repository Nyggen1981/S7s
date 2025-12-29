import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
  port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587'),
  secure: false, // Use STARTTLS (port 587)
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false, // For Office365 compatibility
  },
})

// Get admin settings
async function getAdminSettings() {
  try {
    let settings = await prisma.adminSettings.findUnique({
      where: { id: 'settings' }
    })
    if (!settings) {
      settings = {
        id: 'settings',
        notifyNewUser: true,
        notifyPeakSubmission: false,
        notifyAllPeaksCompleted: true,
        updatedAt: new Date()
      }
    }
    return settings
  } catch {
    return {
      id: 'settings',
      notifyNewUser: true,
      notifyPeakSubmission: false,
      notifyAllPeaksCompleted: true,
      updatedAt: new Date()
    }
  }
}

export async function sendCompletionEmail(userName: string, userEmail: string) {
  const settings = await getAdminSettings()
  if (!settings.notifyAllPeaksCompleted) {
    console.log('Completion notification disabled')
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saudasevensummits.no'
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: adminEmail,
      subject: '🏔️ Ny deltaker har fullført Sauda Seven Summits!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">🎉 Gratulerer!</h1>
          <p>En deltaker har akkurat fullført alle 7 fjelltopper!</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #334155; margin-top: 0;">Deltaker informasjon:</h2>
            <p><strong>Navn:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
          </div>
          <p>Logg inn på admin-panelet for å se alle detaljer og eksportere data.</p>
          <a href="${process.env.NEXTAUTH_URL}/admin" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Gå til Admin-panel
          </a>
        </div>
      `,
    })
    console.log('Completion email sent successfully')
  } catch (error) {
    console.error('Error sending completion email:', error)
  }
}

export async function sendWelcomeEmail(userName: string, userEmail: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: userEmail,
      subject: 'Velkommen til Sauda Seven Summits! 🏔️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Velkommen, ${userName}! 🏔️</h1>
          <p>Takk for at du registrerte deg for Sauda Seven Summits!</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0369a1; margin-top: 0;">Slik kommer du i gang:</h2>
            <ol style="color: #334155;">
              <li>Velg et fjell å bestige</li>
              <li>Ta et bilde på toppen som bevis</li>
              <li>Last opp bildet i appen</li>
              <li>Gjenta for alle 7 topper!</li>
            </ol>
          </div>
          <p>Fullfører du alle 7 topper innen ett år, venter det en premie på deg! 🎁</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Lykke til med utfordringen!</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

export async function sendPasswordResetEmail(userEmail: string, newPassword: string, isAdmin: boolean = false) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: userEmail,
      subject: '🔐 Ditt nye passord for Sauda Seven Summits',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Passord tilbakestilt</h1>
          <p>Du har bedt om å tilbakestille passordet ditt for Sauda Seven Summits.</p>
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #92400e; margin-top: 0;">Ditt nye passord:</h2>
            <p style="font-size: 18px; font-weight: bold; color: #78350f; font-family: monospace; background-color: white; padding: 12px; border-radius: 4px; text-align: center;">
              ${newPassword}
            </p>
          </div>
          <p style="color: #dc2626; font-weight: bold;">⚠️ Viktig: Endre dette passordet etter innlogging for bedre sikkerhet.</p>
          <p>Du kan nå logge inn med dette passordet.</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://s7s-woad.vercel.app'}${isAdmin ? '/admin/login' : '/dashboard'}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Logg inn her
          </a>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Hvis du ikke ba om dette, kan du trygt ignorere denne e-posten.</p>
        </div>
      `,
    })
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Admin notification: New user registered
export async function sendNewUserNotification(userName: string, userEmail: string, phone: string, tshirtSize: string) {
  const settings = await getAdminSettings()
  if (!settings.notifyNewUser) {
    console.log('New user notification disabled')
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saudasevensummits.no'
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: adminEmail,
      subject: '👤 Ny brukar registrert - Sauda Seven Summits',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">👤 Ny brukar registrert</h1>
          <p>Ein ny brukar har registrert seg for Sauda Seven Summits.</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #334155; margin-top: 0;">Brukarinformasjon:</h2>
            <p><strong>Namn:</strong> ${userName}</p>
            <p><strong>E-post:</strong> ${userEmail}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>T-skjorte:</strong> ${tshirtSize}</p>
          </div>
          <p>Registrert: ${new Date().toLocaleString('no-NO')}</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://s7s-woad.vercel.app'}/admin" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Gå til Admin-panel
          </a>
        </div>
      `,
      text: `Ny brukar registrert\n\nNamn: ${userName}\nE-post: ${userEmail}\nTelefon: ${phone}\nT-skjorte: ${tshirtSize}\n\nRegistrert: ${new Date().toLocaleString('no-NO')}`
    })
    console.log('New user notification sent')
  } catch (error) {
    console.error('Error sending new user notification:', error)
  }
}

// Admin notification: Peak submission
export async function sendPeakSubmissionNotification(userName: string, userEmail: string, peakName: string, submissionCount: number, totalPeaks: number) {
  const settings = await getAdminSettings()
  if (!settings.notifyPeakSubmission) {
    console.log('Peak submission notification disabled')
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saudasevensummits.no'
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: adminEmail,
      subject: `🏔️ Ny fjellregistrering: ${peakName} - Sauda Seven Summits`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">🏔️ Ny fjellregistrering</h1>
          <p>Ein brukar har registrert ein ny fjelltopp.</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #334155; margin-top: 0;">Detaljer:</h2>
            <p><strong>Brukar:</strong> ${userName}</p>
            <p><strong>E-post:</strong> ${userEmail}</p>
            <p><strong>Fjell:</strong> ${peakName}</p>
            <p><strong>Framgang:</strong> ${submissionCount}/${totalPeaks} toppar</p>
          </div>
          <p>Registrert: ${new Date().toLocaleString('no-NO')}</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://s7s-woad.vercel.app'}/admin" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Gå til Admin-panel
          </a>
        </div>
      `,
      text: `Ny fjellregistrering\n\nBrukar: ${userName}\nE-post: ${userEmail}\nFjell: ${peakName}\nFramgang: ${submissionCount}/${totalPeaks} toppar\n\nRegistrert: ${new Date().toLocaleString('no-NO')}`
    })
    console.log('Peak submission notification sent')
  } catch (error) {
    console.error('Error sending peak submission notification:', error)
  }
}

// Email templates for admin viewing
export const emailTemplates = {
  welcome: {
    name: 'Velkomstmail',
    description: 'Sendes til nye brukere ved registrering',
    subject: 'Velkommen til Sauda Seven Summits! 🏔️',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">Velkommen, {userName}! 🏔️</h1>
  <p>Takk for at du registrerte deg for Sauda Seven Summits!</p>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #0369a1; margin-top: 0;">Slik kommer du i gang:</h2>
    <ol style="color: #334155;">
      <li>Velg et fjell å bestige</li>
      <li>Ta et bilde på toppen som bevis</li>
      <li>Last opp bildet i appen</li>
      <li>Gjenta for alle 7 topper!</li>
    </ol>
  </div>
  <p>Fullfører du alle 7 topper innen ett år, venter det en premie på deg! 🎁</p>
  <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Lykke til med utfordringen!</p>
</div>`,
    plainText: `Velkommen, {userName}!

Takk for at du registrerte deg for Sauda Seven Summits!

Slik kommer du i gang:
1. Velg et fjell å bestige
2. Ta et bilde på toppen som bevis
3. Last opp bildet i appen
4. Gjenta for alle 7 topper!

Fullfører du alle 7 topper innen ett år, venter det en premie på deg!

Lykke til med utfordringen!`
  },
  completion: {
    name: 'Fullføringsvarsel (til admin)',
    description: 'Sendes til admin når en bruker fullfører alle 7 topper',
    subject: '🏔️ Ny deltaker har fullført Sauda Seven Summits!',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">🎉 Gratulerer!</h1>
  <p>En deltaker har akkurat fullført alle 7 fjelltopper!</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #334155; margin-top: 0;">Deltaker informasjon:</h2>
    <p><strong>Navn:</strong> {userName}</p>
    <p><strong>Email:</strong> {userEmail}</p>
  </div>
  <p>Logg inn på admin-panelet for å se alle detaljer og eksportere data.</p>
  <a href="{adminUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
    Gå til Admin-panel
  </a>
</div>`,
    plainText: `Gratulerer!

En deltaker har akkurat fullført alle 7 fjelltopper!

Deltaker informasjon:
Navn: {userName}
Email: {userEmail}

Logg inn på admin-panelet for å se alle detaljer og eksportere data.`
  },
  newUser: {
    name: 'Ny bruker-varsel (til admin)',
    description: 'Sendes til admin når en ny bruker registrerer seg',
    subject: '👤 Ny brukar registrert - Sauda Seven Summits',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">👤 Ny brukar registrert</h1>
  <p>Ein ny brukar har registrert seg for Sauda Seven Summits.</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #334155; margin-top: 0;">Brukarinformasjon:</h2>
    <p><strong>Namn:</strong> {userName}</p>
    <p><strong>E-post:</strong> {userEmail}</p>
    <p><strong>Telefon:</strong> {phone}</p>
    <p><strong>T-skjorte:</strong> {tshirtSize}</p>
  </div>
  <a href="{adminUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
    Gå til Admin-panel
  </a>
</div>`,
    plainText: `Ny brukar registrert

Namn: {userName}
E-post: {userEmail}
Telefon: {phone}
T-skjorte: {tshirtSize}`
  },
  peakSubmission: {
    name: 'Fjellregistrering-varsel (til admin)',
    description: 'Sendes til admin når en bruker registrerer et fjell',
    subject: '🏔️ Ny fjellregistrering: {peakName}',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">🏔️ Ny fjellregistrering</h1>
  <p>Ein brukar har registrert ein ny fjelltopp.</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #334155; margin-top: 0;">Detaljer:</h2>
    <p><strong>Brukar:</strong> {userName}</p>
    <p><strong>E-post:</strong> {userEmail}</p>
    <p><strong>Fjell:</strong> {peakName}</p>
    <p><strong>Framgang:</strong> {submissionCount}/{totalPeaks} toppar</p>
  </div>
  <a href="{adminUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
    Gå til Admin-panel
  </a>
</div>`,
    plainText: `Ny fjellregistrering

Brukar: {userName}
E-post: {userEmail}
Fjell: {peakName}
Framgang: {submissionCount}/{totalPeaks} toppar`
  },
  passwordReset: {
    name: 'Passord tilbakestilt',
    description: 'Sendes til bruker når de ber om nytt passord',
    subject: '🔐 Ditt nye passord for Sauda Seven Summits',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">Passord tilbakestilt</h1>
  <p>Du har bedt om å tilbakestille passordet ditt for Sauda Seven Summits.</p>
  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #92400e; margin-top: 0;">Ditt nye passord:</h2>
    <p style="font-size: 18px; font-weight: bold; color: #78350f; font-family: monospace; background-color: white; padding: 12px; border-radius: 4px; text-align: center;">
      {newPassword}
    </p>
  </div>
  <p style="color: #dc2626; font-weight: bold;">⚠️ Viktig: Endre dette passordet etter innlogging for bedre sikkerhet.</p>
  <a href="{loginUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
    Logg inn her
  </a>
</div>`,
    plainText: `Passord tilbakestilt

Du har bedt om å tilbakestille passordet ditt for Sauda Seven Summits.

Ditt nye passord: {newPassword}

Viktig: Endre dette passordet etter innlogging for bedre sikkerhet.`
  }
}





