const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = express.Router();
const routes2 = express.Router();
const routes3 = express.Router();
const PORT = 4000;

let Note = require('./note.model');
let Event = require('./event.model');
let DailyNote = require('./dailyNote.model');

let EventGroup = require('./event.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/notes', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

routes.route('/').get(function(req,res) {
    Note.find(function(err,notes) {
        if(err) {
            console.log(err);
        }
        else {
            res.json(notes);
        }
    });
});

routes.route('/:id').get(function(req,res) {
    let id = req.params.id;
    Note.findById(id, function(err, note) {
        res.json(note);
    });
});

/*routes.route('/delete/:id').post(function(req,res) {
    let id = req.params.id;
    Note.remove({id: id})
    .then(notes => {
        res.status(200).json({'note': 'note deleted successfuly'});
    });
});*/

routes.route('/addNote').post(function(req,res) {
    let note = new Note(req.body);
    note.save()
        .then(note => {
            res.status(200).json({'note': 'note added successfuly'});
        })
        .catch(err => {
            res.status(400).send('adding new note failed');
        });
});

app.use('/notes', routes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

routes2.route('/').get(function(req,res) {
    Event.find(function(err,events) {
        if(err) {
            console.log(err);
        }
        else {
            res.json(events);
        }
    });
});

routes2.route('/:id').get(function(req,res) {
    let id = req.params.id;
    Event.findById(id, function(err, event) {
        res.json(event);
    });
});

routes2.route('/getMonth/:month').get(function(req,res) {
    let month = req.params.month;
    EventGroup.findOne({monthYear: month}, function(err,obj){
        res.json(obj);
    })
});

routes2.route('/exists/:month').get(function(req,res) {
    let month = req.params.month;
    EventGroup.exists({ monthYear: month }, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
});

routes2.route('/addMonth/').post(function(req,res) {
    let eventGroup = new EventGroup(req.body);
    eventGroup.save()
        .then(eventGroup => {
            res.status(200).json({'eventGroup': 'eventGroup added successfuly'});
        })
        .catch(err => {
            res.status(400).send('adding new eventGroup failed');
        });
});

routes2.route('/addEvent').post(function(req,res) {
    let event = new Event(req.body);
    event.save()
        .then(event => {
            res.status(200).json({'event': 'event added successfuly'});
        })
        .catch(err => {
            res.status(400).send('adding new event failed');
        });
});

routes2.route('/updateMonth/:month').post(function(req,res) {
    let month = req.params.month;
    EventGroup.findOne({monthYear: month}, function(err,eventGroup){
        if(!eventGroup) {
            res.status(404).send('data is not found');
        }
        else {
            eventGroup.monthYear = req.body.monthYear;
            eventGroup.events = req.body.events;

            eventGroup.save().then(eventGroup => {
                res.json('Event updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    })
});

routes2.route('/update/:id').post(function(req,res) {
    Event.findById(req.params.id, function(err, event) {
        if(!event) {
            res.status(404).send('data is not found');
        }
        else {
            event.event_title = req.body.event_title;
            event.event_start = req.body.event_start;
            event.event_end = req.body.event_end;
            event.event_colour = req.body.event_colour;  

            event.save().then(event => {
                res.json('Event updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

routes2.route('/remove/:id').delete(function(req,res) {
    Event.findByIdAndRemove(req.params.id, (err, event) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Event successfully deleted",
            id: req.params.id
        };
        return res.status(200).send(response);
    });
});

app.use('/events', routes2);

routes3.route('/').get(function(req,res) {
    DailyNote.find(function(err,events) {
        if(err) {
            console.log(err);
        }
        else {
            res.json(events);
        }
    });
});

routes3.route('/addNote').post(function(req,res) {
    let note = new DailyNote(req.body);
    note.save()
        .then(event => {
            res.status(200).json({'note': 'note added successfuly'});
        })
        .catch(err => {
            res.status(400).send('adding new note failed');
        });
});

routes3.route('/:id').get(function(req,res) {
    let id = req.params.id;
    DailyNote.findById(id, function(err, event) {
        res.json(event);
    });
});

routes3.route('/update/:id').post(function(req,res) {
    DailyNote.findById(req.params.id, function(err, note) {
        if(!note) {
            res.status(404).send('data is not found');
        }
        else {
            note.note_text = req.body.note_text;
            note.note_date = req.body.note_date;

            note.save().then(note => {
                res.json('Note updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

routes3.route('/remove/:id').delete(function(req,res) {
    DailyNote.findByIdAndRemove(req.params.id, (err, note) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Note successfully deleted",
            id: req.params.id
        };
        return res.status(200).send(response);
    });
});

app.use('/DailyNotes', routes3);