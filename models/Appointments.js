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
    time: {
        type: String,
        required: true
    }

})

const Appointment = mongoose.model("appointment", AppointmentsSchema)
module.exports = Appointment