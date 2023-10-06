// importing requirements
const nodemailer = require('nodemailer');
require('dotenv').config();  // to access environment variables

// creating beautiful templates for email verification (to send OTP)
exports.otpEmailTemplate = (name, otp) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BZML Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verification</h1>
        <p>Hello, ${name}!</p>
        <p>This is a sample email template with a beautiful design.</p>
        <p>Here is Your OTP, </p>
        <a href="#" class="button">${otp}</a>
        <p>Thank you for reading!</p>
    </div>
</body>
</html>
`

// to send the mail to the user
exports.sendMail = (options) => {
    return new Promise((resolve, reject) => {
        // create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // create mail options to send the content
        let mailOptions = {
            from: process.env.MAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        // send the mail to the recipient
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err); // Log the error
                reject(400);        // Reject the promise with the error
            } else {
                resolve(200); // Resolve the promise with a success message
            }
        });
    });
};
