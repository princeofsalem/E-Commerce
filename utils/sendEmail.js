const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport(nodemailerConfig);
    console.log('Transporter created:', transporter);
    const info = await transporter.sendMail({
      from: '"Coding Addict" <codingaddict@gmail.com>', // sender address
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Error stack:', error.stack);
  }
};

module.exports = sendEmail;
