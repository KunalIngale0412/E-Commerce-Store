import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const options = {
    from: `"Kunal Ingale" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject: subject,
    html: body,
  };

  // try {
  //   await transporter.sendMail(options);
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, message: error.message };
  // }
  try {
    await transporter.sendMail(options)
    return { success: true };
  } catch (error) {
    // 🚨 THIS IS THE CRITICAL CHANGE 🚨
    console.error("Nodemailer Error:", error.message);
    return { success: false, message: error.message };
  }
};
