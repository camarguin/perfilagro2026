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
            to: [process.env.CONTACT_EMAIL, process.env.CONTACT_EMAIL_SECONDARY].filter(Boolean).join(',') || 'contato@perfilagro.com.br', // list of receivers
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

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function sendJobNotification(
    jobOwnerEmail: string,
    jobTitle: string,
    candidateData: {
        name: string,
        email: string,
        phone: string,
        region: string,
        category: string,
        seniority: string,
        experience?: string[]
    },
    resumePath: string
) {
    // Generate signed URL for the resume (valid for 7 days)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
        .storage
        .from('resumes')
        .createSignedUrl(resumePath, 60 * 60 * 24 * 7)

    if (signedUrlError) {
        console.error('Error generating signed URL:', signedUrlError)
    }

    const downloadUrl = signedUrlData?.signedUrl

    // Configure transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const targetEmail = jobOwnerEmail

    if (!targetEmail) {
        console.log('Skipping notification: No owner email provided for job:', jobTitle)
        return { success: true, skipped: true }
    }

    try {
        await transporter.sendMail({
            from: `"Perfil Agro" <${process.env.SMTP_USER}>`,
            to: targetEmail,
            subject: `[Nova Candidatura] ${jobTitle} - ${candidateData.name}`,
            html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #1A3C34; border-bottom: 2px solid #1A3C34; padding-bottom: 10px;">Nova Candidatura Recebida</h2>
    <p>Olá, uma nova pessoa se candidatou para a vaga: <strong>${jobTitle}</strong></p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Dados do Candidato:</h3>
        <p><strong>Nome:</strong> ${candidateData.name}</p>
        <p><strong>Email:</strong> ${candidateData.email}</p>
        <p><strong>WhatsApp:</strong> ${candidateData.phone}</p>
        <p><strong>Localização:</strong> ${candidateData.region}</p>
        <p><strong>Nível:</strong> ${candidateData.seniority}</p>
        <p><strong>Área:</strong> ${candidateData.category}</p>
    </div>

    ${downloadUrl ? `
    <div style="text-align: center; margin-top: 30px;">
        <a href="${downloadUrl}" style="background-color: #1A3C34; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            📄 BAIXAR CURRÍCULO (PDF)
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 10px;">Link válido por 7 dias.</p>
    </div>
    ` : '<p style="color: #cc0000; font-weight: bold;">⚠️ Erro ao gerar link do currículo. Verifique no painel admin.</p>'}
    
    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
    <p style="color: #999; font-size: 12px; text-align: center;">Este é um e-mail automático enviado pelo sistema Perfil Agro.</p>
</div>
            `,
        });

        return { success: true }
    } catch (error) {
        console.error('Error sending job notification email:', error)
        return { success: false, error: 'Falha ao enviar notificação.' }
    }
}
