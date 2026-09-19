import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html, customSmtp, fromName } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const toList = typeof to === 'string' ? [to] : to;
    if (!Array.isArray(toList) || toList.length === 0) {
       return NextResponse.json({ error: 'Invalid recipient list' }, { status: 400 });
    }

    let transporters = [];

    // If client provides their own SMTP (BYOE model), use only that
    if (customSmtp && customSmtp.user && customSmtp.pass) {
      const host = customSmtp.host || 'smtp.gmail.com';
      const port = Number(customSmtp.port) || 465;
      const secure = port === 465;

      transporters.push({
        email: customSmtp.user,
        transporter: nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: customSmtp.user,
            pass: customSmtp.pass,
          },
        })
      });
    } else {
      // Fallback to server-side Multi-SMTP Rotation (FreeMail Shared Pool)
      let accounts: { user: string, pass: string }[] = [];
      if (process.env.SMTP_ACCOUNTS) {
        try { accounts = JSON.parse(process.env.SMTP_ACCOUNTS); } catch (e) {}
      }
      if (accounts.length === 0 && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        accounts.push({ user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD });
      }

      if (accounts.length === 0) {
        return NextResponse.json({ error: 'No SMTP accounts configured on the server.' }, { status: 500 });
      }

      const host = process.env.SMTP_HOST || 'smtp.gmail.com';
      const port = Number(process.env.SMTP_PORT) || 465;
      const secure = port === 465;

      transporters = accounts.map(account => ({
        email: account.user,
        transporter: nodemailer.createTransport({ host, port, secure, auth: { user: account.user, pass: account.pass } })
      }));
    }

    let successCount = 0;
    let failCount = 0;
    let lastError = null;

    // Send emails individually
    const promises = toList.map(async (recipientEmail, index) => {
      const sender = transporters[index % transporters.length];
      
      try {
        await sender.transporter.sendMail({
          from: `"${fromName || 'FreeMail'}" <${sender.email}>`,
          to: recipientEmail,
          subject: subject,
          html: html,
        });
        successCount++;
      } catch (err: any) {
        console.error(`Failed to send to ${recipientEmail} via ${sender.email}:`, err);
        failCount++;
        lastError = err;
      }
    });

    await Promise.allSettled(promises);

    if (successCount === 0 && failCount > 0) {
      return NextResponse.json({ error: lastError?.message || 'All emails failed to send' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent ${successCount} emails. Failed: ${failCount}.`,
      successCount,
      failCount
    });

  } catch (error: any) {
    console.error('Error in send route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process email sending request' }, { status: 500 });
  }
}
