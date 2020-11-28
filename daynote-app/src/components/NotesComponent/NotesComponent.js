import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Note = props => (
    <div>
        <div className="border">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title">{props.note.note_title}</h5>
                    <Link to={"/addNote/"+props.note._id} className="btn btn-primary">Edit</Link>
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