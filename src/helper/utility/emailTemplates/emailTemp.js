/**
 * The file contain all the templates for the email including
 * Email verification using otp,
 * password updation notification to admin
 */

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
            background-color: #f3f3f3;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #007BFF;
            color: #fff;
            text-align: center;
            padding: 20px;
        }
        .message {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007BFF;
        }
        p {
            font-size: 18px;
        }
        .success-icon {
            color: #28A745;
            font-size: 60px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Changed, Successfully</h1>
        </div>
        <div class="message">
            <i class="fas fa-check-circle success-icon"></i>
            <h3>Hi, ${name}</h3>
            <p>Your password has been successfully updated. You can now securely log in with your new password.</p>
            <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            <p>Thank you for choosing our services.</p>
        </div>
    </div>
</body>
</html>
`