import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

// Create transporter with connection pooling
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
    port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    // Connection pool settings
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 30000, // 30 seconds
  })
}

let transporter = createTransporter()

// Retry helper function
async function sendWithRetry(
  mailOptions: nodemailer.SendMailOptions,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email attempt ${attempt}/${maxRetries} to: ${mailOptions.to}`)
      
      // Recreate transporter on retry to get fresh connection
      if (attempt > 1) {
        transporter = createTransporter()
      }
      
      await transporter.sendMail(mailOptions)
      console.log(`Email sent successfully on attempt ${attempt}`)
      return true
    } catch (error: any) {
      const errorMessage = error?.message || String(error)
      console.error(`Email attempt ${attempt} failed:`, errorMessage)
      
      // Don't retry on timeout - email might have been sent
      if (errorMessage.toLowerCase().includes('timeout') || 
          errorMessage.includes('ETIMEDOUT') ||
          errorMessage.includes('ESOCKET')) {
        console.log('Timeout error - NOT retrying (email may have been sent)')
        // Return true to avoid duplicate sends - assume it was sent
        return true
      }
      
      // Don't retry on authentication errors
      if (errorMessage.includes('authentication') || 
          errorMessage.includes('535') ||
          errorMessage.includes('Invalid login')) {
        console.error('Authentication error - NOT retrying')
        return false
      }
      
      if (attempt < maxRetries) {
        console.log(`Waiting ${delayMs}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        delayMs *= 1.5 // Exponential backoff
      }
    }
  }
  
  console.error(`All ${maxRetries} email attempts failed`)
  return false
}

// Get admin settings from database
async function getAdminSettings() {
  try {
    let settings = await prisma.adminSettings.findUnique({
      where: { id: 'settings' }
    })
    
    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.adminSettings.create({
        data: {
          id: 'settings',
          notifyNewUser: true,
          notifyPeakSubmission: false,
          notifyAllPeaksCompleted: true,
        }
      })
      console.log('Created default admin settings')
    }
    
    return settings
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    // Return defaults on error
    return {
      id: 'settings',
      notifyNewUser: true,
      notifyPeakSubmission: false,
      notifyAllPeaksCompleted: true,
      updatedAt: new Date()
    }
  }
}

// Get admin email with validation
function getAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL
  if (!email || !email.includes('@')) {
    console.error('ADMIN_EMAIL not set or invalid')
    return null
  }
  return email
}

// Get FROM email
function getFromEmail(): string {
  return process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@saudasevensummits.no'
}

// ============================================
// COMPLETION EMAIL - When user completes all 7
// ============================================
export async function sendCompletionEmail(userName: string, userEmail: string): Promise<boolean> {
  console.log('=== sendCompletionEmail START ===')
  console.log('User:', userName, userEmail)
  
  // Check admin settings FIRST
  const settings = await getAdminSettings()
  console.log('Admin setting notifyAllPeaksCompleted:', settings.notifyAllPeaksCompleted)
  
  if (!settings.notifyAllPeaksCompleted) {
    console.log('Completion notification DISABLED by admin settings')
    return false
  }

  // Check admin email is set
  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    console.error('Cannot send completion email: ADMIN_EMAIL not configured')
    return false
  }
  
  console.log('Sending completion notification to:', adminEmail)
  
  const mailOptions = {
    from: getFromEmail(),
    to: adminEmail,
    subject: '🏔️ Ny deltakar har fullført Sauda Seven Summits!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Gratulerer!</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #334155;">Ein deltakar har akkurat fullført alle 7 fjelltopper!</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0369a1;">
            <h2 style="color: #334155; margin-top: 0; font-size: 18px;">Deltakar informasjon:</h2>
            <p style="margin: 8px 0;"><strong>Namn:</strong> ${userName}</p>
            <p style="margin: 8px 0;"><strong>E-post:</strong> ${userEmail}</p>
            <p style="margin: 8px 0;"><strong>Fullført:</strong> ${new Date().toLocaleString('no-NO', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
          <p style="color: #64748b;">Logg inn på admin-panelet for å sjå alle detaljar og eksportere data.</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://s7s-woad.vercel.app'}/admin" 
             style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: bold;">
            Gå til Admin-panel →
          </a>
        </div>
      </div>
    `,
    text: `Gratulerer!\n\nEin deltakar har akkurat fullført alle 7 fjelltopper!\n\nNamn: ${userName}\nE-post: ${userEmail}\nFullført: ${new Date().toLocaleString('no-NO')}\n\nLogg inn på admin-panelet for å sjå alle detaljar.`
  }

  const success = await sendWithRetry(mailOptions, 3, 2000)
  console.log('=== sendCompletionEmail END, success:', success, '===')
  return success
}

// ============================================
// WELCOME EMAIL - To new users
// ============================================
export async function sendWelcomeEmail(userName: string, userEmail: string): Promise<boolean> {
  console.log('Sending welcome email to:', userEmail)
  
  const mailOptions = {
    from: getFromEmail(),
    to: userEmail,
    subject: 'Velkommen til Sauda Seven Summits! 🏔️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Velkommen, ${userName}! 🏔️</h1>
        <p>Takk for at du registrerte deg for Sauda Seven Summits!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #0369a1; margin-top: 0;">Slik kjem du i gang:</h2>
          <ol style="color: #334155;">
            <li>Vel eit fjell å bestige</li>
            <li>Ta eit bilete på toppen som bevis</li>
            <li>Last opp biletet i appen</li>
            <li>Gjenta for alle 7 toppar!</li>
          </ol>
        </div>
        <p>Fullfører du alle 7 toppar innen eitt år, ventar det ein premie på deg! 🎁</p>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Lykke til med utfordringa!</p>
      </div>
    `,
    text: `Velkommen, ${userName}!\n\nTakk for at du registrerte deg for Sauda Seven Summits!\n\nSlik kjem du i gang:\n1. Vel eit fjell å bestige\n2. Ta eit bilete på toppen som bevis\n3. Last opp biletet i appen\n4. Gjenta for alle 7 toppar!\n\nFullfører du alle 7 toppar innen eitt år, ventar det ein premie på deg!\n\nLykke til med utfordringa!`
  }

  return await sendWithRetry(mailOptions, 3, 2000)
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================
export async function sendPasswordResetEmail(userEmail: string, newPassword: string, isAdmin: boolean = false): Promise<boolean> {
  console.log('Sending password reset email to:', userEmail)
  
  const loginUrl = `${process.env.NEXTAUTH_URL || 'https://s7s-woad.vercel.app'}${isAdmin ? '/admin/login' : '/dashboard'}`
  
  const mailOptions = {
    from: getFromEmail(),
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
        <p style="color: #dc2626; font-weight: bold;">⚠️ Viktig: Endre dette passordet etter innlogging for betre sikkerheit.</p>
        <a href="${loginUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          Logg inn her
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Viss du ikkje ba om dette, kan du trygt ignorere denne e-posten.</p>
      </div>
    `,
    text: `Passord tilbakestilt\n\nDu har bedt om å tilbakestille passordet ditt for Sauda Seven Summits.\n\nDitt nye passord: ${newPassword}\n\nViktig: Endre dette passordet etter innlogging for betre sikkerheit.\n\nLogg inn her: ${loginUrl}`
  }

  const success = await sendWithRetry(mailOptions, 3, 2000)
  if (!success) {
    throw new Error('Kunne ikkje sende e-post. Prøv igjen seinare.')
  }
  return success
}

// ============================================
// NEW USER NOTIFICATION - To admin
// ============================================
export async function sendNewUserNotification(userName: string, userEmail: string, phone: string, tshirtSize: string): Promise<boolean> {
  console.log('=== sendNewUserNotification START ===')
  
  // Check admin settings FIRST
  const settings = await getAdminSettings()
  console.log('Admin setting notifyNewUser:', settings.notifyNewUser)
  
  if (!settings.notifyNewUser) {
    console.log('New user notification DISABLED by admin settings')
    return false
  }

  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    console.error('Cannot send new user notification: ADMIN_EMAIL not configured')
    return false
  }
  
  console.log('Sending new user notification to:', adminEmail)
  
  const mailOptions = {
    from: getFromEmail(),
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
  }

  const success = await sendWithRetry(mailOptions, 3, 2000)
  console.log('=== sendNewUserNotification END, success:', success, '===')
  return success
}

// ============================================
// PEAK SUBMISSION NOTIFICATION - To admin
// ============================================
export async function sendPeakSubmissionNotification(
  userName: string, 
  userEmail: string, 
  peakName: string, 
  submissionCount: number, 
  totalPeaks: number
): Promise<boolean> {
  console.log('=== sendPeakSubmissionNotification START ===')
  
  // Check admin settings FIRST
  const settings = await getAdminSettings()
  console.log('Admin setting notifyPeakSubmission:', settings.notifyPeakSubmission)
  
  if (!settings.notifyPeakSubmission) {
    console.log('Peak submission notification DISABLED by admin settings')
    return false
  }

  const adminEmail = getAdminEmail()
  if (!adminEmail) {
    console.error('Cannot send peak notification: ADMIN_EMAIL not configured')
    return false
  }
  
  console.log('Sending peak notification to:', adminEmail)
  
  const mailOptions = {
    from: getFromEmail(),
    to: adminEmail,
    subject: `🏔️ Ny fjellregistrering: ${peakName} - Sauda Seven Summits`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">🏔️ Ny fjellregistrering</h1>
        <p>Ein brukar har registrert ein ny fjelltopp.</p>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #334155; margin-top: 0;">Detaljar:</h2>
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
  }

  const success = await sendWithRetry(mailOptions, 3, 2000)
  console.log('=== sendPeakSubmissionNotification END, success:', success, '===')
  return success
}

// ============================================
// EMAIL TEMPLATES - For admin viewing
// ============================================
export const emailTemplates = {
  welcome: {
    name: 'Velkomstmail',
    description: 'Sendast til nye brukarar ved registrering',
    subject: 'Velkommen til Sauda Seven Summits! 🏔️',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">Velkommen, {userName}! 🏔️</h1>
  <p>Takk for at du registrerte deg for Sauda Seven Summits!</p>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #0369a1; margin-top: 0;">Slik kjem du i gang:</h2>
    <ol style="color: #334155;">
      <li>Vel eit fjell å bestige</li>
      <li>Ta eit bilete på toppen som bevis</li>
      <li>Last opp biletet i appen</li>
      <li>Gjenta for alle 7 toppar!</li>
    </ol>
  </div>
  <p>Fullfører du alle 7 toppar innen eitt år, ventar det ein premie på deg! 🎁</p>
</div>`,
    plainText: `Velkommen, {userName}!\n\nTakk for at du registrerte deg for Sauda Seven Summits!\n\nSlik kjem du i gang:\n1. Vel eit fjell å bestige\n2. Ta eit bilete på toppen som bevis\n3. Last opp biletet i appen\n4. Gjenta for alle 7 toppar!\n\nFullfører du alle 7 toppar innen eitt år, ventar det ein premie på deg!`
  },
  completion: {
    name: 'Fullføringsvarsel (til admin)',
    description: 'Sendast til admin når ein brukar fullfører alle 7 toppar',
    subject: '🏔️ Ny deltakar har fullført Sauda Seven Summits!',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">🎉 Gratulerer!</h1>
  <p>Ein deltakar har akkurat fullført alle 7 fjelltopper!</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Namn:</strong> {userName}</p>
    <p><strong>E-post:</strong> {userEmail}</p>
  </div>
</div>`,
    plainText: `Gratulerer!\n\nEin deltakar har akkurat fullført alle 7 fjelltopper!\n\nNamn: {userName}\nE-post: {userEmail}`
  },
  newUser: {
    name: 'Ny brukar-varsel (til admin)',
    description: 'Sendast til admin når ein ny brukar registrerer seg',
    subject: '👤 Ny brukar registrert - Sauda Seven Summits',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">👤 Ny brukar registrert</h1>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Namn:</strong> {userName}</p>
    <p><strong>E-post:</strong> {userEmail}</p>
    <p><strong>Telefon:</strong> {phone}</p>
    <p><strong>T-skjorte:</strong> {tshirtSize}</p>
  </div>
</div>`,
    plainText: `Ny brukar registrert\n\nNamn: {userName}\nE-post: {userEmail}\nTelefon: {phone}\nT-skjorte: {tshirtSize}`
  },
  peakSubmission: {
    name: 'Fjellregistrering-varsel (til admin)',
    description: 'Sendast til admin når ein brukar registrerer eit fjell',
    subject: '🏔️ Ny fjellregistrering: {peakName}',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">🏔️ Ny fjellregistrering</h1>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Brukar:</strong> {userName}</p>
    <p><strong>Fjell:</strong> {peakName}</p>
    <p><strong>Framgang:</strong> {submissionCount}/{totalPeaks} toppar</p>
  </div>
</div>`,
    plainText: `Ny fjellregistrering\n\nBrukar: {userName}\nFjell: {peakName}\nFramgang: {submissionCount}/{totalPeaks} toppar`
  },
  passwordReset: {
    name: 'Passord tilbakestilt',
    description: 'Sendast til brukar når dei ber om nytt passord',
    subject: '🔐 Ditt nye passord for Sauda Seven Summits',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #0f172a;">Passord tilbakestilt</h1>
  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #92400e; margin-top: 0;">Ditt nye passord:</h2>
    <p style="font-size: 18px; font-weight: bold; font-family: monospace;">{newPassword}</p>
  </div>
  <p style="color: #dc2626; font-weight: bold;">⚠️ Endre dette passordet etter innlogging!</p>
</div>`,
    plainText: `Passord tilbakestilt\n\nDitt nye passord: {newPassword}\n\nViktig: Endre dette passordet etter innlogging for betre sikkerheit.`
  }
}
