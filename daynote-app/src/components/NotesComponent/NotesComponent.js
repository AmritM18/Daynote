import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Note = props => (
    <div>
        <div className="border">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                {
                    (props.note.note_title)
                    ? <h5 className="card-title">{props.note.note_title}</h5> 
                    : <h5 className="card-title" id={new Date(props.note.note_date).getDate()}>{new Date(props.note.note_date).toDateString()}</h5>
                }
                {
                    (props.note.note_title)
                    ? <Link to={"/addNote/"+props.note._id} className="btn btn-primary">Edit</Link>
                    : <Link to={"/addDailyNote/"+props.note._id+"/"+new Date(props.note.note_date).getDate()} className="btn btn-primary">Edit</Link>
                }
                </div>
                <hr/>
                <p className="card-text" dangerouslySetInnerHTML={{ __html: props.note.note_text }}></p>
            </div>
        </div>
    </div>
)

export default class NotesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: []
        };
    }

    async componentDidMount() {
        let monthYear =  "" + (this.props.month+1) + this.props.year;
        const monthExists = await axios.get('http://localhost:4000/notes/noteExists/'+monthYear);
        let notes = [];
        if (monthExists.data) {
            const noteData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
            notes = noteData.data.notes;
        }
        const dailyNotesExist = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
        if(dailyNotesExist.data) {
            const dailyNotesRes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
            notes = notes.concat(dailyNotesRes.data.dailyNotes);
        }
        this.setState({
            notes: notes
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            let monthYear =  "" + (this.props.month+1) + this.props.year;
            const monthExists = await axios.get('http://localhost:4000/notes/noteExists/'+monthYear);
            let notes = [];
            if (monthExists.data) {
                const noteData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
                notes = noteData.data.notes;
            }
            const dailyNotesExist = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
            if(dailyNotesExist.data) {
                const dailyNotesRes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
                notes = notes.concat(dailyNotesRes.data.dailyNotes);
            }
            this.setState({
                notes: notes
            }) 
        } 
    }

    getNotes() {
        return this.state.notes.map(function(currentNote, i) {
            return <Note note={currentNote} index={i} key={i} />;
        })
    }

    render() {
        return(
            <div>
                <div>
                    <div className="d-flex justify-content-end">
                        <Link to={"/addNote"} className="btn btn-primary">Add Note</Link>
                    </div>
                    { this.getNotes() }
                </div>
            </div>
        )
    }
}