import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure your own SMTP settings here via Environment Variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || '', // e.g. smtp.hostinger.com
      port: Number(process.env.SMTP_PORT) || 465, // usually 465 or 587
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '', // your email address
        pass: process.env.SMTP_PASSWORD || '', // your email password
      },
    });

    const fromEmail = process.env.SMTP_USER || 'hello@x010.tech';
    const toList = typeof to === 'string' ? [to] : to;

    // Send emails
    const info = await transporter.sendMail({
      from: `"FreeMail" <${fromEmail}>`,
      to: toList.join(', '), // Nodemailer takes comma-separated string or array
      subject: subject,
      html: html,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error sending email via Nodemailer:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email via SMTP' }, { status: 500 });
  }
}
