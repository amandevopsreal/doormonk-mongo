const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")
const Barber = require("../models/Barber")
const Appointment = require("../models/Appointments.js");
// ROUTE 1: Get All the Shops City wise using:GET "/api/shops/fetchallshops". Login required
router.get("/fetchallshops", fetchUser, async (req, res) => {
    try {
        const shop = await Barber.find({ city: req.body.city }).select(["name", "phone", "website", "services", "type", "email", "address", "city", "state", "zip", "workingHours"])
        res.json(shop)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
// ROUTE 2: Add an appointment:POST "/api/shops/addappointment". Login required
router.post("/addappointment/:id", fetchUser, [body('time', "Enter a valid time").isLength({ min: 3 })], async (req, res) => {
    const { time } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const appointment = await Appointment.create({
            user: req.user.id, barber: req.params.id, time
        })
        res.json(appointment)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})
module.exports = router;