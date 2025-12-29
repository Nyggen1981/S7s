import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const testEmail = searchParams.get('email')

  // Check environment variables
  const config = {
    SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'NOT SET',
    SMTP_PORT: process.env.SMTP_PORT || process.env.EMAIL_PORT || 'NOT SET',
    SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || 'NOT SET',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS ? '***SET***' : 'NOT SET',
    SMTP_FROM: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'NOT SET',
  }

  // If no email provided, just show config status
  if (!testEmail) {
    return NextResponse.json({
      message: 'E-post konfigurasjon status',
      config,
      usage: 'Legg til ?email=din@email.no for å sende test-e-post'
    })
  }

  // Try to send test email
  try {
    const transporter = nodemailer.createTransport({
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
      debug: true,
      logger: true,
    })

    // Verify connection
    await transporter.verify()

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@saudasevensummits.no',
      to: testEmail,
      subject: '🏔️ Test-e-post fra Sauda Seven Summits',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">✅ E-post fungerer!</h1>
          <p>Denne e-posten bekrefter at SMTP-konfigurasjonen er riktig.</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Sendt: ${new Date().toLocaleString('no-NO')}
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Test-e-post sendt!',
      messageId: info.messageId,
      config
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      config
    }, { status: 500 })
  }
}

