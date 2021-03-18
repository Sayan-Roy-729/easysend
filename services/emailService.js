const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = async ({ from, to, subject, text, html }) => {

  // create transporter
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key:
          process.env.SENDGRID_API_KEY,
      },
    })
  );

  // send mail
  transporter
    .sendMail({
      to: to,
      from: 'easysend <rsayan553@gmail.com>',
      subject: subject,
      text: text,
      html: html,
    })
    .then((response) => {
        console.log('Email sent successfully');
    })
    .catch((error) => {
      console.log('Sending mail failed ', error);
    });
};
