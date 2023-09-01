const express = require("express")
const router = express.Router()
const Barber = require("../models/Barber")
const BarberCounter = require("../models/BarberCounter")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser.js")
const JWT_SECRET = "Amanisagoodbo$y"

// ROUTE 1: Create a Barber using:POST "/api/barberauth/createbarber". No login required
router.post("/createbarber", [body('email', "Enter a valid email").isEmail(), body('name', "Enter a valid name").isLength({ min: 3 }), body('password', "Password must be atleast 5 characters").isLength({ min: 5 }), body('zip').custom((value, { req }) => {
    var a = /(^\d{6}$)/;
    if (a.test(value)) {
        return true
    }
    else {
        return false
    }
})
], async (req, res) => {
    let success = false;
    //If there are errors, return Bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //Check weather the barber with this email exists already
    try {
        let barber = await Barber.findOne({ email: req.body.email })
        if (barber) {
            return res.status(400).json({ success, error: "Sorry a barber with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt)
        req.body.password = secPass
        await BarberCounter.updateOne(
            { _id: '64e665e9a70ad4163322e4e9' },
            {
                $inc: { value: 1 },
                $currentDate: { lastModified: true }
            }
        );
        let counter = await BarberCounter.findById("64e665e9a70ad4163322e4e9")
        const barberObj = { ...req.body, shopnumber: counter.value }
        barber = await Barber.create(barberObj)
        const data = {
            id: barber.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

// ROUTE 2: Authenticate a Barber using:POST "/api/barberauth/loginbarber". Login required
router.post("/loginbarber", [body('email', "Enter a valid email").isEmail(), body('password', "Password cannot be blank").exists()
], async (req, res) => {
    //If there are errors, return Bad request and the errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let barber = await Barber.findOne({ email })
        if (!barber) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, barber.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }
        const data = {
            id: barber.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

// ROUTE 3: Authenticate a User using:POST "/api/auth/getUser". Login required
router.post('/getUser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

module.exports = router