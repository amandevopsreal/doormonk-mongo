const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")
const Barber = require("../models/Barber")
const Appointment = require("../models/Appointments.js");
// ROUTE 1: Get All the Shops City wise using:GET "/api/shops/fetchallshops". Login required
router.post("/fetchallshops", fetchUser, async (req, res) => {
    try {
        const shops = await Barber.find({ city: req.body.city }).select(["name", "phone", "website", "services", "type", "email", "address", "city", "state", "zip", "workingHours", "workingdays"])
        if (req.body.date.length > 0) {
            const shopsbyday = shops.filter((shop) => {
                return shop.workingdays.includes(req.body.date)
            })
            res.json(shopsbyday)
            return
        }
        res.json(shops)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

// ROUTE 2 : Get All the Appointments User wise using:GET "/api/shops/fetchallappointments". Login required
router.get("/fetchallappointments", fetchUser, async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).select(["name", "phone", "services", "email", "address", "time", "barbername", "barberphone", "barberwebsite", "barberemail", "barberaddress", "servicetype", "bookingid", "status", "date"])
        res.json(appointments)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

// ROUTE 3: Add an appointment:POST "/api/shops/addappointment". Login required
router.post("/addappointment/:id", fetchUser, [body('time', "Enter a valid time").isLength({ min: 3 })], async (req, res) => {
    const { name, phone, services, email, address, time, date, servicetype } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await Barber.updateOne(
            { _id: req.params.id },
            {
                $inc: { bookingcounter: 1 },
                $currentDate: { lastModified: true }
            }
        );
        const barber = await Barber.findById(req.params.id)

        const appointment = await Appointment.create({
            bookingid: barber.bookingcounter, user: req.user.id, barber: req.params.id, name, phone, services, email, address, time, date, barbername: barber.name, barberphone: barber.phone, barberwebsite: barber.website, barberemail: barber.email, barberaddress: barber.address, servicetype
        })
        res.json(appointment)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 4: Update an existing appointment:PUT "/api/shops/updateassignment". Login required
router.put("/updateappointment/:id", fetchUser, async (req, res) => {
    try {
        const { time, date, services } = req.body
        const newAppointment = {}
        if (time) {
            newAppointment.time = time
        }
        if (date) {
            newAppointment.date = date
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

// ROUTE 5: Delete an existing appointment:DELETE "/api/shops/deleteappointment". Login required
router.put("/deleteappointment/:id", fetchUser, async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).send("Not found")
        }
        if (appointment.user.toString() !== req.user.id) {
            res.status(401).send("Not allowed")
        }
        appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'Canceled' }, { new: true })
        res.json({ success: "Appointment has been canceled", appointment: appointment })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }


})

module.exports = router;