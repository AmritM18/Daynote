import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../App.css';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export default class EditTodo extends Component {

    constructor(props) {
        super(props);

        this.toggleShowClass = this.toggleShowClass.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventTitle = this.onChangeEventTitle.bind(this);
        this.onChangeEventStart = this.onChangeEventStart.bind(this);
        this.onChangeEventEnd = this.onChangeEventEnd.bind(this);
        this.onChangeEventColour = this.onChangeEventColour.bind(this);
        this.dateTimePickerStart = this.dateTimePickerStart.bind(this);
        this.dateTimePickerEnd = this.dateTimePickerEnd.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        this.state = {
            showClass: "",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/events/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    event_title: response.data.event_title,
                    event_start: response.data.event_start,
                    event_end: response.data.event_end,
                    event_colour: response.data.event_colour
                })
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    toggleShowClass() {
        if(this.state.showClass === "") {
            this.setState({
                showClass: "show-events-modal"
            });
        }
        else {
            this.setState({
                showClass: "",
                event_title: "",
                event_start: new Date(),
                event_end: new Date(),
                event_colour: "1"
            });
        }
    }

    onChangeEventTitle(e) {
        this.setState({
            event_title: e.target.value
        });
    }

    onChangeEventStart(e) {
        this.setState({
            event_start: e._d
        });
    }

    onChangeEventEnd(e) {
        this.setState({
            event_end: e._d
        });
    }

    onChangeEventColour(e) {
        this.setState({
            event_colour: e.target.value
        });
    }

    onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(`Title: ${this.state.event_title}`);
        console.log(`Start: ${this.state.event_start}`);
        console.log(`End: ${this.state.event_end}`);
        console.log(`Colour: ${this.state.event_colour}`);

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
                    showClass: "",
                    event_title: "",
                    event_start: new Date(),
                    event_end: new Date(),
                    event_colour: "1"
                });
        
                window.location.href = "/";
            })
            .catch(err => console.log(err));
    }

    dateTimePickerStart() {
        let startDate = new Date(this.state.event_start);
        return <Datetime onChange={this.onChangeEventStart} value={startDate} initialValue={startDate} />;
    }

    dateTimePickerEnd() {
        let endDate = new Date(this.state.event_end);
        return <Datetime onChange={this.onChangeEventEnd} value={endDate} initialValue={endDate} />;
    }

    deleteEvent() {
        axios.delete('http://localhost:4000/events/remove/'+this.props.match.params.id)
            .then(res => {
                window.location.href = "/"; 
            })
            .catch(err => console.log(err));    
    }

    render() {
        return(
            <div>
                <div>
                    <div className="d-flex justify-content-between">
                        <h4>Edit Event</h4>
                        <button className="btn btn-primary" onClick={this.deleteEvent}>Delete</button>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Event Name: </label>
                            <input 
                                type="text" 
                                className="form-control"
                                value={this.state.event_title}
                                onChange={this.onChangeEventTitle}
                            />
                        </div>
                        <div className="form-group">
                            <label>Event Start: </label>
                            {this.dateTimePickerStart()}
                        </div>
                        <div className="form-group">
                            <label>Event End: </label>
                            {this.dateTimePickerEnd()}
                        </div>
                        <div className="form-group">
                            <label>Event Colour: </label>
                            <select 
                                className="form-control"
                                value={this.state.event_colour}
                                onChange={this.onChangeEventColour}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Edit Event" className="btn btn-primary" />
                            <Link to={"/"} className="btn">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}