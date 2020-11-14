import React, {Component} from 'react';
import { Editor } from '@tinymce/tinymce-react'; 
import '../../App.css';
import { Link } from 'react-router-dom';
import "react-datetime/css/react-datetime.css";

export default class EditTodo extends Component {

    //constructor(props) {
        //super(props);

        /*this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventTitle = this.onChangeEventTitle.bind(this);
        this.onChangeEventStart = this.onChangeEventStart.bind(this);
        this.onChangeEventEnd = this.onChangeEventEnd.bind(this);
        this.onChangeEventColour = this.onChangeEventColour.bind(this);
        this.dateTimePickerStart = this.dateTimePickerStart.bind(this);
        this.dateTimePickerEnd = this.dateTimePickerEnd.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        this.state = {
            event_title: "",
            event_start: new Date(),
            event_end: new Date(),
            event_colour: "1"
        }*/
    //}

    /*componentDidMount() {
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
                    event_title: "",
                    event_start: new Date(),
                    event_end: new Date(),
                    event_colour: "1"
                });
        
                window.location.href = "/";
            })
            .catch(err => console.log(err));
    }

    deleteEvent() {
        axios.delete('http://localhost:4000/events/remove/'+this.props.match.params.id)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));

        window.location.href = "/";
    }

    dateTimePickerStart() {
        let inputProps = {
            value: this.state.event_start
        };
        return <Datetime onChange={this.onChangeEventStart} inputProps={inputProps} />;
    }

    dateTimePickerEnd() {
        let inputProps = {
            value: this.state.event_end
        };
        return <Datetime onChange={this.onChangeEventEnd} inputProps={inputProps} />;
    }*/

    render() {
        return(
            <div>
                <p className="month">Add Note</p>
                <form>
                    <div className="form-group">
                        <label>Title </label>
                        <input 
                            type="text" 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Note </label>
                        <Editor
                            apiKey="qapv6hfnxtm7zkn4x2h1alasz86je1rcynforifaa49w5l34"
                            value=" "
                            init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image', 
                                'charmap print preview anchor help',
                                'searchreplace visualblocks code',
                                'insertdatetime media table paste wordcount'
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic | \
                                alignleft aligncenter alignright | \
                                bullist numlist outdent indent | help'
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary mr-2" />
                        <Link to="/" className="btn btn-primary">Cancel</Link>
                    </div>
                </form> 
            </div>
        );
    }
}