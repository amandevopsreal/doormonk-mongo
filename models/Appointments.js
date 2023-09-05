const mongoose = require("mongoose")
const { Schema } = mongoose;

const AppointmentsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "barber"
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }

})

const Appointment = mongoose.model("appointment", AppointmentsSchema)
module.exports = Appointment