import React, {Component} from 'react';
import axios from 'axios';
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
            event_colour: "1",
            eventId: null
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.eventId !== this.props.eventId) {
            console.log("EVENT CHANGED");

            // Get the start month and event object id from props
            let monthYear = "" + (this.props.eventDate.getMonth()+1) + this.props.eventDate.getFullYear();
            let eventId = this.props.eventId;

            // Fetch event and set state to the event properties
            axios.get('http://localhost:4000/events/getMonth/'+monthYear)
                .then(response => {
                    events = response.data.events;
                    
                    events.forEach(element => {
                        if(element._id === eventId) {
                            this.setState({
                                event_title: element.event_title,
                                event_start: element.event_start,
                                event_end: element.event_end,
                                event_colour: element.event_colour
                            })
                        }
                    });

                    // Delete event from starting month
                    let index = -1;
                    for(let i = 0; i<events.length; i++) {
                        if(events[i]._id === eventId) {
                            index = i;
                        }
                    }
                    events.splice(index,1);

                    const newEventGroup = {
                        monthYear: monthYear,
                        events: events
                    }

                    console.log(newEventGroup);
                    
                    axios.post('http://localhost:4000/events/updateMonth/'+monthYear, newEventGroup)
                        .then(res =>{
                            console.log(res.data);

                            this.setState({
                                showClass: "",
                                event_title: "",
                                event_start: new Date(),
                                event_end: new Date(),
                                event_colour: "1"
                            });
                    
                            this.props.updateEvents();
                        })
                        .catch(err => console.log(err));
                })
                .catch(function(error) {
                    console.log("Whoops");
                    console.log(error);
                })
        }
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
            event_start: new Date(this.state.event_start),
            event_end: new Date(this.state.event_end),
            event_colour: this.state.event_colour,
        }

        console.log(modifiedEvent.event_start);
        console.log(modifiedEvent.event_end);
        console.log(modifiedEvent.event_start <= modifiedEvent.event_end);
        if(modifiedEvent.event_start <= modifiedEvent.event_end){
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
        else {
            alert("Nope");
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.showClass !== nextProps.showModal) {
            return {
                showClass: nextProps.showModal
            };
        }
        return null;
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
                <div className={'event-modal ' + this.state.showClass}>
                    <div className="event-modal-content">
                        <span className="close-button" onClick={this.props.closeModal}>&times;</span>
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}