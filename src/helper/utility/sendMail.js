// importing requirements
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7f0f23d6cdc9d2",
      pass: "e2c26c364d5f5d"
    }
  });

let mailOptions = {
    from: 'kumarhritiksinha@gmail.com',
    to: 'hritik.span@gmail.com',
    subject: 'email setup',
    text: 'Hi, this is the first email and goal is to verify email.'
};


transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log(err);
    }
    else console.log("mail sent!!" + info);
});