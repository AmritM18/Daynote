import React, {Component} from 'react';
import axios from 'axios';
import '../../App.css';

export default class AddNoteModalComponent extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeNoteText = this.onChangeNoteText.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            showClass: "",
            noteId: "",
            note_text: ""
        }
    }

    componentDidUpdate(prevProps) {
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
                    note_text: ""
                })
            }
        }
    }

    onChangeNoteText(e) {
        this.setState({
            note_text: e.target.value
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
                note_text: ""
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
                                <textarea className="form-control" value={this.state.note_text} onChange={this.onChangeNoteText} >
                                </textarea>
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