import ConnectEmailClient from "../../middlewares/connectEmailClient";

interface ContactData {
    name: string;
    email: string;
    mobile: string;
    message: string;
}

const SendContactNotificationEmail = async (data: ContactData) => {
    try {
        const client = await ConnectEmailClient();
        if (!client) {
            return { success: false, message: "Email client not initialized." };
        }

        await client.sendMail({
            from: `GT-Tech Contact <${process.env.EMAIL_PASS_1}>`,
            to: `info@thegttech.com`,
            subject: `New Contact Form Submission from ${data.name}`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>New Contact Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="100%" style="max-width:600px;background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);border-radius:10px;overflow:hidden;border:1px solid rgba(56, 189, 248, 0.2);">
        <tr>
          <td style="background:rgba(14, 165, 233, 0.1);padding:20px;text-align:center;border-bottom:1px solid rgba(56, 189, 248, 0.2);">
            <h1 style="color:#38bdf8;margin:0;font-size:24px;">New Contact Form Submission</h1>
            <div style="width:50px;height:3px;background:linear-gradient(90deg, #38bdf8, #06b6d4);margin:10px auto;border-radius:2px;"></div>
          </td>
        </tr>

        <tr>
          <td style="padding:30px;color:#f1f5f9;">
            <div style="background:rgba(255, 255, 255, 0.05);padding:20px;border-radius:8px;border:1px solid rgba(56, 189, 248, 0.2);margin-bottom:20px;">
              <h3 style="color:#38bdf8;margin:0 0 15px 0;">Contact Information</h3>
              <table style="width:100%;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(56, 189, 248, 0.1);"><strong>Name:</strong></td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(56, 189, 248, 0.1);">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(56, 189, 248, 0.1);"><strong>Email:</strong></td>
                  <td style="padding:8px 0;border-bottom:1px solid rgba(56, 189, 248, 0.1);"><a href="mailto:${data.email}" style="color:#38bdf8;text-decoration:none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;"><strong>Mobile:</strong></td>
                  <td style="padding:8px 0;"><a href="tel:${data.mobile}" style="color:#38bdf8;text-decoration:none;">${data.mobile}</a></td>
                </tr>
              </table>
            </div>
            
            <div style="background:rgba(0, 0, 0, 0.2);padding:20px;border-radius:8px;border-left:3px solid #38bdf8;">
              <h3 style="color:#38bdf8;margin:0 0 10px 0;">Message</h3>
              <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:rgba(255, 255, 255, 0.02);padding:15px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid rgba(56, 189, 248, 0.2);">
            Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            <br>© ${new Date().getFullYear()} GT Technologies. All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
            `,
        });

        return { success: true, message: "Contact notification email sent successfully." };
    } catch (err) {
        return { success: false, message: "Error sending contact notification email." };
    }
};

const SendContactConfirmationEmail = async (data: ContactData) => {
    try {
        const client = await ConnectEmailClient();
        if (!client) {
            return { success: false, message: "Email client not initialized." };
        }

        await client.sendMail({
            from: `GT-Tech Team <${process.env.EMAIL_PASS_1}>`,
            to: data.email,
            subject: `Thank you for contacting GT Technologies - We'll be in touch soon!`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Thank You for Contacting Us</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="100%" style="max-width:600px;background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);border-radius:10px;overflow:hidden;border:1px solid rgba(56, 189, 248, 0.2);">
        <tr>
          <td style="background:rgba(14, 165, 233, 0.1);padding:30px;text-align:center;border-bottom:1px solid rgba(56, 189, 248, 0.2);">
            <img src="https://res.cloudinary.com/df5zkeut4/image/upload/v1755086230/logo_zgeqvc.png" alt="GT Technologies Logo" style="max-width:120px;height:auto;margin-bottom:15px;">
            <h1 style="color:#38bdf8;margin:0;font-size:28px;">Thank You!</h1>
            <div style="width:50px;height:3px;background:linear-gradient(90deg, #38bdf8, #06b6d4);margin:15px auto;border-radius:2px;"></div>
          </td>
        </tr>

        <tr>
          <td style="padding:30px;color:#f1f5f9;">
            <h2 style="color:#38bdf8;margin:0 0 20px 0;font-size:22px;">Dear ${data.name},</h2>
            
            <p style="line-height:1.6;margin:0 0 20px 0;font-size:16px;">
              Thank you for reaching out to GT Technologies! We've received your message and our team is already reviewing your inquiry.
            </p>
            
            <div style="background:rgba(56, 189, 248, 0.1);padding:20px;border-radius:8px;border-left:3px solid #38bdf8;margin:25px 0;">
              <h3 style="color:#38bdf8;margin:0 0 15px 0;font-size:18px;">What happens next?</h3>
              <ul style="margin:0;padding-left:20px;line-height:1.8;">
                <li>Our expert team will review your inquiry within 24 hours</li>
                <li>You'll receive a personalized response with detailed insights</li>
                <li>We'll schedule a consultation call if needed</li>
                <li>Our solutions architect will discuss your specific requirements</li>
              </ul>
            </div>
            
            <div style="background:rgba(255, 255, 255, 0.05);padding:20px;border-radius:8px;border:1px solid rgba(56, 189, 248, 0.2);margin:25px 0;">
              <h3 style="color:#38bdf8;margin:0 0 15px 0;">Need immediate assistance?</h3>
              <p style="margin:0;line-height:1.6;">
                For urgent matters, feel free to contact us directly:
              </p>
              <p style="margin:10px 0 0 0;">
                📧 <a href="mailto:info@thegttech.com" style="color:#38bdf8;text-decoration:none;">info@thegttech.com</a><br>
                📞 <a href="tel:+919840015963" style="color:#38bdf8;text-decoration:none;">+91 9840015963</a>
              </p>
            </div>
            
            <p style="line-height:1.6;margin:20px 0 0 0;">
              We're excited to explore how GT Technologies can help transform your business with our cutting-edge solutions.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:rgba(255, 255, 255, 0.02);padding:20px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid rgba(56, 189, 248, 0.2);">
            <p style="margin:0 0 10px 0;">
              <strong style="color:#38bdf8;">GT Technologies Team</strong><br>
              Transforming businesses through innovative technology solutions
            </p>
            <p style="margin:0;">
              © ${new Date().getFullYear()} GT Technologies. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
            `,
        });

        return { success: true, message: "Contact confirmation email sent successfully." };
    } catch (err) {
        return { success: false, message: "Error sending contact confirmation email." };
    }
};

export { SendContactNotificationEmail, SendContactConfirmationEmail };