/**
* Find the given input is email or not
* @param {String} userField - It takes input as string
* @returns {Boolean} - returns true, if userField belongs to mobile number or ID
*/
exports.isNumber = (userField) => {
    if(/^[0-9]*$/.test(userField)) return true;
    return false;
};
