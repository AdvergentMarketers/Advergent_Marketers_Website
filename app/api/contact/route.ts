import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your hidden environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the data sent from your frontend form
    const { name, email, website, budget, bottleneck } = await request.json();

    // Fire the email
    const data = await resend.emails.send({
      from: "Advergent Leads <onboarding@resend.dev>", // Note: Use this testing address until your domain is verified on Resend
      to: "advergentmarketers887@gmail.com",
      subject: `New Ecosystem Audit Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #1C1C1C; max-width: 600px; padding: 20px;">
          <h2 style="color: #0055FF; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">New Lead Acquired</h2>
          <h1 style="font-size: 24px; margin-bottom: 24px;">Discovery Session Request</h1>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><strong>Website:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="${website}">${website}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${budget}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; background: #F7F7F8; padding: 20px; border-radius: 8px;">
            <strong style="display: block; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Growth Bottleneck:</strong>
            <p style="margin: 0; line-height: 1.6;">${bottleneck}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}