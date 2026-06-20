import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: "chauhanaditya942@gmail.com",
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:16px;color:#111;">New Portfolio Message 🚀</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 12px;background:#fff;border-radius:8px 8px 0 0;border:1px solid #eee;">
                <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Name</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#111;">${name}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#fff;border-top:none;border:1px solid #eee;">
                <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Email</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#111;">${email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#fff;border-top:none;border-radius:0 0 8px 8px;border:1px solid #eee;">
                <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999;">Message</p>
                <p style="margin:4px 0 0;font-size:15px;color:#333;line-height:1.7;">${message}</p>
              </td>
            </tr>
          </table>
          <p style="margin-top:16px;font-size:12px;color:#aaa;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}