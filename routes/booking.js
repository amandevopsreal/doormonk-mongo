const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")
const Barber = require("../models/Barber")
const Appointment = require("../models/Appointments.js");
// ROUTE 1: Get All the Shops City wise using:GET "/api/shops/fetchallshops". Login required
router.post("/fetchallshops", fetchUser, async (req, res) => {
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
    const { name, phone, services, email, address, time } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const appointment = await Appointment.create({
            user: req.user.id, barber: req.params.id, name, phone, services, email, address, time
        })
        res.json(appointment)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 3: Update an existing appointment:PUT "/api/shops/updateassignment". Login required
router.put("/updateappointment/:id", fetchUser, async (req, res) => {
    try {
        const { time } = req.body
        const newAppointment = {}
        if (time) {
            newAppointment.time = time
        }
        let appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).send("Not found")
        }
        if (appointment.user.toString() !== req.user.id) {
            res.status(401).send("Not allowed")
        }
        appointment = await Appointment.findByIdAndUpdate(req.params.id, { $set: newAppointment }, { new: true })
        res.json({ appointment })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 4: Delete an existing appointment:DELETE "/api/shops/deleteappointment". Login required
router.delete("/deleteappointment/:id", fetchUser, async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).send("Not found")
        }
        if (appointment.user.toString() !== req.user.id) {
            res.status(401).send("Not allowed")
        }
        appointment = await Appointment.findByIdAndDelete(req.params.id)
        res.json({ success: "Appointment has been deleted", appointment: appointment })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }


})

module.exports = router;