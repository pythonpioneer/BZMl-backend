// to genearate a six digit otp
exports.generateOtp = () => {
    return Math.floor(Math.random()*1000000);
}