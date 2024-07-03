const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route1: Get all the notes : GET "/api/note/fetchallNotes" . Requires login
router.get("/fetchallNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

// Route2: Post Notes : GET "/api/note/postNotes" . Requires login
router.post(
  "/postNotes",
  fetchUser,
  [body("title").isLength({ min: 1 }).withMessage("Enter a valid title")],
  async (req, res) => {
    const { title, Description, Tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = new Notes({
        title,
        Description,
        Tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.send(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Route3: Post Notes : GET "/api/note/updateNotes" . Requires login

router.put(
  "/updateNotes/:id",
  fetchUser,
  [body("title").isLength({ min: 1 }).withMessage("Enter a valid title")],
  async (req, res) => {
    const { title, Description, Tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (Description) {
        newNote.Description = Description;
      }
      if (Tag) {
        newNote.Tag = Tag;
      }

      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("No Notes Found");
      }

      if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Route3: Post Notes : GET "/api/note/deleteNotes" . Requires login

router.delete(
  "/deleteNotes/:id",
  fetchUser,

  async (req, res) => {
    try {
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("No Notes Found");
      }

      if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndDelete(req.params.id);
      res.json("Successfully Deleted Your Notes");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

module.exports = router;
