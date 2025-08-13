import ConnectEmailClient from "../../middlewares/connectEmailClient"

const SendSignupEmail = async (email: string, name: string, username: string, password: string) => {
    try {
        const client = await ConnectEmailClient();
        if (!client) {
            return { success: false, message: "Email client not initialized." };
        }

        const info = await client.sendMail({
            from: `GTTech Admin <${process.env.EMAIL_PASS_1}>`,
            to: `${email}`,
            subject: `Welcome to GT-Tech Admin Panel - Access Granted`,
            text: `Hello ${name},\n\nYou have been successfully granted access to the GTTech Admin Panel.\n\nUsername: ${username}\nPassword: ${password}\n\nLogin and start managing now!`,
            html: `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>GTTech Admin Access</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f8fa;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f8fa;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background-color:#1f2937;padding:20px;text-align:center;">
            <img src="https://res.cloudinary.com/df5zkeut4/image/upload/v1755084161/logo1_tag0c3.png" alt="GTTech Logo" style="max-width:120px;height:auto;">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px;">
            <h1 style="color:#1f2937;font-size:22px;margin:0;">Hello ${name},</h1>
            <p style="color:#4b5563;font-size:16px;line-height:1.5;margin-top:15px;">
              🎉 Congratulations! You have been successfully granted <strong>GT-Tech Admin Panel</strong> access.
            </p>
            <p style="color:#4b5563;font-size:16px;line-height:1.5;">
              Here are your login details:
            </p>

            <table style="width:100%;margin:20px 0;border-collapse:collapse;">
              <tr>
                <td style="background-color:#f3f4f6;padding:10px;border-radius:6px;color:#1f2937;font-size:15px;">
                  <strong>Username:</strong> ${username}
                </td>
              </tr>
              <tr>
                <td style="background-color:#f3f4f6;padding:10px;border-radius:6px;color:#1f2937;font-size:15px;margin-top:8px;">
                  <strong>Password:</strong> ${password}
                </td>
              </tr>
            </table>

            <p style="color:#4b5563;font-size:16px;line-height:1.5;">
              Please log in to your account and change your password for security purposes.
            </p>

            <div style="text-align:center;margin-top:25px;">
              <a href="${process.env.NEXT_PUBLIC_URL||""}/admin" 
                 style="background-color:#2563eb;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px;display:inline-block;">
                Go to Admin Panel
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f9fafb;padding:15px;text-align:center;color:#9ca3af;font-size:13px;">
            © ${new Date().getFullYear()} GTTech. All rights reserved.
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

        return { success: true, message: "Signup email sent successfully.", info };
    } catch (err) {
        return { success: false, message: "Error sending signup email. Please try again later." };
    }
};

export default SendSignupEmail;
