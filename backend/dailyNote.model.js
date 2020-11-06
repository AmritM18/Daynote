const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DailyNote = new Schema({
    note_text: {
        type: String
    },
    note_date: {
        type: Date
    }
});

module.exports = mongoose.model('DailyNote', DailyNote);