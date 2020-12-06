import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Note = props => (
    <div className="sticky-note">
        <div className="note-title">
        {
            (props.note.note_title)
            ? <div className="d-flex justify-content-between"><div>{props.note.note_title}</div> <Link to={"/addNote/"+props.note._id}><img src="assets/sticky-edit-button.svg"/></Link></div> 
            : <div className="d-flex justify-content-between"><div id={new Date(props.note.note_date).getDate()}>{new Date(props.note.note_date).toDateString()}</div> <Link to={"/addDailyNote/"+props.note._id+"/"+new Date(props.note.note_date).getDate()}><img src="assets/sticky-edit-button.svg"/></Link></div>
        }
        </div>
        <p className="note-content" dangerouslySetInnerHTML={{ __html: props.note.note_text }}></p>
    </div>
)

export default class NotesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            dailyNotes: [],
        };
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.dailyNotes !== nextProps.dailyNotes) {
            return {
                dailyNotes: nextProps.dailyNotes
            };
        }
        return null;
    }

    async componentDidMount() {
        let monthYear =  "" + (this.props.month+1) + this.props.year;
        const monthExists = await axios.get('http://localhost:4000/notes/noteExists/'+monthYear);
        if (monthExists.data) {
            const noteData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
            this.setState({
                notes: noteData.data.notes,
            })
        }
        /*const dailyNotesExist = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
        if(dailyNotesExist.data) {
            const dailyNotesRes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
            notes = notes.concat(dailyNotesRes.data.dailyNotes);
        }*/
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
            /*const dailyNotesExist = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
            if(dailyNotesExist.data) {
                const dailyNotesRes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
                notes = notes.concat(dailyNotesRes.data.dailyNotes);
            }*/
            this.setState({
                notes: notes,
            }) 
        } 
    }

    getNotes() {
        return this.state.notes.map(function(currentNote, i) {
            return <Note note={currentNote} index={i} key={i} />;
        })
    }

    getDailyNotes() {
        return this.state.dailyNotes.map(function(currentNote, i) {
            return <Note note={currentNote} index={i} key={i} />;
        })
    }

    render() {
        return(
            <div>
                <div>
                    <Link to={"/addNote"} className="d-flex align-items-center justify-content-end add-note-margin">
                        <div className="add-note-text">Add Note</div>
                        <img src="assets/add-note-plus.svg" height="19.5" />
                    </Link>
                    <div className="sticky-note-parent">
                        { this.getNotes() }
                        { this.getDailyNotes() }
                    </div>
                </div>
            </div>
        )
    }
}