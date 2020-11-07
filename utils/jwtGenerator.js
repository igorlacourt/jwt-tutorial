const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }

    // it's important tp make the process.env.jwtSecret as a string: 
    // "" + process.env.jwtSecret or `${process.env.jwtSecret}` 
    return jwt.sign(payload, "" + `${process.env.jwtSecret}`, {expiresIn: "1hr"})
}

module.exports = jwtGenerator;