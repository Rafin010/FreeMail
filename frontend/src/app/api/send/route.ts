import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const toList = typeof to === 'string' ? [to] : to;
    if (!Array.isArray(toList) || toList.length === 0) {
       return NextResponse.json({ error: 'Invalid recipient list' }, { status: 400 });
    }

    // Support for Multi-SMTP Rotation
    // Try to parse SMTP_ACCOUNTS JSON array, otherwise fallback to single SMTP_USER / SMTP_PASSWORD
    let accounts: { user: string, pass: string }[] = [];
    
    if (process.env.SMTP_ACCOUNTS) {
      try {
        accounts = JSON.parse(process.env.SMTP_ACCOUNTS);
      } catch (e) {
        console.error('Failed to parse SMTP_ACCOUNTS environment variable. Ensure it is valid JSON.');
      }
    }

    // Fallback to single account if no JSON array provided
    if (accounts.length === 0 && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      accounts.push({
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      });
    }

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'No SMTP accounts configured on the server.' }, { status: 500 });
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = port === 465;

    // Create a transporter for each account
    const transporters = accounts.map(account => {
      return {
        email: account.user,
        transporter: nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })
      };
    });

    let successCount = 0;
    let failCount = 0;
    let lastError = null;

    // Send emails individually to protect privacy (BCC effect) and distribute load
    // Using simple Round-Robin across available SMTP accounts
    const promises = toList.map(async (recipientEmail, index) => {
      const sender = transporters[index % transporters.length]; // Round-Robin selection
      
      try {
        await sender.transporter.sendMail({
          from: `"FreeMail" <${sender.email}>`,
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

    // Wait for all emails to be processed
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
