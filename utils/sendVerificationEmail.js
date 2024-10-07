const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Thank you for creating an account with us. To confirm your email address, please click on the following link: 
  <a href="${verifyEmail}">Verify Email</a> <p>If you have any issues or concerns, please don't hesitate to contact us.<p>Best regards,
</p>`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
