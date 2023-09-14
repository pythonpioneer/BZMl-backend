const { validationResult } = require('express-validator');
const { descriptions } = require('../../helper/form/fieldDesc');


// This middleware funciton is used to validate the validation array
exports.validateValidationResult = (req, res, next) => {
    
    // validating errors for authentication (creating user)
    const result = validationResult(req);

    let obj = {
        status: 400,
        message: result["errors"][0]?.msg,
        where: result["errors"][0]?.path,
        desc: descriptions[result["errors"][0]?.path]
    };

    // user will not create
    if (!result.isEmpty()) return res.status(400).json(obj);

    next();  // to pass controls to the next function
};
