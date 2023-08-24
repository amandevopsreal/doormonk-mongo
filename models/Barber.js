const mongoose = require("mongoose")
const { Schema } = mongoose;



const BarberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: "Not available"
    },
    services: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    workinghours: {
        type: String,
        required: true
    },
    shopnumber: {
        type: Number,
        unique: true,
        required: true
    }

})
const Barber = mongoose.model("barber", BarberSchema)
module.exports = Barber