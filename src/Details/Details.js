import React, { Component } from 'react';
import './Details.css';
import { Link } from 'react-router-dom';
import { modelInstance } from '../data/EventModel';
import firebase from "firebase";
import {DB_CONFIG} from "../config.js";

let detailDataBase;

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
      eventDetails: [],
      stateName: modelInstance.getStateCode()
    };
  }

  loadData(props) {
    modelInstance.getEventDetails(modelInstance.getId()).then(eventDetail =>
      this.setState({
        status: 'LOADED',
        eventDetails: eventDetail
      }, function(){this.storeInDatabase()})).catch(error =>
        this.setState({
          status: 'ERROR'
        }))


  }

  storeInDatabase = () => {
    const {eventDetails} = this.state
    firebase.database().ref('details/' + modelInstance.getId()).set({eventDetails});

  }

  componentDidMount = (props) => {
      modelInstance.addObserver(this);
      var dbData = firebase.database().ref('details/' + window.location.pathname.substring(9,window.location.pathname.length));
      dbData.on('value', (snapshot) => {
        if (snapshot.val() != null) {
          detailDataBase = snapshot.val()
          this.setState({
            status:'LOADED',
            eventDetails: detailDataBase.eventDetails
          })
      }
      else {
        this.loadData(props)
      }
      });
    }

  componentWillUnmount = () => {
    modelInstance.removeObserver(this)
  }

  update() {
    this.setState({
      eventDetails: this.state.eventDetails
    })
  }


  render() {
    switch (this.state.status) {
      case 'INITIAL':

        return (
          <div className='Details'>
            <center>
              <div className="loader"> </div>
            </center>
          </div>
        )
        break;

      case 'LOADED':
        const { eventDetails } = this.state;
        return (
          <div>
            <div className="Details">
              <div className="container">
                <div className="row">
                  { eventDetails._embedded ? (
                    <div className='col'>
                    <div className="card" >
                      <h3 className="card-header  bg-grey">
                          {eventDetails._embedded.events[0].name}
                      </h3>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6">
                            <img alt='eventImg' className="img-fluid" id='eventImg' src={eventDetails._embedded.events[0].images[0].url}></img>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-group">
                              <li className="list-group-item"><b><i className="fa fa-home"></i> Venue: </b>{eventDetails._embedded.events[0]._embedded.venues[0].name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-home"></i> City: </b>{eventDetails._embedded.events[0]._embedded.venues[0].city.name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-home"></i> State: </b>{eventDetails._embedded.events[0]._embedded.venues[0].state.name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-clock-o"></i> Time: </b>{eventDetails._embedded.events[0].dates.start.localTime}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-calendar"></i> Date: </b>{eventDetails._embedded.events[0].dates.start.localDate}<br /></li>
                              <li className="list-group-item"><a href={eventDetails._embedded.events[0].url} target='_blank' className="text-success"><b><i className="fa fa-globe"></i> Visit website</b></a><br /></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to={"/wherewhen/" + this.state.stateName + eventDetails._embedded.events[0].dates.start.localDate}>
                      <center>
                        <button className="backHome btn btn-success mt-5 btn-l" ><i className="fa fa-angle-left"></i> Back to Search</button>
                      </center>
                    </Link>
                  </div>
                  ) : (
                  <div className='col'>
                    <div className="card" >
                      <h3 className="card-header  bg-grey">
                          {eventDetails.place.events[0].name}
                      </h3>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6">
                            <img alt='eventImg' className="img-fluid" id='eventImg' src={eventDetails.place.events[0].images[0].url}></img>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-group">
                              <li className="list-group-item"><b><i className="fa fa-home"></i> Venue: </b>{eventDetails.place.events[0].place.venues[0].name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-home"></i> City: </b>{eventDetails.place.events[0].place.venues[0].city.name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-home"></i> State: </b>{eventDetails.place.events[0].place.venues[0].state.name}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-clock-o"></i> Time: </b>{eventDetails.place.events[0].dates.start.localTime}<br /></li>
                              <li className="list-group-item"><b><i className="fa fa-calendar"></i> Date: </b>{eventDetails.place.events[0].dates.start.localDate}<br /></li>
                              <li className="list-group-item"><a href={eventDetails.place.events[0].url} target='_blank' className="text-success"><b><i className="fa fa-globe"></i> Visit website</b></a><br /></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to={"/wherewhen/" + this.state.stateName + eventDetails.place.events[0].dates.start.localDate}>
                      <center>
                        <button className="backHome btn btn-success mt-5 btn-l" ><i className="fa fa-angle-left"></i> Back to Search</button>
                      </center>
                    </Link>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        )

        break;
      default:
        return (
          <div className='Details'>
            <div id='details' className='col-sm-8'>
              <div className='failed'> <b>Failed to load data, please try again</b> </div>
            </div>
          </div>
        )
        break;
    }


    return (

      <nav className="classnavbar navbar-light">
        <div className="Details">
        </div>
      </nav>
    )
  }
}

export default Details;
