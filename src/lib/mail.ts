import nodemailer from 'nodemailer'

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587')
  const secure = process.env.SMTP_SECURE === 'true'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  // Debug log (remove in production)
  console.log('SMTP Config:', { host, port, secure, user: user ? '***' : 'not set' })

  // Zoho specific configuration
  if (host.includes('zoho')) {
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  // Default configuration
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
      user: user,
      pass: pass,
    },
  })
}

const transporter = createTransporter()

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteName = 'Hilal Technologic'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${siteUrl}/auth/verify?token=${token}`

  const mailOptions = {
    from: `"${siteName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Verifikasi Email Anda - ${siteName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifikasi Email</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">${siteName}</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #ffffff;">Verifikasi Email Anda</h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #a1a1aa;">
                Terima kasih telah mendaftar di ${siteName}. Silakan klik tombol di bawah untuk memverifikasi alamat email Anda.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Verifikasi Email
                </a>
              </div>
              <p style="margin: 20px 0 0; font-size: 14px; color: #71717a;">
                Jika tombol tidak berfungsi, salin dan tempel URL berikut ke browser Anda:
              </p>
              <p style="margin: 10px 0 0; font-size: 14px; color: #8B5CF6; word-break: break-all;">
                ${verifyUrl}
              </p>
              <p style="margin: 30px 0 0; font-size: 14px; color: #71717a;">
                Link ini akan kedaluwarsa dalam 24 jam.
              </p>
            </div>
            <div style="padding: 20px 30px; background-color: #111; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${siteUrl}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: `"${siteName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Reset Password - ${siteName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">${siteName}</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #ffffff;">Reset Password</h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #a1a1aa;">
                Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Reset Password
                </a>
              </div>
              <p style="margin: 20px 0 0; font-size: 14px; color: #71717a;">
                Jika Anda tidak meminta reset password, abaikan email ini.
              </p>
              <p style="margin: 30px 0 0; font-size: 14px; color: #71717a;">
                Link ini akan kedaluwarsa dalam 1 jam.
              </p>
            </div>
            <div style="padding: 20px 30px; background-color: #111; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}
