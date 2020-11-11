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

let EventGroup = new Schema({
    monthYear: {
        type: String
    },
    events: {
        type: [ Event ]
    }
});

module.exports = mongoose.model('Event', Event);
module.exports = mongoose.model('EventGroup', EventGroup);