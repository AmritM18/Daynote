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
        }
    }

    async componentDidMount() {
        // Need to fetch the month and then fetch this note by it's id
        console.log(this.props)
        let monthYear = "" + (this.props.month+1) + this.props.year; 
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

    onChangeNoteTitle(e) {
        this.setState({
            note_title: e.target.value
        });
    }

    onChangeNoteText(e) {
        this.setState({
            note_text: e.target.getContent()
        });
    }

    async onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        console.log(`Note form submitted:`);
        console.log(`Title: ${this.state.note_title}`);
        console.log(`Text: ${this.state.note_text}`);

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
        this.props.routeParams.history.push('/');
    }

    async deleteNote() {
        let monthYear = "" + (this.props.month+1) + this.props.year;
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

        this.props.routeParams.history.push('/');
    }


    render() {
        return(
            <div>
                <p className="month">Add Note</p>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title </label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={this.state.note_title}
                            onChange={this.onChangeNoteTitle}
                        />
                    </div>
                    <div className="form-group">
                        <label>Note </label>
                        <Editor
                            apiKey="qapv6hfnxtm7zkn4x2h1alasz86je1rcynforifaa49w5l34"
                            value={this.state.note_text}
                            init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image', 
                                'charmap print preview anchor help',
                                'searchreplace visualblocks code',
                                'insertdatetime media table paste wordcount'
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic | \
                                alignleft aligncenter alignright | \
                                bullist numlist outdent indent | help'
                            }}
                            onChange={this.onChangeNoteText}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary mr-2" />
                        <Link to="/" className="btn btn-primary mr-2">Cancel</Link>
                        <button className="btn btn-primary" onClick={this.deleteNote}>Delete</button>
                    </div>
                </form> 
            </div>
        );
    }
}