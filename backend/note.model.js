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

module.exports = mongoose.model('Note', Note);