import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendCompletionEmail(userName: string, userEmail: string) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saudasevensummits.no'
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@saudasevensummits.no',
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
      from: process.env.SMTP_FROM || 'noreply@saudasevensummits.no',
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





