import React, {Component} from 'react';
import axios from 'axios';
import '../../App.css';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export default class EditTodo extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventTitle = this.onChangeEventTitle.bind(this);
        this.onChangeEventStart = this.onChangeEventStart.bind(this);
        this.onChangeEventEnd = this.onChangeEventEnd.bind(this);
        this.onChangeEventColour = this.onChangeEventColour.bind(this);
        this.dateTimePickerStart = this.dateTimePickerStart.bind(this);
        this.dateTimePickerEnd = this.dateTimePickerEnd.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        this.state = {
            original_event_title: "",
            original_event_start: new Date(),
            original_event_end: new Date(),
            original_event_colour: "",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        }
    }

    // This is called whenever an event is clicked to update the values in the modal accordingly
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.eventId !== this.props.eventId) {
            console.log("EVENT CHANGED");

            // Get the start month and event object id from props
            let monthYear = "" + (this.props.eventDate.getMonth()+1) + this.props.eventDate.getFullYear();
            let eventId = this.props.eventId;

            // Fetch event and set state to the event properties
            axios.get('http://localhost:4000/events/getMonth/'+monthYear)
                .then(response => {
                    let events = response.data.events;
                    
                    events.forEach(element => {
                        if(element._id === eventId) {
                            this.setState({
                                original_event_title: element.event_title,
                                original_event_start: element.event_start,
                                original_event_end: element.event_end,
                                original_event_colour: element.event_colour,
                                event_title: element.event_title,
                                event_start: element.event_start,
                                event_end: element.event_end,
                                event_colour: element.event_colour
                            })
                        }
                    });
                })
                .catch(err => console.log(err))
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

        const originalStart = new Date(this.state.original_event_start);
        const originalEnd = new Date(this.state.original_event_end);
        const eventStart = new Date(this.state.event_start);
        const eventEnd = new Date(this.state.event_end);

        // Add entry for starting month if it doesn't exist
        let startMonthYear = "" + (eventStart.getMonth() + 1) + eventStart.getFullYear();
        const startExists = await axios.get('http://localhost:4000/events/exists/'+startMonthYear);
        if(!startExists.data) {
            const newEventGroup = {
                monthYear: startMonthYear,
                events: []
            }

            await axios.post('http://localhost:4000/events/addMonth', newEventGroup);
        }

        // If start != end, add entry for ending month if it doesn't exist
        let endMonthYear = "" + (eventEnd.getMonth() + 1) + eventEnd.getFullYear();
        if(startMonthYear !== endMonthYear) {
            const endExists = await axios.get('http://localhost:4000/events/exists/'+endMonthYear);
            if(!endExists.data) {
                const newEventGroup = {
                    monthYear: endMonthYear,
                    events: []
                }

                await axios.post('http://localhost:4000/events/addMonth', newEventGroup);
            }
        }

        // Delete original event entry from original start month
        let originalStartMonthYear = "" + (originalStart.getMonth() + 1) + originalStart.getFullYear();
        const originalStartRes = await axios.get('http://localhost:4000/events/getMonth/'+originalStartMonthYear);
        let events = originalStartRes.data.events;
        let index = -1;
        for(let i = 0; i<events.length; i++) {
            if(events[i]._id === this.props.eventId) {
                index = i;
            }
        }
        events.splice(index, 1);
        const oldStartEventGroup = {
            monthYear: originalStartRes.data.monthYear,
            events: events
        }
        await axios.post('http://localhost:4000/events/updateMonth/'+originalStartMonthYear, oldStartEventGroup)

        // If originalStart != originalEnd, delete event entry from original end month
        let originalEndMonthYear = "" + (originalEnd.getMonth() + 1) + originalEnd.getFullYear();
        if(originalStartMonthYear !== originalEndMonthYear) {
            const originalEndRes = await axios.get('http://localhost:4000/events/getMonth/'+originalEndMonthYear);
            events = originalEndRes.data.events;
            index = -1;
            for(let i = 0; i<events.length; i++) {
                let eventStart = new Date(events[i].event_start);
                let eventEnd = new Date(events[i].event_end);
                if(events[i].event_title === this.state.original_event_title && eventStart.setHours(0,0,0,0) === originalStart.setHours(0,0,0,0) && eventEnd.setHours(0,0,0,0) === originalEnd.setHours(0,0,0,0) && events[i].event_colour === this.state.original_event_colour) {
                    index = i;
                }
            }
            events.splice(index, 1);
            const oldEndEventGroup = {
                monthYear: originalEndRes.data.monthYear,
                events: events
            }
            await axios.post('http://localhost:4000/events/updateMonth/'+originalEndMonthYear, oldEndEventGroup)
        }

        // Add event to new start month
        const startRes = await axios.get('http://localhost:4000/events/getMonth/'+startMonthYear)
        events = startRes.data.events;
        events.push(modifiedEvent);
        const startEventGroup = {
            monthYear: startRes.data.monthYear,
            events: events
        }
        await axios.post('http://localhost:4000/events/updateMonth/'+startMonthYear, startEventGroup)

        // If new start month != new end month, add event to new end month
        if(startMonthYear !== endMonthYear) {
            const endRes = await axios.get('http://localhost:4000/events/getMonth/'+endMonthYear)
            events = endRes.data.events;
            events.push(modifiedEvent);
            const endEventGroup = {
                monthYear: endRes.data.monthYear,
                events: events
            }
            await axios.post('http://localhost:4000/events/updateMonth/'+endMonthYear, endEventGroup)
        }

        // All done - time to reset state, update the calendar, and close the modal
        this.setState({
            orignial_event_title: "",
            orignial_event_start: new Date(),
            orignial_event_end: new Date(),
            orignial_event_colour: "1",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        });

        this.props.updateEvents();
        this.props.closeModal();
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

    async deleteEvent() {
        const originalStart = new Date(this.state.original_event_start);
        const originalEnd = new Date(this.state.original_event_end);

        // Delete original event entry from original start month
        let originalStartMonthYear = "" + (originalStart.getMonth() + 1) + originalStart.getFullYear();
        const originalStartRes = await axios.get('http://localhost:4000/events/getMonth/'+originalStartMonthYear);
        let events = originalStartRes.data.events;
        let index = -1;
        for(let i = 0; i<events.length; i++) {
            if(events[i]._id === this.props.eventId) {
                index = i;
            }
        }
        events.splice(index, 1);
        const oldStartEventGroup = {
            monthYear: originalStartRes.data.monthYear,
            events: events
        }
        await axios.post('http://localhost:4000/events/updateMonth/'+originalStartMonthYear, oldStartEventGroup)

        // If originalStart != originalEnd, delete event entry from original end month
        let originalEndMonthYear = "" + (originalEnd.getMonth() + 1) + originalEnd.getFullYear();
        if(originalStartMonthYear !== originalEndMonthYear) {
            const originalEndRes = await axios.get('http://localhost:4000/events/getMonth/'+originalEndMonthYear);
            events = originalEndRes.data.events;
            index = -1;
            for(let i = 0; i<events.length; i++) {
                let eventStart = new Date(events[i].event_start);
                let eventEnd = new Date(events[i].event_end);
                if(events[i].event_title === this.state.original_event_title && eventStart.setHours(0,0,0,0) === originalStart.setHours(0,0,0,0) && eventEnd.setHours(0,0,0,0) === originalEnd.setHours(0,0,0,0) && events[i].event_colour === this.state.original_event_colour) {
                    index = i;
                }
            }
            events.splice(index, 1);
            const oldEndEventGroup = {
                monthYear: originalEndRes.data.monthYear,
                events: events
            }
            await axios.post('http://localhost:4000/events/updateMonth/'+originalEndMonthYear, oldEndEventGroup)
        }  

        // All done - time to reset state, update the calendar, and close the modal
        this.setState({
            orignial_event_title: "",
            orignial_event_start: new Date(),
            orignial_event_end: new Date(),
            orignial_event_colour: "1",
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        });

        this.props.updateEvents();
        this.props.closeModal();
    }

    getColourOptions() {
        let colourOptions = [];
        for(let i = 1; i<=6; i++) {
            colourOptions.push(<div key={i} className={`colour-option colour-${i} ${this.state.event_colour === ""+i ? "selected-colour" : ""}`} onClick={() => this.onChangeEventColour(""+i)}></div>);
        }
        return(<div className="d-flex">{colourOptions}</div>);
    }

    render() {
        return(
            <div>
                <div className={'event-modal ' + this.state.showClass}>
                    <div className="event-modal-container">
                    <span className="close-button" onClick={this.props.closeModal}>&times;</span>
                        <div className="event-modal-content">
                            <div className="modal-title">Edit Event</div>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Event Name:</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={this.state.event_title}
                                        onChange={this.onChangeEventTitle}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Start Date:</label>
                                    {this.dateTimePickerStart()}
                                </div>
                                <div className="form-group">
                                    <label>End Date:</label>
                                    {this.dateTimePickerEnd()}
                                </div>
                                <div className="form-group">
                                    <label>Event Colour:</label>
                                    {this.getColourOptions()}
                                </div>
                                <div className="form-group d-flex">
                                    <input type="submit" value="Edit Event" className="btn create-event-btn" />
                                    <button className="btn delete-event-btn" onClick={this.deleteEvent}>Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}