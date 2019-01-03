import React, { Component } from 'react';
import './SelectEvent.css';
import Sidebar from '../Sidebar/Sidebar';
import { modelInstance } from '../data/EventModel';
import { Link } from 'react-router-dom';
import date from 'react-calendar';
import { Modal } from 'react-bootstrap';
import firebase from "firebase";
import {DB_CONFIG} from "../config.js";

let i;

class SelectEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateName: modelInstance.getStateCode(),
      date: this.props.state,
      morning: [],
      afternoon: [],
      evening: []
    }
  }

  componentDidMount = () => {
    modelInstance.addObserver(this)

    var morning = firebase.database().ref('trueEvents/morning/');
    var afternoon = firebase.database().ref('trueEvents/afternoon/');
    var evening = firebase.database().ref('trueEvents/evening/');

    morning.on('value', (snapshot) =>  {
        let morningDB = snapshot.val();
        this.setState({
          morning: morningDB
        })
    })

    afternoon.on('value', (snapshot) =>  {
        let afternoonDB = snapshot.val();
        this.setState({
          afternoon: afternoonDB
        })
    })

    evening.on('value', (snapshot) =>  {
        let eveningDB = snapshot.val();
        this.setState({
          evening: eveningDB
        })
    })

  }

  searchstate = (event) => {
    this.setState({ stateName: event.target.value });
  }

  searchType = (event) => {
    this.setState({ type: event.target.value });
  }

  searchFilter = (event) => {
    this.setState({ filter: event.target.value })
  }


  handleAdd = (e) => {
    for (i in modelInstance.currentEventList) {
      if (e.target.id == modelInstance.currentEventList[i].id || e.target.parentNode.id == modelInstance.currentEventList[i].id) {
        if (e.target.value === 1 && modelInstance.scheduleMorning.length > 1){
          modelInstance.addEvent(modelInstance.currentEventList[i], e.target.value)
          break
        }

        if (e.target.value === 2 && modelInstance.scheduleAfternoon.length > 1){
          modelInstance.addEvent(modelInstance.currentEventList[i], e.target.value)
          break
        }

        if (e.target.value === 3 && modelInstance.scheduleEvening.length > 1){
          modelInstance.addEvent(modelInstance.currentEventList[i], e.target.value)
          break
        }

        if (e.target.value) {
          modelInstance.addEvent(modelInstance.currentEventList[i], e.target.value)
          return;

        } if (e.target.parentNode.value) {
          modelInstance.addEvent(modelInstance.currentEventList[i], e.target.parentNode.value)
        }
      }
    }


  }

  checkList = (e) => {
    if (modelInstance.getMorning().length == 0 && modelInstance.getAfternoon().length == 0 && modelInstance.getEvening().length == 0){
        e.preventDefault()
        alert("Please choose events!")
      }
    }
  newSchedule = () => {
    modelInstance.scheduleMorning = [];
    modelInstance.scheduleAfternoon = [];
    modelInstance.scheduleEvening = [];

  }

  update() {
    this.setState({
      date: date,
    })
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this)
  }

  render() {
    const {morning} = this.state;
    const {afternoon} = this.state;
    const {evening} = this.state;

    return (
      <div className="SelectEvent" >
        <div className='container'>
          <div className='row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 center left'>
              <h4 className="mb-4 text-white"> Click on timeslot to see events on {window.location.pathname.substring(10,23)}</h4>
              <div id="accordion" className="accordion" role="tablist" aria-multiselectable="true">
                <div className="card">
                  <div className="card-header bg-grey text-white text-center" role="tab" id="headingOne">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" className="text-white" aria-controls="collapseOne">
                      Morning Events
                    </a>
                  </div>
                  <div id="collapseOne" className="collapse show " role="tabpanel" aria-labelledby="headingOne">
                    { (morning && morning.length != 0) ? (
                      morning.morning.map(event =>
                        <div key={event.id} className="card-block">
                          <div className="container-fluid py-2">
                            <div className="row">
                          <div className='col-sm-3 m-auto'>
                                <div className="font1">
                                  <i className="fa fa-clock-o"> {event.dates.start.localTime} </i>  </div>
                          </div>
                          <div className='col-sm-7'>
                            <b>{event.name}</b>
                            {event.place ? (
                              <div className="text-muted"><i className="fa fa-map-marker"></i> {event.place.address.line1}</div>
                            ) : (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {event._embedded.venues[0].address.line1}</div>
                              )
                            }
                            { event.priceRanges ? (
                              <div>Price range: {event.priceRanges[0].min}-{event.priceRanges[0].max} {event.priceRanges[0].currency} </div>
                            ) : (<i> Cost is not available at the moment</i>)
                            }
                          </div>
                            <div className="OneEvent col-sm-2 m-auto modal-container" id={event.id} >
                              <button id={event.id} value='1' className='removeEvent btn btn-success ' onClick={this.handleAdd}>
                                Add
                              </button>
                            </div>
                        </div>
                        </div>
                        </div>
                      )
                    ) : (
                        <ul className="list-group">
                          <li className="list-group-item"><b> No events were found at this time </b></li>
                        </ul>
                      )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header bg-grey text-white text-center" role="tab" id="headingTwo">
                    <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" className="text-white" aria-expanded="false" aria-controls="collapseTwo">
                      Afternoon Events
                    </a>
                  </div>
                  <div id="collapseTwo" className="collapse" role="tabpanel" aria-labelledby="headingTwo">
                    { (afternoon && afternoon.length != 0) ? (
                      afternoon.afternoon.map(event =>
                        <div key={event.id} className="card-block ">
                          <div className="container-fluid py-2">
                            <div className="row">
                              <div className='col-sm-3 m-auto' >
                                <div className="font1">
                                  <i className="fa fa-clock-o"> {event.dates.start.localTime} </i>
                                </div>
                              </div>
                              <div className='col-sm-7'>
                                <b>{event.name}</b>
                                {event.place ? (
                                  <div className="text-muted"><i className="fa fa-map-marker"></i> {event.place.address.line1}</div>
                                ) : (
                                    <div className="text-muted"><i className="fa fa-map-marker"></i> {event._embedded.venues[0].address.line1}</div>
                                  )
                                }
                                { event.priceRanges ? (
                                  <div>Price range: {event.priceRanges[0].min}-{event.priceRanges[0].max} {event.priceRanges[0].currency}</div>
                                ) : (<i> Cost is not available at the moment</i>)}                              </div>
                              <div className="OneEvent col-sm-2 m-auto" id={event.id}>
                                <button id={event.id} value='2' className='removeEvent btn btn-success' onClick={this.handleAdd}>
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      )
                    ) : (
                        <ul className="list-group">
                          <li className="list-group-item"><b> No events were found at this time </b></li>
                        </ul>
                      )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header bg-grey text-white text-center" role="tab" id="headingThree">
                    <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" className="text-white" aria-expanded="false" aria-controls="collapseThree">
                      Evening Events
                    </a>
                  </div>
                  <div id="collapseThree" className="collapse" role="tabpanel" aria-labelledby="headingThree">
                    { (evening && evening.length != 0) ? (
                      evening.evening.map(event =>
                        <div key={event.id} className="card-block">
                          <div className="container-fluid py-2">
                            <div className="row">
                              <div className='col-sm-3 m-auto'>
                                <div className="font1">
                                  <i className="fa fa-clock-o"> {event.dates.start.localTime} </i>
                                </div>
                              </div>
                              <div className='col-sm-7'>
                                <b>{event.name}</b>
                                {event.place ? (
                                  <div className="text-muted"><i className="fa fa-map-marker"></i>event.place.address.line1</div>
                                ) : (
                                    <div className="text-muted"><i className="fa fa-map-marker"></i>{event._embedded.venues[0].address.line1}</div>
                                  )
                                }
                                { event.priceRanges ? (
                                  <div>Price range: {event.priceRanges[0].min}-{event.priceRanges[0].max} {event.priceRanges[0].currency}</div>
                                ) : (<i> Cost is not available at the moment</i>)}
                              </div>
                              <div className="OneEvent col-sm-2 m-auto" id={event.id}>
                                <button id={event.id} value='3' className='removeEvent btn btn-success' onClick={this.handleAdd}>
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                        <ul className="list-group">
                          <li className="list-group-item"><b> No events were found at this time </b></li>
                        </ul>
                      )}
                  </div>
                </div>

              </div>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <Sidebar model={this.props.model} date = {this.props.state} />
            </div>
          </div>

          <div className='btnDiv'>
              <Link to={"/wherewhen/" + window.location.pathname.substring(8,23)}>
                <button className="backHome btn btn-success mt-5 btn-l" onClick={this.newSchedule}><i className="fa fa-angle-left"></i> Back</button>
              </Link>
              <Link to={"/overview/" + window.location.pathname.substring(8,23)}>
                <button id='confirm' onClick={this.checkList} className="btn btn-success  mt-5">Full schedule details <i className="fa fa-angle-right"></i></button>
              </Link>
          </div>

        </div>
      </div>
    );
  }
}


export default SelectEvent;
