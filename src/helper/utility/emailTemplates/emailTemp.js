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
