// to genearate a six digit otp
exports.generateOtp = () => {
    let otp = Math.floor(Math.random()*1000000).toString();

    // send otp if the length of the otp is 6
    if (otp.length === 6) return otp;

    else {  // if otp is not 6 char long then add 0 to all the missing places
        let n = 6 - otp.length;
        otp = otp * Math.pow(10, n);

        return otp;
    }
}