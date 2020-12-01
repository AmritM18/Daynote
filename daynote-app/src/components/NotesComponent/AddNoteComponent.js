import React, {Component} from 'react';
import { Editor } from '@tinymce/tinymce-react'; 
import '../../App.css';
import { Link } from 'react-router-dom';
import "react-datetime/css/react-datetime.css";
import axios from 'axios';

export default class EditTodo extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeNoteTitle = this.onChangeNoteTitle.bind(this);
        this.onChangeNoteText = this.onChangeNoteText.bind(this);
        this.deleteNote = this.deleteNote.bind(this);

        this.state = {
            note_title: "",
            note_text: "",
            note_date: new Date(),
            isDailyNote: null
        }
    }

    async componentDidMount() {
        // Need to fetch the month and then fetch this note by it's id
        let monthYear = "" + (this.props.month+1) + this.props.year; 

        if(this.props.routeParams.match.path == "/addDailyNote/:id/:date") {
            const dailyNoteData = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
            let notes = dailyNoteData.data.dailyNotes;
            for(let i = 0; i < notes.length; i++) {
                if (notes[i]._id === this.props.routeParams.match.params.id) {
                    this.setState({
                        note_text: notes[i].note_text,
                        note_date: notes[i].note_date,
                        isDailyNote: true
                    })
                }
            }
        }

        else if(this.props.routeParams.match.path == "/addDailyNote/:date") {
            const noteDate = new Date(this.props.year, this.props.month, this.props.routeParams.match.params.date);
            this.setState({
                note_date: noteDate,
                isDailyNote: true
            })
        }
        
        // DONT NEED THE FIRST 2 IF STATEMENTS
        else if(this.props.routeParams.match.path == "/addNote/:id") {
            const monthExists = await axios.get('http://localhost:4000/notes/noteExists/'+monthYear);
            if (monthExists.data) {
                if (this.props.routeParams.match.params.id) {
                    const noteData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear)
                    let notes = noteData.data.notes;
                    for(let i = 0; i < notes.length; i++) {
                        if (notes[i]._id === this.props.routeParams.match.params.id) {
                            this.setState({
                                note_title: notes[i].note_title,
                                note_text: notes[i].note_text,
                            })
                        }
                    }
                }
            }
        }
    }

    onChangeNoteTitle(e) {
        this.setState({
            note_title: e.target.value
        });
    }

    onChangeNoteText(content, editor) {
        this.setState({
            note_text: content
        });
    }

    async onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        if(this.props.routeParams.match.path == "/addNote/:id" || this.props.routeParams.match.path == "/addNote") {
            const modifiedNote = {
                note_title: this.state.note_title,
                note_text: this.state.note_text,
            }

            let monthYear = "" + (this.props.month+1) + this.props.year;
            const monthExists = await axios.get('http://localhost:4000/notes/noteExists/'+monthYear)
        
            // if no month exists, create the month entry and add the note
            if (!monthExists.data) {
                const newNoteGroup = {
                    monthYear: monthYear,
                    notes: [modifiedNote]
                }
                await axios.post('http://localhost:4000/notes/addNoteMonth/', newNoteGroup);
            }
            // otherwise the month exists
            else {
                // need to edit the note
                // edit
                if (this.props.routeParams.match.params.id) {
                    const getNoteGroupData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
                    let notes = getNoteGroupData.data.notes;
                    let index = -1;
                    for(let i = 0; i < notes.length; i++) {
                        if (notes[i]._id === this.props.routeParams.match.params.id) {
                            index = i;
                        }
                    }
                    notes.splice(index, 1);
                    notes.push(modifiedNote);
                    const newNoteGroup = {
                        monthYear: getNoteGroupData.data.monthYear,
                        notes: notes
                    }
                    await axios.post('http://localhost:4000/notes/updateNoteMonth/'+monthYear, newNoteGroup)
                } 
                // add the note to existing month
                else {
                    const getNoteGroupData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
                    let notes = getNoteGroupData.data.notes;
                    notes.push(modifiedNote);
                    const newNoteGroup = {
                        monthYear: getNoteGroupData.data.monthYear,
                        notes: notes
                    }
                    await axios.post('http://localhost:4000/notes/updateNoteMonth/'+monthYear, newNoteGroup)
                }
            }
        }
        else {
            const modifiedDailyNote = {
                note_text: this.state.note_text,
                note_date: this.state.note_date,
            }
    
            let dailyNoteDate = new Date(this.state.note_date);
            const monthYear = "" + (dailyNoteDate.getMonth()+1) + dailyNoteDate.getFullYear();

            // Adding a daily note
            if(this.props.routeParams.match.path === "/addDailyNote/:date") {
                const monthExists = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
                // If a month entry does not exist
                if(!monthExists.data) {
                    const newDailyNoteGroup = {
                        monthYear: monthYear,
                        dailyNotes: [modifiedDailyNote]
                    }
        
                    await axios.post('http://localhost:4000/DailyNotes/addMonth', newDailyNoteGroup);
                }
                // If a month entry exists
                else {
                    const monthDailyNotes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
                    let dailyNotes = monthDailyNotes.data.dailyNotes;
                    dailyNotes.push(modifiedDailyNote);
                    const newDailyNoteGroup = {
                        monthYear: monthDailyNotes.data.monthYear,
                        dailyNotes: dailyNotes
                    }
                    await axios.post('http://localhost:4000/DailyNotes/updateMonth/'+monthYear, newDailyNoteGroup);
                }
            }
            // Editing a daily note
            else {
                const monthDailyNotes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
                let dailyNotes = monthDailyNotes.data.dailyNotes;
                for(let i = 0; i<dailyNotes.length; i++) {
                    if(dailyNotes[i]._id === this.props.routeParams.match.params.id) {
                        dailyNotes.splice(i, 1, modifiedDailyNote);
                    }
                }
                const newDailyNoteGroup = {
                    monthYear: monthDailyNotes.data.monthYear,
                    dailyNotes: dailyNotes
                }
                await axios.post('http://localhost:4000/DailyNotes/updateMonth/'+monthYear, newDailyNoteGroup);
            }
        }

        this.props.routeParams.history.push('/');
    }

    async deleteNote() {
        let monthYear = "" + (this.props.month+1) + this.props.year;

        if(this.props.routeParams.match.path == "/addDailyNote/:id/:date") {
            const getDailyNoteGroupData = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
            let notes = getDailyNoteGroupData.data.dailyNotes;

            for(let i = 0; i < notes.length; i++) {
                if (notes[i]._id === this.props.routeParams.match.params.id) {
                    notes.splice(i, 1);
                }
            }
            const newDailyNoteGroup = {
                monthYear: getDailyNoteGroupData.data.monthYear,
                dailyNotes: notes
            }

            await axios.post('http://localhost:4000/DailyNotes/updateMonth/'+monthYear, newDailyNoteGroup);
        }
        else {
            const getNoteGroupData = await axios.get('http://localhost:4000/notes/getNoteMonth/'+monthYear);
            let notes = getNoteGroupData.data.notes;
            console.log(notes);
            let index = -1;
            for(let i = 0; i < notes.length; i++) {
                if (notes[i]._id === this.props.routeParams.match.params.id) {
                    index = i;
                    console.log(notes[i].note_title);
                }
            }
            notes.splice(index, 1);
            const newNoteGroup = {
                monthYear: getNoteGroupData.data.monthYear,
                notes: notes
            }
            console.log(newNoteGroup.notes);
            await axios.post('http://localhost:4000/notes/updateNoteMonth/'+monthYear, newNoteGroup)
        }

        this.props.routeParams.history.push('/');
    }


    render() {
        return(
            <div>
                <div className="add-note-title text-center">Add Note</div>
                <form className="add-note-form" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input 
                            type="text" 
                            id="form-title-input"
                            className="form-control"
                            value={this.state.isDailyNote ? new Date(this.state.note_date).toDateString() : this.state.note_title}
                            onChange={this.onChangeNoteTitle}
                            disabled={this.state.isDailyNote ? true : false}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <Editor
                            apiKey="qapv6hfnxtm7zkn4x2h1alasz86je1rcynforifaa49w5l34"
                            value={this.state.note_text}
                            init={{
                            height: 240,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image', 
                                'charmap print preview anchor help',
                                'searchreplace visualblocks code',
                                'insertdatetime media table paste'
                            ],
                            toolbar:
                                'bold italic underline strikethrough bullist'
                            }}
                            onEditorChange={this.onChangeNoteText}
                        />
                    </div>
                    <div className="form-group note-form-buttons d-flex justify-content-between">
                        <div>
                            <input type="submit" value="Update" id="note-update-btn" className="btn mr-2" />
                            <Link to="/" id="note-cancel-btn" className="btn mr-2">Cancel</Link>
                        </div>
                        <div id="note-delete-btn" className="btn" onClick={this.deleteNote}>Delete</div>
                    </div>
                </form> 
            </div>
        );
    }
}