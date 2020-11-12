import React, {Component} from 'react';
import axios from 'axios';
import '../../App.css';
import { Editor } from '@tinymce/tinymce-react'; 

export default class AddNoteModalComponent extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeNoteText = this.onChangeNoteText.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            showClass: "",
            noteId: "",
            note_text: "<p></p>"
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.noteId !== this.props.noteId) {
            if(this.props.noteId) {
                axios.get('http://localhost:4000/DailyNotes/'+this.props.noteId)
                .then(response => {
                    this.setState({
                        note_text: response.data.note_text,
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
            }
            else {
                this.setState({
                    note_text: "<p></p>"
                })
            }
        }
    }

    onChangeNoteText(e) {
        this.setState({
            note_text: e.target.getContent()
        });
    }

    onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        const newNote = {
            note_text: this.state.note_text,
            note_date: this.props.noteDate
        }

        if(this.props.noteId) {
            axios.post('http://localhost:4000/DailyNotes/update/'+this.props.noteId, newNote)
            .then(res => {
                console.log(res.data);
                this.closeModal();
                this.props.updateEvents();
            })
            .catch(err => console.log(err));
        }
        else {
            axios.post('http://localhost:4000/DailyNotes/addNote', newNote)
                .then(res => {
                    console.log(res.data);
                    this.closeModal();
                    this.props.updateEvents();
                })
                .catch(err => console.log(err));
        }
    }

    // REVIEW THIS AND COMPONENTDIDUPDATE
    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.showClass !== nextProps.showModal) {
            return {
                showClass: nextProps.showModal
            };
        }
        return null;
    }

    closeModal() {
        if(this.props.noteId) {
            axios.get('http://localhost:4000/DailyNotes/'+this.props.noteId)
            .then(response => {
                this.setState({
                    note_text: response.data.note_text,
                })
            })
            .catch(function(error) {
                console.log(error);
            })
        }
        else {
            this.setState({
                note_text: "<p></p>"
            })
        }
        this.props.closeModal();
    }

    render() {
        return(
            <div>
                <div className={'event-modal ' + this.state.showClass}>
                    <div className="event-modal-content">
                        <span className="close-button" onClick={this.closeModal}>&times;</span>
                        <h4>Edit Note</h4>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Note for {this.props.noteDate.toString()}: </label>
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
                                <input type="submit" value="Save Changes" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}