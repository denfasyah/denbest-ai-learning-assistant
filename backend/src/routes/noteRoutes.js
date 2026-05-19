const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, togglePin, deleteNote } = require('../controllers/noteController');

router.get('/', getNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.patch('/:id/pin', togglePin);
router.delete('/:id', deleteNote);

module.exports = router;
