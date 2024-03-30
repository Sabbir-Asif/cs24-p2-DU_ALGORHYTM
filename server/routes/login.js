const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password)))
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to false if you're testing over HTTP
            maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiration time in milliseconds
        }).status(200).json({ success: true, message: "Logged in successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
