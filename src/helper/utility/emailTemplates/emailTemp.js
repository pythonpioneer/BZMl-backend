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
exports.notifyPasswordUpdation = (adminName) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Notification</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #007BFF;
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
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            padding: 20px;
            animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
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
            animation: bounce 1s;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }
        .button {
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="message-box">
        <i class="fas fa-check-circle success-icon"></i>
        <h1>Password Changed Successfully</h1>
        <p>Hello, ${adminName}!</p>
        <p>This is a sample email template with a beautiful design.</p>
        <p>Your password has been updated.</p>
    </div>
</body>
</html>
`