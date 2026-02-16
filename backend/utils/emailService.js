// import nodemailer from "nodemailer";

// let transporter = null;

// const getTransporter = () => {
//   if (transporter) return transporter;

//   if (
//     !process.env.MAILTRAP_HOST ||
//     !process.env.MAILTRAP_PORT ||
//     !process.env.MAILTRAP_USER ||
//     !process.env.MAILTRAP_PASS
//   ) {
//     throw new Error("Mailtrap environment variables missing");
//   }

//   transporter = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: Number(process.env.MAILTRAP_PORT),
//     secure: false, // STARTTLS
//     auth: {
//       user: process.env.MAILTRAP_USER,
//       pass: process.env.MAILTRAP_PASS,
//     },
//   });

//   return transporter;
// };

// export const sendVerificationEmail = async (email, token, name) => {
//   try {
//     const transporter = getTransporter();

//     const verificationUrl =
//       `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

//     await transporter.sendMail({
//       from: '"Roommate Finder" <no-reply@neeyds.com>',
//       to: email,
//       subject: "Verify your email",
//       html: `
//         <h2>Hello ${name}</h2>
//         <p>Please verify your email:</p>
//         <a href="${verificationUrl}">Verify Email</a>
//         <p>This link expires in 24 hours.</p>
//       `,
//     });

//     console.log("✅ Verification email sent (Mailtrap)");
//     return { success: true };

//   } catch (err) {
//     console.error("❌ Email send failed:", err.message);
//     return { success: false, error: err.message };
//   }
// };

import { Resend } from "resend";

export const sendVerificationEmail = async (email, token, name) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing at runtime");
    return { success: false };
  }

  // ✅ Create Resend ONLY when function is called
  const resend = new Resend(apiKey);

  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: `Neeyds <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Hello ${name}</h2>
        <p>Please verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    console.log("✅ Verification email sent via Resend");
    return { success: true };
  } catch (err) {
    console.error("❌ Resend error:", err.message);
    return { success: false, error: err.message };
  }
};
