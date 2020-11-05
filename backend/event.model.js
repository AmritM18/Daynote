const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Event = new Schema({
    event_start: {
        type: Date
    },
    event_end: {
        type: Date
    },
    event_title: {
        type: String
    },
    event_colour: {
        type: String
    }
});

module.exports = mongoose.model('Event', Event);