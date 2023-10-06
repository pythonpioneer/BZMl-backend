// importing requirements
const nodemailer = require('nodemailer');
require('dotenv').config();  // to access environment variables


// create a method to send email
exports.sendMail = (options) => {

    // create a transporter
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    // now, create a mail options to send the content
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    // now send the mail to the customer
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);  // if any error occured
            return 400;
        }
        else return 200;  // if everything will be good
    });
};
