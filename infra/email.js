import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production",
});

async function send(mailOptions) {
  await transport.sendMail(mailOptions);
}

const email = {
  send,
};

export default email;
