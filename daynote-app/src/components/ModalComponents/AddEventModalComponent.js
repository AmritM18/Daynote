import React, {Component} from 'react';
import axios from 'axios';
import '../../App.css';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export default class AddEventModalComponent extends Component {
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

        this.state = {
            showClass: "",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
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

        /*console.log(`Form submitted:`);
        console.log(`Title: ${this.state.event_title}`);
        console.log(`Start: ${this.state.event_start}`);
        console.log(`End: ${this.state.event_end}`);
        console.log(`Colour: ${this.state.event_colour}`);*/

        const newEvent = {
            event_title: this.state.event_title,
            event_start: this.state.event_start,
            event_end: this.state.event_end,
            event_colour: this.state.event_colour,
        }

        if(this.state.event_start.getMonth() === this.state.event_end.getMonth() && this.state.event_start.getFullYear() === this.state.event_end.getFullYear()) {
            let monthYear = "" + (this.state.event_start.getMonth()+1) + this.state.event_start.getFullYear();
            console.log(monthYear);
            
            axios.get('http://localhost:4000/events/exists/'+monthYear)
                .then(response => {
                    // if an entry for this month doesn't exist, create one
                    if(!response.data) {
                        const newEventGroup = {
                            monthYear: monthYear,
                            events: [newEvent]
                        }

                        axios.post('http://localhost:4000/events/addMonth', newEventGroup)
                            .then(res => {
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
                    }
                    // otherwise add to existing month entry
                    else {
                        axios.get('http://localhost:4000/events/getMonth/'+monthYear)
                            .then(response => {
                                let events = response.data.events;
                                events.push(newEvent);

                                const newEventGroup = {
                                    monthYear: response.data.monthYear,
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
                                console.log(error);
                            })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        else {
            let monthYear = "" + (this.state.event_start.getMonth()+1) + this.state.event_start.getFullYear();
            console.log(monthYear);
            
            axios.get('http://localhost:4000/events/exists/'+monthYear)
                .then(response => {
                    // if an entry for this month doesn't exist, create one
                    if(!response.data) {
                        const newEventGroup = {
                            monthYear: monthYear,
                            events: [newEvent]
                        }

                        axios.post('http://localhost:4000/events/addMonth', newEventGroup)
                            .then(res => {
                                console.log(res.data);
                            })
                            .catch(err => console.log(err));
                    }
                    // otherwise add to existing month entry
                    else {
                        axios.get('http://localhost:4000/events/getMonth/'+monthYear)
                            .then(response => {
                                let events = response.data.events;
                                events.push(newEvent);

                                const newEventGroup = {
                                    monthYear: response.data.monthYear,
                                    events: events
                                }

                                console.log(newEventGroup);
                                
                                axios.post('http://localhost:4000/events/updateMonth/'+monthYear, newEventGroup)
                                    .then(res =>{
                                        console.log(res.data);
                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(function(error) {
                                console.log(error);
                            })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })

            let monthYearEnd = "" + (this.state.event_end.getMonth()+1) + this.state.event_end.getFullYear();
            console.log(monthYearEnd);
            
            axios.get('http://localhost:4000/events/exists/'+monthYearEnd)
                .then(response => {
                    // if an entry for this month doesn't exist, create one
                    if(!response.data) {
                        const newEventGroup = {
                            monthYear: monthYearEnd,
                            events: [newEvent]
                        }

                        axios.post('http://localhost:4000/events/addMonth', newEventGroup)
                            .then(res => {
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
                    }
                    // otherwise add to existing month entry
                    else {
                        axios.get('http://localhost:4000/events/getMonth/'+monthYearEnd)
                            .then(response => {
                                let events = response.data.events;
                                events.push(newEvent);

                                const newEventGroup = {
                                    monthYear: response.data.monthYear,
                                    events: events
                                }

                                console.log(newEventGroup);
                                
                                axios.post('http://localhost:4000/events/updateMonth/'+monthYearEnd, newEventGroup)
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
                                console.log(error);
                            })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    dateTimePickerStart() {
        let startDate = new Date(this.state.event_start);
        return <Datetime onChange={this.onChangeEventStart} value={startDate} initialValue={startDate} />;
    }

    dateTimePickerEnd() {
        let endDate = new Date(this.state.event_end);
        return <Datetime onChange={this.onChangeEventEnd} value={endDate} initialValue={endDate} />;
    }

    render() {
        return(
            <div>
                <div className="btn btn-primary float-right" onClick={this.toggleShowClass}>Add Event</div>
                <div className={'event-modal ' + this.state.showClass}>
                    <div className="event-modal-content">
                        <span className="close-button" onClick={this.toggleShowClass}>&times;</span>
                        <h4>Add An Event</h4>
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
                                <input type="submit" value="Create Event" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}