const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    console.log("SMTP connection successful ✅");

    const info = await transporter.sendMail({
      from: `"Cricket Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <h2>🏏 Cricket Academy Booking Confirmed</h2>
        <p>${text.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Email sent successfully ✅", info.messageId);
  } catch (error) {
    console.log("EMAIL ERROR FULL ❌", error);
    throw error;
  }
};

module.exports = sendEmail;
// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, text) => {
//   // const transporter = nodemailer.createTransport({
//   //   service: "gmail",
//   //   auth: {
//   //     user: process.env.EMAIL_USER,
//   //     pass: process.env.EMAIL_PASS,
//   //   },
//   // });
//   const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 10000,
// });

//   await transporter.sendMail({
//     from: `"Cricket Academy" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
//         <div style="background: #16a34a; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
//           <h1 style="color: white; margin: 0; font-size: 24px;">🏏 Cricket Academy</h1>
//         </div>
//         <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
//           <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; color: #374151; line-height: 1.7;">${text}</pre>
//         </div>
//         <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
//           Cricket Academy • Professional Cricket Training
//         </p>
//       </div>
//     `,
//   });
// };

// module.exports = sendEmail;