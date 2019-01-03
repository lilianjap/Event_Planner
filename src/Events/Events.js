import React, { Component } from 'react';
import './Events.css';
import { Link } from 'react-router-dom';
import {modelInstance} from '../data/EventModel';
import Details from '../Details/Details';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import firebase from "firebase";
import {DB_CONFIG} from "../config.js";

let i;
let start_str = '';
let end_str = '';
let id;
let eventsEmbedded = [];
let eventsPlace = [];
let eventsDataBase

let morningEventList = [];
let afternoonEventList = [];
let eveningEventList = [];


class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
      data: [],
      id: '',
      stateName: window.location.pathname.substring(11,13),
      date: this.props.date,
      enddate: this.props.enddate,
    };

    this.getDetails.bind(this);
  }

  loadData (props) {
    props.date.setHours(props.date.getHours() + 2)
    props.enddate.setHours(props.enddate.getHours() + 2)
    props.enddate.setDate(props.enddate.getDate()+1)
    start_str = props.date.toISOString();
    end_str = props.enddate.toISOString();
    start_str = start_str.substring(0, 19) +'Z';
    end_str = end_str.substring(0,19)+'Z';

    modelInstance.getEventsPerState(props.stateName, start_str, end_str).then(eventsPerState =>
      this.setState({
        status: 'LOADED',
        data: eventsPerState._embedded.events,
        stateName: props.stateName,
        date: props.date,
        enddate: props.enddate,
      }, function(){this.storeInDatabase()})).catch(error =>
          this.setState({
            status: 'ERROR'
          }))

  }

  componentDidMount = () => {
      var dbData = firebase.database().ref('events/' + window.location.pathname.substring(11,23));
      dbData.on('value', (snapshot) => {
        if (snapshot.val() != null) {
          eventsDataBase = snapshot.val()
          this.setState({
            status: 'LOADED',
            data: eventsDataBase.data,
            stateName: this.props.stateName,
            date: this.props.date,
            enddate: this.props.enddate,
          })
      } else {
      this.loadData(this.props)
      }
      });
    }

  getDetails = (event) => {
    modelInstance.setId(event.target.id);
  }

  componentWillUnmount = () => {
    modelInstance.removeObserver(this)
  }

  componentWillReceiveProps = (props) => {
    var dbData = firebase.database().ref('events/' + props.stateName + Intl.DateTimeFormat('sv-SV').format(props.date));
    dbData.on('value', (snapshot) => {
      if (snapshot.val() != null) {
        eventsDataBase = snapshot.val()
        this.setState({
          status: 'LOADED',
          data: eventsDataBase.data,
          stateName: props.stateName,
          date: props.date,
          enddate: props.enddate,
        }, function(){this.forceUpdate()})
    }
    else {
      this.loadData(props)
    }
    });
  }

  storeInDatabase = () => {
    const {data} = this.state
    firebase.database().ref('events/' + this.props.stateName + Intl.DateTimeFormat('sv-SV').format(this.state.date)).set({data});

  }

  currentEventFunc = () => { // HOURS TO SECONDS
    morningEventList.length = 0;
    afternoonEventList.length = 0;
    eveningEventList.length = 0;

    for (i in modelInstance.currentEventList) {
      if (modelInstance.currentEventList[i].dates.start.localTime != undefined) {
        var timeElement = modelInstance.currentEventList[i].dates.start.localTime.split(':')
        var timeInSeconds = (+timeElement[0])*60*60+(+timeElement[1])*60+(+timeElement[2]);
        if (timeInSeconds < 43200) {
          morningEventList.push(modelInstance.currentEventList[i])
        }
        else if (timeInSeconds >= 43200 && timeInSeconds < 64800){
          afternoonEventList.push(modelInstance.currentEventList[i])
        }
        else if (timeInSeconds >= 64800 && timeInSeconds < 86400){
          eveningEventList.push(modelInstance.currentEventList[i])
        }
      }
    }
    modelInstance.morningEventList = morningEventList;
    modelInstance.afternoonEventList = afternoonEventList;
    modelInstance.eveningEventList = eveningEventList;

    this.storeInTimeslots(morningEventList,afternoonEventList,eveningEventList);
  }

  storeInTimeslots = (morning,afternoon,evening) => {
    firebase.database().ref('trueEvents/morning/').set({morning});
    firebase.database().ref('trueEvents/afternoon/').set({afternoon});
    firebase.database().ref('trueEvents/evening/').set({evening});
  }

  update() {
    this.setState({
      data: this.props.data,
      stateName: this.props.stateName,
      date: this.props.date,
      enddate: this.props.enddate,
      })
  }


  render() {
    const {data} = this.state;

    eventsEmbedded.length = 0;
    eventsPlace.length = 0;
    for (i in data) {
      if (data[i].dates.start.localDate == window.location.pathname.substring(13,23)) {

          if (data[i]._embedded) {
            eventsEmbedded.push(data[i])
            modelInstance.currentEventList = eventsEmbedded;
          }
          else if (data[i].place) {
            eventsPlace.push(data[i])
            modelInstance.currentEventList = eventsPlace;
          }
        }
      }

    switch (this.state.status) {
      case 'INITIAL':
        return (
          <div className='Events'>
          <br/>
          <br/>
          <center>
            <div className="loader"> </div>
          </center>
          </div>
        )
        break;
      case 'LOADED':

        if (eventsEmbedded.length > 0 || eventsPlace.length > 0) {
          return (
              <div className ="Events mt-3">
                  <div id='Events'>
                  { eventsEmbedded.length > 0 ? (
                    <Carousel showArrows={true} >
                          {eventsEmbedded.map((item, index) => {
                                  let event = {
                                    title: item.name,
                                    description: item.info,
                                    location: item._embedded ? item._embedded.venues[0].name : item.place[0].address,
                                    startTime: item.sales.public.startDateTime,
                                    endTime: item.sales.public.startDateTime
                                  };
                                  return ( //I varje li-element av carousel-slider
                                    <div key={item.id}>
                                        <img src={item.images[0].url}/>
                                        <div className="legend">
                                          <span key={item.id} onClick={this.getDetails} >
                                            <Link to={"/details/"+item.id}><b id={item.id}>{item.name}</b> <br/>
                                            <button id={item.id} value='1' className='removeEvent btn btn-success ' >
                                              Details
                                            </button>
                                            </Link><br/>
                                          </span>
                                         {item.dates.start.localTime}<br/>
                                         {item._embedded.venues[0].city.name}, {item._embedded.venues[0].state.name}
                                        </div>
                                  </div>
                                  );
                              }
                            )}
                      </Carousel>
                    ) : (
                      <Carousel showArrows={true} showThumbs={true}>
                             {eventsPlace.map((item, index) => {
                               let event = {
                                 title: item.name,
                                 description: item.info,
                                 location: item._embedded ? item._embedded.venues[0].name : item.place[0].address,
                                 startTime: item.sales.public.startDateTime,
                                 endTime: item.sales.public.startDateTime
                               };
                               return ( //I varje li-element av carousel-slider
                                <div key={item.id}>
                                  <img src={item.images[0].url}/>
                                      <div className='legend'>
                                        <span key={item.id} onClick={this.getDetails}>
                                          <Link to={'/details/'+item.id}><b id={item.id}>{item.name}</b></Link><br/>
                                        </span>
                                      {item.dates.start.localTime}<br/>
                                      item.place.city.name}, {item.place.state.name}
                                      </div>
                                  </div>
                                );
                                }
                                )}
                      </Carousel>
                            )
                  }
                  </div>

                  <center>
                    <Link to={"/search/" + window.location.pathname.substring(11,23)}>
                        <button className="seeTime btn btn-success mt-5 btn-l" onClick={this.currentEventFunc}>Time Schedule <i className="fa fa-angle-right"></i></button>
                    </Link>
                  </center>


              </div>
            ) }
        break;
      default:
        return (
          <div className='Events'>
              <div id='Events' className='col-sm-8'>
                <br/>
                <div className='failed'> <b>No events were found on this date at this location, please try again.</b> </div>
              </div>
          </div>
        )
        break;

}
      return (
        <div className="Events">

        </div>
      )

  }

}

export default Events;
