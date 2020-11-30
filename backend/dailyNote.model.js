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

let DailyNoteGroup = new Schema({
    monthYear: {
        type: String
    },
    dailyNotes: {
        type: [ DailyNote ]
    }
});

module.exports = mongoose.model('DailyNote', DailyNote);
module.exports = mongoose.model('DailyNoteGroup', DailyNoteGroup);