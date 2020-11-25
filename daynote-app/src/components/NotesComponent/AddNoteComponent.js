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

        this.state = {
            note_title: "",
            note_text: "",
        }
    }

    componentDidMount() {
        console.log(this.props.match.params.id);
        if (this.props.match.params.id) {
            const id = this.props.match.params.id;
            axios.get('http://localhost:4000/notes/'+id)
                .then(response => {
                    this.setState({
                        note_title: response.data.note_title,
                        note_text: response.data.note_text,
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
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

    onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        console.log(`Note form submitted:`);
        console.log(`Title: ${this.state.note_title}`);
        console.log(`Text: ${this.state.note_text}`);

        const modifiedNote = {
            note_title: this.state.note_title,
            note_text: this.state.note_text,
        }

        axios.post('http://localhost:4000/notes/addNote/', modifiedNote)
            .then(res => {
                console.log(res.data);

                this.setState({
                    note_title: "",
                    note_text: ""
                });
        
                window.location.href = "/";
            })
            .catch(err => console.log(err));
    }
        /*
        const modifiedEvent = {
            event_title: this.state.event_title,
            event_start: this.state.event_start,
            event_end: this.state.event_end,
            event_colour: this.state.event_colour,
        }

        axios.post('http://localhost:4000/events/update/'+this.props.match.params.id, modifiedEvent)
            .then(res => {
                console.log(res.data);

                this.setState({
                    event_title: "",
                    event_start: new Date(),
                    event_end: new Date(),
                    event_colour: "1"
                });
        
                window.location.href = "/";
            })
            .catch(err => console.log(err));
    }

    deleteEvent() {
        axios.delete('http://localhost:4000/events/remove/'+this.props.match.params.id)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));

        window.location.href = "/";
    }
*/

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
                        <Link to="/" className="btn btn-primary">Cancel</Link>
                    </div>
                </form> 
            </div>
        );
    }
}