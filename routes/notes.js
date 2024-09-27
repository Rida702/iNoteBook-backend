const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: Get all notes: GET "/api/auth/fetchallnotes", Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

//Route 2: Add a new NOte : POST "/api/auth/createnote", Login required
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid Title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            //If there are errors return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //Create New Note 
            const note = await Notes({
                title, description, tag, user: req.user.id,
            })
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error");
        }
    })

//Route 3: Update a Note: GET "/api/auth/updatenote", Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a New Node
        const newNote = {};
        //get all data from request body
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);

        //if note with this id doesnt exists
        if (!note) { return res.status(400).send("Not Found") }

        //the user in this note is not equal to the user making the request to update the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

// //Route 3: Delete a Note: GET "/api/auth/deletenote", Login required
// router.get('/deletenote', fetchuser, async (req, res) => {
//     try {
//         const notes = await Notes.find({ user: req.user.id });
//         res.json(notes);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server error");
//     }
// })



module.exports = router;