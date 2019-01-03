import React, { Component } from 'react';
import { modelInstance } from '../data/EventModel';
import Events from '../Events/Events';
import './WhereWhen.css';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import date from 'react-calendar';
import firebase from "firebase";
import {DB_CONFIG} from "../config.js"
import {withRouter} from "react-router-dom"

let enddate = new Date();
let i;
let stateChanged = false;
let dateChanged = false;

class WhereWhen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
      stateName: window.location.pathname.substring(11,13),
      date: new Date(),
      enddate: new Date(),
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening()
    }

    this.searchState.bind(this);
  }
  componentDidMount = () => {
    modelInstance.addObserver(this)
  }

  searchState = (event) => {
    this.setState({
      stateName: event.target.value }, function() {
      this.stateChanged = true
      this.setPathName()
    });
  }

  searchFilter = (event) => {
    this.setState({ filter: event.target.value })
  }

  setPathName() {
  if (this.stateChanged == true || this.dateChanged == true) {
    window.history.pushState(null, '', "/wherewhen/" + this.state.stateName + Intl.DateTimeFormat('sv-SV').format(this.state.date));
    }
  }

  setDate = date => {
    enddate.setTime(date.getTime());
    enddate.setHours(enddate.getHours() + 24);

          if (this.state.morning != undefined) {
              modelInstance.removeEvent(1)
          } else if (this.state.afternoon != undefined) {
            modelInstance.removeEvent(2)
          } else if (this.state.evening != undefined) {
            modelInstance.removeEvent(3)
          }
    

    this.setState({
      date: date,
      enddate: enddate,
      morning: [],
      afternoon: [],
      evening: []
    }, function(){
      this.dateChanged = true
      this.setPathName()
    })
  }

  update() {
    this.setState({
      date: date,
      enddate: enddate,
      stateName: window.location.pathname.substring(11,13),
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening()
    })
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this)
  }

  render() {
    const today = new Date();
    return (
      <div className='WhereWhen'>
        <div className="container">
          <div className='row'>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <Calendar className='calendar'
                minDate={today}
                onChange={this.setDate}
                value={this.state.date}
              />
              <div className='btnDiv'>
              <Link to="/">
                <button className="backHome btn btn-success mt-5 btn-l"><i className="fa fa-angle-left"></i> Back to Home</button>
              </Link>
              </div>

            </div>
            <div id="searchInput" className='col-xl-8 col-lg-8 col-md8 col-sm-8'>
              <form onSubmit={this.searchSubmit}>
                    <div className="row">
                        <div className="col">
                          <select id="typeState" name="types" className="form-control mb-2 mr-sm-2" placeholder="Select state" value={this.state.stateName} onChange={this.searchState}>
                            <option value="">Select state</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>

                          </select>
                        </div>
                    </div>
              </form>

              <Events model={this.props.model} stateName={this.state.stateName} date={this.state.date} enddate={this.state.enddate}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhereWhen;
