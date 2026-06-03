const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email transporter is ready to send emails.');
  }
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };