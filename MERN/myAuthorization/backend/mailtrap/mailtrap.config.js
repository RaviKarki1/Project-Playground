// Looking to send emails in production? Check out our Email API/SMTP product!
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN;

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
    testInboxId: 3854119,
  })
);

const sender = {
  address: "hello@example.com",
  name: "Mailtrap Test",
};
const recipients = [
  "karkiravi1.rk@gmail.com",
];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
    sandbox: true
  })
  .then(console.log, console.error);