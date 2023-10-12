/**
 * The file contain all the templates for the email including
 * Email verification using otp,
 * password updation notification to admin
 */

// creating beautiful templates for email verification (to send OTP)
exports.otpEmailTemplate = (name, otp, title) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BZML Verification</title>
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
        <h1>${title}</h1>
        <p>Hello, ${name}!</p>
        <p>This is a sample email template with a beautiful design.</p>
        <p>Here is Your OTP, </p>
        <p href="#" class="button">${otp}</p>
        <p>Thank you for reading!</p>
    </div>
</body>
</html>
`

// password updation email template
exports.notifyPasswordUpdation = (name) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .message-box {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            padding: 20px;
        }
        h1 {
            color: #007BFF;
        }
        p {
            margin: 0;
            font-size: 18px;
        }
        .success-icon {
            color: #28A745;
            font-size: 60px;
            margin-bottom: 20px;
        }
        .button {
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="message-box">
        <i class="fas fa-check-circle success-icon"></i>
        <h1>Password Changed Successfully</h1>

        <h3>Hello, ${name}</h3>
        <p>Your password has been updated.</p>
        <p class="button">Thank You!</p>
    </div>
</body>
</html>
`