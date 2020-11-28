import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CalendarComponent from "./CalendarComponent/CalendarComponent";
import NotesComponent from "./NotesComponent/NotesComponent";
import AddNoteComponent from "./NotesComponent/AddNoteComponent";
import EditEventModalComponent from "./ModalComponents/EditEventModalComponent";

export default class ParentComponent extends Component {
    constructor(props) {
        super(props);

        // include functions for changing dates
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.getMonthString = this.getMonthString.bind(this);
        this.goToToday = this.goToToday.bind(this);

        this.state = {
            day: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        };
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
    
    //render={(props) => (

    //)}
    render() {
        return (
            <div className="container-fluid">
              <div className="row mt-2">
                <Router>
                  <div className="col-9">
                    <Route 
                        exact path={["/", "/addNote", "/addNote/:id"]}
                        render={(props) => (
                            <CalendarComponent day={this.state.day} month={this.state.month} year={this.state.year} prevMonth={this.prevMonth} nextMonth={this.nextMonth} goToToday={this.goToToday}/>
                        )}    
                    />    
                  </div>
                  <div className="col-3 border-left">
                  <Route 
                    exact path="/"
                    render={(props) => (
                        <NotesComponent month={this.state.month} year={this.state.year}/>
                    )}
                  />
                  <Route path={["/addNote", "/addNote/:id"]} exact component={AddNoteComponent}/>
                  </div>
                </Router>
              </div>
            </div>
        );
    }

    /*
    render() {
        return (
            <div className="container-fluid">
              <div className="row mt-2">
                  <div className="col-9">
                    <CalendarComponent/>
                  </div>
                  <div className="col-3 border-left">
                  component={NotesComponent}
                    <NotesComponent/>
                    <AddNoteComponent/>
                  </div>
              </div>
            </div>
        );
    }*/
}

