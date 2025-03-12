import nodemailer from "nodemailer";
import { EventEmitter } from "events";

export const sendEmailEvent = new EventEmitter();
sendEmailEvent.on(
  "sendOtpEmail",
  async (email, otp_type, code) => {
    await sendEmail({
      to: email,
      subject: `${otp_type} OTP`,
      html: `<p>your OTP is ${otp_type}: ${code} your OTP is valid for 10 minutes</p>`,
    });
  }
);

sendEmailEvent.on(
  "sendApplicationEmail",
  async (email, jobTitle, status) => {
    const subject =
      status === "accepted"
        ? `Congratulations! Your application for ${jobTitle} has been accepted`
        : `Update: Your application for ${jobTitle} has been rejected`;

    const html =
      status === "accepted"
        ? `<p>🎉 Congratulations! Your application for <strong>${jobTitle}</strong> has been accepted. The hiring team will reach out to you soon.</p>`
        : `<p>We regret to inform you that your application for <strong>${jobTitle}</strong> has been rejected. We appreciate your effort and encourage you to apply for other roles.</p>`;

    await sendEmail({ to: email, subject, html });
  }
);

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `Job Search App ${process.env.EMAIL}`,
    to,
    subject,
    html,
  });
  if (info.rejected.length > 0) return false;
  return true;
};
