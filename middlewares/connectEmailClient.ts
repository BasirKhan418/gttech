import nodemailer from 'nodemailer';
const ConnectEmailClient = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST||"",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL || "", // your email address
        pass: process.env.EMAIL_PASS || "",
      },
    });
    return transporter;
  } catch (error) {
    console.error("Error connecting to email client:", error);
  }
};

export default ConnectEmailClient;
