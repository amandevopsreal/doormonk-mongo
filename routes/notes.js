const express = require("express")
const router = express.Router()
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser.js")

// ROUTE 1: Get All the Note using:GET "/api/notes/fetchallnottes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const note = await Note.find({ user: req.user.id })
        res.json(note)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 2: Add a note:POST "/api/notes/addnote". Login required
router.post("/addnote", fetchUser, [body('title', "Enter a valid title").isLength({ min: 3 }), body('description', "Description must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
    const { title, description, tag } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const note = await Note.create({
            title, description, tag, user: req.user.id
        })
        res.json(note)
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 3: Update an existing note:PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        const newNote = {}
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// ROUTE 4: Delete an existing note:DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ success: "Note has been deleted", note: note })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }


})



module.exports = router