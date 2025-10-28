// api/contact.js (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ ok:false, error:'Missing fields' });

    // Option 1: send via Resend (recommended)
    // 1) npm i resend
    // 2) Add RESEND_API_KEY in Vercel → Project → Settings → Environment Variables
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'portfolio@your-domain.com',
    //   to: 'padiya@usc.edu',
    //   subject: `New message from ${name}`,
    //   text: `${message}\n\nFrom: ${name} <${email}>`
    // });

    // For now just log (works without Resend)
    console.log('Contact form:', { name, email, message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, error:'Server error' });
  }
}
