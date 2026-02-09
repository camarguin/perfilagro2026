'use server'

import nodemailer from 'nodemailer'

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { success: false, error: 'Campos obrigatórios faltando.' }
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`, // sender address
            to: process.env.CONTACT_EMAIL || 'contato@perfilagro.com.br', // list of receivers
            replyTo: email,
            subject: `[Contato Site] ${subject}`, // Subject line
            text: `
Nome: ${name}
Email: ${email}
Assunto: ${subject}

Mensagem:
${message}
            `, // plain text body
            html: `
<h3>Nova mensagem de contato do site</h3>
<p><strong>Nome:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Assunto:</strong> ${subject}</p>
<br/>
<p><strong>Mensagem:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
            `, // html body
        });

        return { success: true }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: 'Falha ao enviar email.' }
    }
}
