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






module.exports = router;