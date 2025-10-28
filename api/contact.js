// api/contact.js

// resend api key - re_girz7WqX_5ppNL4PBjgFj2mYAv14Yes4b
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ ok:false, error:'Missing fields' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'portfolio@example.com',
      to: process.env.EMAIL_TO || 'padiya@usc.edu',
      subject: `New message from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, error:'Email failed' });
  }
}
