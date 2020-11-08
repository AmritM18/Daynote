import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import './App.css';

import CalendarComponent from "./components/CalendarComponent/CalendarComponent";
import NotesComponent from "./components/NotesComponent/NotesComponent";
import AddNoteComponent from "./components/NotesComponent/AddNoteComponent";
import EditEventModalComponent from "./components/ModalComponents/EditEventModalComponent";

function App() {
  return (
    <div className="container-fluid">
      <div className="row mt-2">
        <Router>
          <div className="col-9">
            <Route path={["/", "/addNote"]} exact component={CalendarComponent}/>
            <Route path="/edit/:id" component={EditEventModalComponent}/>
          </div>
          <div className="col-3 border-left">
          <h1 className="text-center">My Notes</h1>
          <Route path={["/", "/edit/:id"]} exact component={NotesComponent}/>
          <Route path="/addNote" component={AddNoteComponent}/>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
