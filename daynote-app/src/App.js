import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import './App.css';

import ParentComponent from "./components/ParentComponent"
import CalendarComponent from "./components/CalendarComponent/CalendarComponent";
import NotesComponent from "./components/NotesComponent/NotesComponent";
import AddNoteComponent from "./components/NotesComponent/AddNoteComponent";
import EditEventModalComponent from "./components/ModalComponents/EditEventModalComponent";

function App() {
  return (
    /*<Router>
      <Route path={["/"]} exact component={ParentComponent}/>
    </Router>*/
    <ParentComponent/>
  );
}

export default App;
