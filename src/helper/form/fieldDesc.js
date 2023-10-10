// a description for all the possible input fields
exports.descriptions = {
    pubgID: {
        "min-length": 9,
        "max-length": 12,
        "type": "numeric",  // input character type
        "unique": true,
    },
    pubgName: {
        "min-length": 1,
        "max-length": 30,
        "type": "any",
        "unique": true,
    },
    fullName: {
        "min-length": 3,
        "max-length": 25,
        "type": "any",
        "unique": false,
    }, 
    email: {
        "min-length": 3,
        "max-length": 25,
        "type": "email",
        "unique": true,
    },
    mobileNumber: {
        "min-length": 10,
        "max-length": 10,
        "type": "numeric",
        "unique": true,
    },
    password: {  // in future, we can use this, body('password').isStrongPassword({})
        "min-length": 6,
        "max-length": 18,
        "type": "any",
        "unique": false,
    },
    gender: {
        "min-length": 1,
        "max-length": 1,
        "type": "alpha",
        "unique": false,
    },
    refCode: {
        "min-length": 0,
        "max-length": 20,
        "type": "any",
        "unique": false,
    },
};
