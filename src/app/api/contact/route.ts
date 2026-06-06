import { NextRequest, NextResponse } from 'next/server';
import { SendContactNotificationEmail, SendContactConfirmationEmail } from '../../../../email/contact/SendContactEmail';
import ConnectEmailClient from '../../../../middlewares/connectEmailClient';
import type { EnquiryFormData } from '../../../../types/enquiry';

export type { EnquiryFormData };

// Simple contact form (from /contact page)
interface SimpleContactData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

const validateEnquiryData = (data: EnquiryFormData): { valid: boolean; error?: string } => {
  if (!data.fullName?.trim() || data.fullName.length < 2)
    return { valid: false, error: 'Full name must be at least 2 characters long' };

  if (!data.organizationName?.trim())
    return { valid: false, error: 'Organisation name is required' };

  if (!data.designation?.trim())
    return { valid: false, error: 'Designation is required' };

  if (!data.industrySector?.trim())
    return { valid: false, error: 'Industry sector is required' };

  if (!Array.isArray(data.interestedIn) || data.interestedIn.length === 0)
    return { valid: false, error: 'Please select at least one area of interest' };

  if (!data.briefRequirement?.trim() || data.briefRequirement.length < 10)
    return { valid: false, error: 'Brief requirement must be at least 10 characters long' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email))
    return { valid: false, error: 'Invalid email address format' };

  const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
  if (!phoneRegex.test(data.mobile.replace(/\s/g, '')))
    return { valid: false, error: 'Invalid mobile number format' };

  if (!data.city?.trim())
    return { valid: false, error: 'City is required' };

  if (!data.state?.trim())
    return { valid: false, error: 'State is required' };

  return { valid: true };
};

const handleSimpleContact = async (data: SimpleContactData) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.name?.trim() || data.name.length < 2)
    return NextResponse.json({ success: false, message: 'Please enter a valid name' }, { status: 400 });
  if (!emailRegex.test(data.email))
    return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
  if (!data.mobile?.trim())
    return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
  if (!data.message?.trim() || data.message.length < 10)
    return NextResponse.json({ success: false, message: 'Message must be at least 10 characters' }, { status: 400 });

  try {
    const client = await ConnectEmailClient();
    if (!client) throw new Error('Email client unavailable');

    await Promise.allSettled([
      client.sendMail({
        from: `GT-Tech Contact <${process.env.EMAIL_PASS_1}>`,
        to: 'info@thegttech.com',
        subject: `New Contact Message from ${data.name}`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:20px 0;">
  <tr><td align="center">
    <table width="100%" style="max-width:580px;background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:10px;border:1px solid rgba(56,189,248,0.2);">
      <tr><td style="background:rgba(14,165,233,0.1);padding:20px 24px;border-bottom:1px solid rgba(56,189,248,0.2);">
        <h1 style="color:#38bdf8;margin:0;font-size:20px;">New Contact Message</h1>
        <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </td></tr>
      <tr><td style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#94a3b8;font-size:13px;width:35%"><strong>Name</strong></td><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#f1f5f9;font-size:13px;">${data.name}</td></tr>
          <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#94a3b8;font-size:13px;"><strong>Email</strong></td><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#f1f5f9;font-size:13px;"><a href="mailto:${data.email}" style="color:#38bdf8;">${data.email}</a></td></tr>
          <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#94a3b8;font-size:13px;"><strong>Mobile</strong></td><td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#f1f5f9;font-size:13px;">${data.mobile}</td></tr>
          <tr><td style="padding:8px 12px;color:#94a3b8;font-size:13px;vertical-align:top;"><strong>Message</strong></td><td style="padding:8px 12px;color:#f1f5f9;font-size:13px;white-space:pre-wrap;">${data.message}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:14px 24px;text-align:center;color:#475569;font-size:11px;border-top:1px solid rgba(56,189,248,0.2);">© ${new Date().getFullYear()} GT Technologies</td></tr>
    </table>
  </td></tr>
</table></body></html>`,
      }),
      client.sendMail({
        from: `GT-Tech Team <${process.env.EMAIL_PASS_1}>`,
        to: data.email,
        subject: `Thanks for reaching out — GT Technologies`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:20px 0;">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:10px;border:1px solid rgba(56,189,248,0.2);">
      <tr><td style="background:rgba(14,165,233,0.1);padding:28px;text-align:center;border-bottom:1px solid rgba(56,189,248,0.2);">
        <h1 style="color:#38bdf8;margin:0;font-size:24px;">Message Received!</h1>
      </td></tr>
      <tr><td style="padding:28px;color:#f1f5f9;">
        <h2 style="color:#38bdf8;margin:0 0 14px;font-size:18px;">Dear ${data.name},</h2>
        <p style="line-height:1.7;margin:0 0 18px;font-size:14px;">Thank you for getting in touch with GT Technologies. We have received your message and will respond within 24 hours.</p>
        <p style="line-height:1.7;margin:0;font-size:13px;">For urgent matters: <a href="mailto:info@thegttech.com" style="color:#38bdf8;">info@thegttech.com</a> | <a href="tel:+919840015963" style="color:#38bdf8;">+91 9840015963</a></p>
      </td></tr>
      <tr><td style="padding:14px 24px;text-align:center;color:#475569;font-size:11px;border-top:1px solid rgba(56,189,248,0.2);">© ${new Date().getFullYear()} GT Technologies</td></tr>
    </table>
  </td></tr>
</table></body></html>`,
      }),
    ]);

    return NextResponse.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to send message. Please try again.' }, { status: 500 });
  }
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Detect which form was submitted based on fields present
    if ('name' in data && 'message' in data) {
      return handleSimpleContact(data as SimpleContactData);
    }

    // Enquiry form
    const enquiryData = data as EnquiryFormData;
    const validation = validateEnquiryData(enquiryData);
    if (!validation.valid) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 });
    }

    const [notificationResult, confirmationResult] = await Promise.allSettled([
      SendContactNotificationEmail(enquiryData),
      SendContactConfirmationEmail(enquiryData),
    ]);

    const notificationSuccess = notificationResult.status === 'fulfilled' && notificationResult.value.success;
    const confirmationSuccess = confirmationResult.status === 'fulfilled' && confirmationResult.value.success;

    if (notificationSuccess && confirmationSuccess) {
      return NextResponse.json({
        success: true,
        message: "Your enquiry has been submitted successfully! We'll get back to you within 24 hours.",
      });
    } else if (notificationSuccess || confirmationSuccess) {
      return NextResponse.json({
        success: true,
        message: "Your enquiry has been received. We'll get back to you soon!",
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to submit enquiry. Please try again or contact us directly.' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
