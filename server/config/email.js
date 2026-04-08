const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Trying to send email to:", to);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  await transporter.sendMail({
    from: `"Cricket Academy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
        <div style="background: #16a34a; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏏 Cricket Academy</h1>
        </div>
        <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; color: #374151; line-height: 1.7;">${text}</pre>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          Cricket Academy • Professional Cricket Training
        </p>
      </div>
    `,
  });

  console.log("Mail sent successfully");
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