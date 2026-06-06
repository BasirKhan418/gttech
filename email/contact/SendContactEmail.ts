import ConnectEmailClient from "../../middlewares/connectEmailClient";
import type { EnquiryFormData } from "../../types/enquiry";

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#94a3b8;font-size:13px;white-space:nowrap;vertical-align:top;width:40%"><strong>${label}</strong></td>
    <td style="padding:8px 12px;border-bottom:1px solid rgba(56,189,248,0.1);color:#f1f5f9;font-size:13px;vertical-align:top">${value || '—'}</td>
  </tr>`;

const SendContactNotificationEmail = async (data: EnquiryFormData) => {
    try {
        const client = await ConnectEmailClient();
        if (!client) return { success: false, message: "Email client not initialized." };

        const interestedList = Array.isArray(data.interestedIn) && data.interestedIn.length
            ? data.interestedIn.map(i => `<li style="margin:2px 0">${i}</li>`).join('')
            : '<li>—</li>';

        await client.sendMail({
            from: `GT-Tech Enquiry <${process.env.EMAIL_PASS_1}>`,
            to: `info@thegttech.com`,
            subject: `New Enquiry from ${data.fullName} — ${data.organizationName}`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>New Enquiry</title></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:20px 0;">
  <tr><td align="center">
    <table width="100%" style="max-width:620px;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-radius:10px;overflow:hidden;border:1px solid rgba(56,189,248,0.2);">
      <tr>
        <td style="background:rgba(14,165,233,0.1);padding:20px 24px;border-bottom:1px solid rgba(56,189,248,0.2);">
          <h1 style="color:#38bdf8;margin:0;font-size:22px;">New Business Enquiry</h1>
          <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          <div style="width:50px;height:3px;background:linear-gradient(90deg,#38bdf8,#06b6d4);margin:12px 0 0;border-radius:2px;"></div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.15);border-radius:8px;margin-bottom:16px;overflow:hidden;">
            <div style="background:rgba(56,189,248,0.08);padding:10px 12px;"><h3 style="color:#38bdf8;margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">1. Personal &amp; Organisation</h3></div>
            <table style="width:100%;">
              ${row('Full Name', data.fullName)}
              ${row('Organisation', data.organizationName)}
              ${row('Designation', data.designation)}
              ${row('Industry Sector', data.industrySector)}
            </table>
          </div>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.15);border-radius:8px;margin-bottom:16px;overflow:hidden;">
            <div style="background:rgba(56,189,248,0.08);padding:10px 12px;"><h3 style="color:#38bdf8;margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">2. Areas of Interest</h3></div>
            <div style="padding:12px 16px;"><ul style="margin:0;padding-left:18px;color:#f1f5f9;font-size:13px;line-height:1.8;">${interestedList}</ul></div>
          </div>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.15);border-radius:8px;margin-bottom:16px;overflow:hidden;">
            <div style="background:rgba(56,189,248,0.08);padding:10px 12px;"><h3 style="color:#38bdf8;margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">3. Product &amp; Requirement</h3></div>
            <table style="width:100%;">
              ${row('Product / Solution', data.productSolution)}
              ${row('Business Requirement', data.businessRequirement)}
            </table>
            <div style="padding:10px 12px;border-top:1px solid rgba(56,189,248,0.1);">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 6px;"><strong>Brief Requirement:</strong></p>
              <p style="color:#f1f5f9;font-size:13px;margin:0;line-height:1.7;white-space:pre-wrap;">${data.briefRequirement}</p>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(56,189,248,0.15);border-radius:8px;overflow:hidden;">
            <div style="background:rgba(56,189,248,0.08);padding:10px 12px;"><h3 style="color:#38bdf8;margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">4. Contact Details</h3></div>
            <table style="width:100%;">
              ${row('Email', `<a href="mailto:${data.email}" style="color:#38bdf8;text-decoration:none;">${data.email}</a>`)}
              ${row('Mobile', `<a href="tel:${data.mobile}" style="color:#38bdf8;text-decoration:none;">${data.mobile}</a>`)}
              ${row('City', data.city)}
              ${row('State', data.state)}
            </table>
          </div>

        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.02);padding:14px 24px;text-align:center;color:#475569;font-size:11px;border-top:1px solid rgba(56,189,248,0.2);">
          © ${new Date().getFullYear()} GT Technologies. All rights reserved.
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
        });

        return { success: true, message: "Enquiry notification email sent successfully." };
    } catch {
        return { success: false, message: "Error sending enquiry notification email." };
    }
};

const SendContactConfirmationEmail = async (data: EnquiryFormData) => {
    try {
        const client = await ConnectEmailClient();
        if (!client) return { success: false, message: "Email client not initialized." };

        await client.sendMail({
            from: `GT-Tech Team <${process.env.EMAIL_PASS_1}>`,
            to: data.email,
            subject: `Thank you for your enquiry — GT Technologies`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Enquiry Received</title></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:20px 0;">
  <tr><td align="center">
    <table width="100%" style="max-width:600px;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-radius:10px;overflow:hidden;border:1px solid rgba(56,189,248,0.2);">
      <tr>
        <td style="background:rgba(14,165,233,0.1);padding:30px;text-align:center;border-bottom:1px solid rgba(56,189,248,0.2);">
          <img src="https://res.cloudinary.com/df5zkeut4/image/upload/v1755086230/logo_zgeqvc.png" alt="GT Technologies" style="max-width:120px;height:auto;margin-bottom:16px;">
          <h1 style="color:#38bdf8;margin:0;font-size:26px;">Enquiry Received!</h1>
          <div style="width:50px;height:3px;background:linear-gradient(90deg,#38bdf8,#06b6d4);margin:14px auto;border-radius:2px;"></div>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;color:#f1f5f9;">
          <h2 style="color:#38bdf8;margin:0 0 16px;font-size:20px;">Dear ${data.fullName},</h2>
          <p style="line-height:1.7;margin:0 0 20px;font-size:15px;">
            Thank you for reaching out to GT Technologies! We have received your business enquiry and our expert team will review your requirements shortly.
          </p>
          <div style="background:rgba(56,189,248,0.08);padding:18px;border-radius:8px;border-left:3px solid #38bdf8;margin:0 0 24px;">
            <h3 style="color:#38bdf8;margin:0 0 12px;font-size:16px;">Enquiry Summary</h3>
            <table style="width:100%;font-size:13px;">
              <tr><td style="padding:4px 0;color:#94a3b8;width:45%">Organisation:</td><td style="padding:4px 0;color:#f1f5f9;">${data.organizationName}</td></tr>
              <tr><td style="padding:4px 0;color:#94a3b8;">Industry:</td><td style="padding:4px 0;color:#f1f5f9;">${data.industrySector}</td></tr>
              <tr><td style="padding:4px 0;color:#94a3b8;">Requirement:</td><td style="padding:4px 0;color:#f1f5f9;">${data.businessRequirement || 'General Enquiry'}</td></tr>
            </table>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:18px;border-radius:8px;border:1px solid rgba(56,189,248,0.15);margin-bottom:24px;">
            <h3 style="color:#38bdf8;margin:0 0 12px;font-size:16px;">What happens next?</h3>
            <ul style="margin:0;padding-left:20px;line-height:2;font-size:14px;color:#e2e8f0;">
              <li>Our solutions team reviews your enquiry within 24 hours</li>
              <li>A dedicated expert will reach out with tailored recommendations</li>
              <li>We'll schedule a consultation call at your convenience</li>
            </ul>
          </div>
          <p style="line-height:1.7;margin:0;font-size:14px;">
            For urgent assistance, contact us directly:<br>
            📧 <a href="mailto:info@thegttech.com" style="color:#38bdf8;text-decoration:none;">info@thegttech.com</a>&nbsp;&nbsp;
            📞 <a href="tel:+919840015963" style="color:#38bdf8;text-decoration:none;">+91 9840015963</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.02);padding:18px 24px;text-align:center;color:#475569;font-size:12px;border-top:1px solid rgba(56,189,248,0.2);">
          <strong style="color:#38bdf8;">GT Technologies Team</strong><br>
          Transforming businesses through innovative technology solutions<br><br>
          © ${new Date().getFullYear()} GT Technologies. All rights reserved.
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
        });

        return { success: true, message: "Confirmation email sent successfully." };
    } catch {
        return { success: false, message: "Error sending confirmation email." };
    }
};

export { SendContactNotificationEmail, SendContactConfirmationEmail };
