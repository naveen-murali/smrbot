const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    }
);

module.exports = {
    SEND_EMAIL : async (emailContent) => {
        emailContent.from = process.env.GMAIL;
        let eRes = [];
        try {
            eRes = await transporter.sendMail(emailContent);
        } catch (err) {
            console.error(err);
            eRes = false;
        }
        return eRes
    }
}