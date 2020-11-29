const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Note = new Schema({
    note_title: {
        type: String
    },
    note_text: {
        type: String
    }
});

let NoteGroup = new Schema({
    monthYear: {
        type: String
    },
    notes: {
        type: [ Note ]
    }
});

module.exports = mongoose.model('Note', Note);
module.exports = mongoose.model('NoteGroup', NoteGroup)