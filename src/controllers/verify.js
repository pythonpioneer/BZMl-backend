// importing all requirements


// to verify email address
const verifyEmail = async (req, res) => {
    try {

    } catch (err) {  // any unrecogonize error will be raised from here
        return res.status(500).json({ 
            errors: "Internal server error",
            issue: err
        });
    }
    res.send("ok");
};

// export all functions
module.exports = { verifyEmail };