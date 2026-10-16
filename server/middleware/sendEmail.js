import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const verifyEmailConnection = async () => {
  await transporter.verify();
  console.log("Gmail SMTP authentication successful");
};

const sendEmail = async (to, subject, html) => {
  try {
    const result = await transporter.sendMail({
      from: `"SmartSpider System" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;
