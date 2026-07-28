const transporter = require('../config/email.js');
const path = require('path');
const ejs = require('ejs');

const sendMail = async ({ to, subject, TEMPLATE, data }) => {
    const templatePath = path.join(__dirname, '../views/emails', `${TEMPLATE}.ejs`);
    const html = await ejs.renderFile(templatePath, data);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html
    }
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => error ? reject(error) : resolve(info));
    });
}
module.exports = sendMail;
