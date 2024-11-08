import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import nodemailer from 'nodemailer';
import config from '../configs/config.js';
import logger from '../configs/loggers.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const templateSource = fs.readFileSync(path.join(__dirname, '../static/sendResetPasswordEmailTemplate.hbs'), 'utf-8');
const template = handlebars.compile(templateSource);


async function sendResetPasswordEmailV2(email, OTP) {
    logger.info(`Sending Reset password otp email to ${email}`);
    logger.info(`SMTP User: ${config.smtpUser}`);
    const emailHtml = template({OTP});

    logger.info(`Sending password email to ${email}`);
    logger.info(`SMTP User: ${config.smtpUser}`);

    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass
        }
    });

    let mailOptions = {
        from: `"Vision Fund India" ${config.smtpUser}`,
        to: email,
        subject: 'Welcome to Vision Fund - Reset Password OTP',
        text: `Welcome to Vision Fund!\n\nYour email ID: ${email}\nYour new password is: ${OTP}`,
        html: emailHtml,
        attachments: [
            {
              filename: 'email-banner.png',
              path: path.join(__dirname, '../static/email-banner.png'),
              cid: 'email-banner' // Use content ID to embed images in HTML
            },
            {
              filename: 'email-logo.png',
              path: path.join(__dirname, '../static/email-logo.png'),
              cid: 'email-logo'
            },
            {
                filename: 'apple.png',
                path: path.join(__dirname, '../static/apple.png'),
                cid: 'apple'
            },
            {
                filename: 'google.png',
                path: path.join(__dirname, '../static/google.png'),
                cid: 'google'
            },
          ]
    };


    let info = await transporter.sendMail(mailOptions);

    logger.info(`Message sent: ${info.messageId}`);

}

export default sendResetPasswordEmailV2;