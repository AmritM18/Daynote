import React, {Component} from 'react';
import axios from 'axios';
import AddEventModalComponent from "../ModalComponents/AddEventModalComponent";
import { Link } from 'react-router-dom';
import '../../App.css';

export default class CalendarComponent extends Component {
    constructor(props) {
        super(props);

        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.getMonthString = this.getMonthString.bind(this);
        this.getMonthEvents = this.getMonthEvents.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.getColourClass = this.getColourClass.bind(this);

        this.state = {
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            events: []
        };
    }

    // retrieves all events and stores them in state
    componentDidMount() {
        this.fetchEvents();
    }

    // TODO AS WELL
    fetchEvents() {
        this.setState({
            events: []
        });

        axios.get('http://localhost:4000/events/')
            .then(response => {
                this.setState(state => {
                    const obj = response.data;
                    const fetchedEvents = state.events.concat(obj);
               
                    return {
                      events: fetchedEvents
                    };
                  });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getColourClass(colour) {
        let className;
        switch (colour) {
            case "5":
                className = "colour-5";
                break;
            case "4":
                className = "colour-4";
                break;
            case "3":
                className = "colour-3";
                break;
            case "2":
                className = "colour-2";
                break;
            case "1":
                className = "colour-1";
                break;
            default:
                className = "";
        }
        return className;
    }

    getTime(date) {
        let hours = date.getHours();
        let midday;
        if(hours > 12) {
            midday = "pm";
            hours -= 12;
        }
        else if(hours === 0) {
            hours = 12;
            midday = "am";
        }
        else {
            midday = "am";
        }
        let minutes = date.getMinutes();
        let time;
        if(minutes > 0) {
            time = hours + ":" + minutes + midday;
        }
        else {
            time = hours + midday;
        }
        return time;
    }

    getEvents(date, monthEvents) {
        const key = date.getDate()-1;
        let events = [];
        for(let i = 0; i<monthEvents[key].length; i+=2) {
            let message = "";
            if(monthEvents[key][i+1] === "S") {
                let startDate = new Date(monthEvents[key][i].event_start);
                let time = this.getTime(startDate);
                message =  " at " + time;
            }
            else if(monthEvents[key][i+1] === "E") {
                message = " Ends";
            }
            events.push(<Link to={"/edit/"+monthEvents[key][i]._id} key={i} className={this.getColourClass(monthEvents[key][i].event_colour)}>{monthEvents[key][i].event_title}{message}</Link>);
        }
        return <div key={key}>{events}</div>;
    }

    getMonthEvents(totalDays) {
        let monthEvents = [];
        for(let i = 0; i<totalDays; i++) {
            let events = [];
            monthEvents.push(events);
        }

        let currentDate = new Date(this.state.year,this.state.month,this.state.day);

        this.state.events.map(function(currentEvent, i) {
            let eventStartDate = new Date(currentEvent.event_start);
            let eventEndDate = new Date(currentEvent.event_end);
            eventStartDate.setHours(0,0,0,0);
            eventEndDate.setHours(0,0,0,0);

            if(eventStartDate.getFullYear() === currentDate.getFullYear() && eventStartDate.getMonth() === currentDate.getMonth()) {
                monthEvents[eventStartDate.getDate()-1].push(currentEvent);
                monthEvents[eventStartDate.getDate()-1].push("S");
            }
            if(eventEndDate.getFullYear() === currentDate.getFullYear() && eventEndDate.getMonth() === currentDate.getMonth()) {
                if(eventStartDate.getDate() !== eventEndDate.getDate()) {
                    monthEvents[eventEndDate.getDate()-1].push(currentEvent);
                    monthEvents[eventEndDate.getDate()-1].push("E");
                }
            }
        });

        // PRINTS EVENTS ON EVERY DAY THEY OCCUR
        /*let today = new Date(this.state.year,this.state.month,this.state.day);
        let events = [];

        this.state.events.map(function(currentEvent, i) {
            let eventStartDate = new Date(currentEvent.event_start);
            let eventEndDate = new Date(currentEvent.event_end);

            if(eventStartDate.getFullYear() <= today.getFullYear() && today.getFullYear() <= eventEndDate.getFullYear()) {
                if(eventStartDate.getMonth() <= today.getMonth() && today.getMonth() <= eventEndDate.getMonth()) {
                    events.push(currentEvent);
                }
            }
        });

        for(let i = 1; i<=totalDays; i++) {
            let currentDate = new Date(this.state.year,this.state.month,i);
            currentDate.setHours(0,0,0,0);
            for(let j = 0; j<events.length; j++) {
                let eventStartDate = new Date(events[j].event_start);
                let eventEndDate = new Date(events[j].event_end);
                eventStartDate.setHours(0,0,0,0);
                eventEndDate.setHours(0,0,0,0);
                if(eventStartDate <= currentDate && currentDate <= eventEndDate) {
                    monthEvents[i-1].push(events[j]);
                }
            }
        }*/

        return monthEvents;
    }

    renderDates = () => {
        // calendar = tr rows
        let calendar = [];

        let date = new Date(this.state.year,this.state.month+1,this.state.day);
        let firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        let numDays = lastDay.getDate();
        let startDay = firstDay.getDay();
        let daysLeft = startDay;
        let totalDays = numDays + startDay;

        let monthEvents = this.getMonthEvents(totalDays);

        for (let i = 0; i < (totalDays/7); i++) {
            let children = [];
            for (let j = 0; j < 7; j++) {
                if(daysLeft) {
                    children.push(<td key={j}></td>);
                    daysLeft--;
                }
                else {
                    if(numDays) {
                        let date = i * 7 + (j - startDay + 1);
                        children.push(<td key={date + 7}>{`${date}`}<br/>{this.getEvents(new Date(this.state.year,this.state.month,date),monthEvents)}</td>);
                        numDays--;
                    }
                    else {
                        children.push(<td key={date + j}></td>);
                    }
                }
            }
            calendar.push(<tr key={i}>{children}</tr>);
        }

        return calendar;
    }

    prevMonth() {
        if(this.getMonthString(this.state.month) === "January") {
            this.setState({
                month: this.state.month + 11,
                year: this.state.year - 1
            });
        }
        else {
            this.setState({
                month: this.state.month - 1
            });
        }
    }

    nextMonth() {
        if(this.getMonthString(this.state.month) === "December") {
            this.setState({
                month: this.state.month - 11,
                year: this.state.year + 1
            });
        }
        else {
            this.setState({
                month: this.state.month + 1
            });
        }
    }

    getMonthString(month) {
        const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        return months[month];
    }

    render() {
        return(
            <div>
                <div className="d-flex justify-content-between">
                    <button className="btn" onClick={this.prevMonth}>Prev</button>
                    <h1 className="text-center">{`${this.getMonthString(this.state.month)} ${this.state.year}`}</h1>
                    <button className="btn" onClick={this.nextMonth}>Next</button>
                </div>

                <AddEventModalComponent updateEvents={this.fetchEvents} />
                
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Sunday</th>
                            <th scope="col">Monday</th>
                            <th scope="col">Tuesday</th>
                            <th scope="col">Wednesday</th>
                            <th scope="col">Thursday</th>
                            <th scope="col">Friday</th>
                            <th scope="col">Saturday</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderDates() }
                    </tbody>
                </table>
            </div>
        );
    }
}