import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CalendarComponent from "./CalendarComponent/CalendarComponent";
import NotesComponent from "./NotesComponent/NotesComponent";
import AddNoteComponent from "./NotesComponent/AddNoteComponent";
import EditEventModalComponent from "./ModalComponents/EditEventModalComponent";
import axios from 'axios';

export default class ParentComponent extends Component {
    constructor(props) {
        super(props);

        // include functions for changing dates
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.getMonthString = this.getMonthString.bind(this);
        this.goToToday = this.goToToday.bind(this);
        this.getDailyNote = this.getDailyNote.bind(this);

        this.state = {
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            dailyNotes: [],
        };
    }

    componentDidMount() {
        this.getDailyNote();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.month !== this.state.month || prevState.year !== this.state.year) {
            this.getDailyNote();
        }
    }

    getMonthString(month) {
        const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        return months[month];
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

    goToToday() {
        this.setState({
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        })
    }

    async getDailyNote() {
        let monthYear = "" + (this.state.month+1) + this.state.year;
        const monthExists = await axios.get('http://localhost:4000/DailyNotes/exists/'+monthYear);
        if (monthExists.data) {
            const dailyNotesRes = await axios.get('http://localhost:4000/DailyNotes/getMonth/'+monthYear);
            this.setState({
                dailyNotes: dailyNotesRes.data.dailyNotes,
            })
        }
        else {
            this.setState({
                dailyNotes: [],
            })
        }
    }
    
    render() {
        return (
            <div className="container-fluid">
              <div className="row">
                <Router>
                  <div className="calendar-component">
                    <Route 
                        exact path={["/", "/addNote", "/addNote/:id", "/addDailyNote/:date", "/addDailyNote/:id/:date"]}
                        render={(props) => (
                            <CalendarComponent day={this.state.day} month={this.state.month} year={this.state.year} prevMonth={this.prevMonth} nextMonth={this.nextMonth} goToToday={this.goToToday} dailyNotes={this.state.dailyNotes}/>
                        )}    
                    />    
                  </div>
                  <div className="notes-component">
                    <Route 
                        exact path="/"
                        render={(props) => (
                            <NotesComponent month={this.state.month} year={this.state.year} dailyNotes={this.state.dailyNotes}/>
                        )}
                    />
                    <Route 
                        exact path={["/addNote", "/addNote/:id", "/addDailyNote/:date", "/addDailyNote/:id/:date"]} 
                        render={(routeParams) => (
                            <AddNoteComponent routeParams={routeParams} month={this.state.month} year={this.state.year} getDailyNote={this.getDailyNote} dailyNotes={this.state.dailyNotes}/>
                        )}
                    />
                  </div>
                </Router>
              </div>
            </div>
        );
    }
}

