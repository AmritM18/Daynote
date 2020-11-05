import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Note = props => (
    <div>
        <div className="border">
            <div className="card-body">
                <h5 className="card-title">{props.note.note_title}</h5>
                <hr/>
                <p className="card-text">{props.note.note_text}</p>
            </div>
        </div>
    </div>
)

export default class NotesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {notes: []};
    }

    componentDidMount() {
        axios.get('http://localhost:4000/notes/')
            .then(response => {
                this.setState({notes: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getNotes() {
        return this.state.notes.map(function(currentNote, i) {
            return <Note note={currentNote} key={i} />;
        })
    }

    addNote() {
        //<button className="btn" onClick={this.addNote}>Add</button>
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