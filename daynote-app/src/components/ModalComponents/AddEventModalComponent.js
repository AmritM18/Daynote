import React, {Component} from 'react';
import axios from 'axios';
import '../../App.css';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export default class AddEventModalComponent extends Component {
    constructor(props) {
        super(props);

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

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.showModal !== this.props.showModal) {
            // Hide modal
            if(this.props.showModal === "") {
                this.setState({
                    showClass: "",
                    event_title: "",
                    event_colour: "1"
                });
            }
            // Show modal
            else {
                let eventDate = new Date(this.props.eventDate);

                this.setState({
                    showClass: "show-events-modal",
                    event_title: "",
                    event_start: eventDate,
                    event_end: eventDate,
                    event_colour: "1"
                });
            }
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

    onChangeEventColour(colour) {
        this.setState({
            event_colour: colour
        });
    }

    async onSubmit(e) {
        // prevents default submit behaviour of browser 
        e.preventDefault();

        const newEvent = {
            event_title: this.state.event_title,
            event_start: this.state.event_start,
            event_end: this.state.event_end,
            event_colour: this.state.event_colour,
        }

        // Adding event to start month
        let monthYear = "" + (this.state.event_start.getMonth()+1) + this.state.event_start.getFullYear();
        const startExists = await axios.get('http://localhost:4000/events/exists/'+monthYear);
        // If an entry for start month doesn't exist, create one
        if(!startExists.data) {
            const newEventGroup = {
                monthYear: monthYear,
                events: [newEvent]
            }
            await axios.post('http://localhost:4000/events/addMonth', newEventGroup);
        }
        // Otherwise add to existing start month entry
        else {
            const startRes = await axios.get('http://localhost:4000/events/getMonth/'+monthYear);
            let events = startRes.data.events;
            events.push(newEvent);
            const newEventGroup = {
                monthYear: startRes.data.monthYear,
                events: events
            }
            await axios.post('http://localhost:4000/events/updateMonth/'+monthYear, newEventGroup);
        }

        // If start month != end month, add entry for end month
        let endMonthYear = "" + (this.state.event_end.getMonth()+1) + this.state.event_end.getFullYear();
        if(monthYear !== endMonthYear) {
            const endExists = await axios.get('http://localhost:4000/events/exists/'+endMonthYear);
            // If an entry for end month doesn't exist, create one
            if(!endExists.data) {
                const newEndEventGroup = {
                    monthYear: endMonthYear,
                    events: [newEvent]
                }
                await axios.post('http://localhost:4000/events/addMonth', newEndEventGroup);
            }
            // Otherwise add to existing start month entry
            else {
                const endRes = await axios.get('http://localhost:4000/events/getMonth/'+endMonthYear);
                let events = endRes.data.events;
                events.push(newEvent);
                const newEndEventGroup = {
                    monthYear: endRes.data.monthYear,
                    events: events
                }
                await axios.post('http://localhost:4000/events/updateMonth/'+monthYear, newEndEventGroup);
            }
        }

        // All done, reset state and update calendar
        this.setState({
            showClass: "",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        });

        this.props.updateEvents();
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
                <div className={'event-modal ' + this.state.showClass}>
                    <div className="event-modal-content">
                        <span className="close-button" onClick={this.props.closeModal}>&times;</span>
                        <div className="modal-title">Add An Event</div>
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
                                <div className="d-flex">
                                    <div className={`colour-option colour-1 ${this.state.event_colour === "1" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("1")}></div>
                                    <div className={`colour-option colour-2 ${this.state.event_colour === "2" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("2")}></div>
                                    <div className={`colour-option colour-3 ${this.state.event_colour === "3" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("3")}></div>
                                    <div className={`colour-option colour-4 ${this.state.event_colour === "4" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("4")}></div>
                                    <div className={`colour-option colour-5 ${this.state.event_colour === "5" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("5")}></div>
                                    <div className={`colour-option colour-6 ${this.state.event_colour === "6" ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour("6")}></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Create Event" className="btn" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}