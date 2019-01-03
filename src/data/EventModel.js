import firebase from "firebase";
import {DB_CONFIG} from "../config.js";
import apiConfig  from "../eventKey.js";

const EventModel = function () {
  let observers = [];
  let scheduleMorning = [];
  let scheduleAfternoon = [];
  let scheduleEvening = [];
  let timeDivideSchedule = [];
  let currentEventList = [];
  let i;
  let state = '';
  let startTime;
  let endTime;
  let id;
  let stateCode;
  let key = apiConfig.event_api_key;


  this.setId = function(id) {
    localStorage.setItem("ID", id);
    notifyObservers();
  };

  this.getId = function() {
    if (localStorage.getItem("ID")){
      return localStorage.getItem("ID");
      }
    };

  this.setStateCode = function(stateCode) {
    localStorage.setItem("stateCode", stateCode);
    notifyObservers();
  };

  this.getStateCode = function() {
    if (localStorage.getItem("stateCode")){
      return localStorage.getItem("stateCode");
      }
    };

  this.addEvent = function(event, value) {
    if (value == 1) {
      if (scheduleMorning.length != 0){
        alert('You can only choose one event per timeslot')
        return true
      } else {
        firebase.database().ref('scheduledEvents/morning/').set({event});
        let morning = firebase.database().ref('scheduledEvents/morning/');
        morning.on('value', (snapshot) => {
          scheduleMorning = snapshot.val().event
        })
      }
    } else if (value == 2) {
      if (scheduleAfternoon.length != 0) {
        alert('You can only choose one event per timeslot')
        return true
      } else {
        firebase.database().ref('scheduledEvents/afternoon/').set({event});
        let afternoon = firebase.database().ref('scheduledEvents/afternoon/');
        afternoon.on('value', (snapshot) => {
          scheduleAfternoon = snapshot.val().event
        })
      }
     } else {
        if (scheduleEvening.length != 0){
          alert('You can only choose one event per timeslot')
          return true
        } else {
          firebase.database().ref('scheduledEvents/evening/').set({event});
          let evening = firebase.database().ref('scheduledEvents/evening/');
          evening.on('value', (snapshot) => {
            scheduleEvening = snapshot.val().event
          })
        }
      }
    notifyObservers();
    }

  this.getMorning = function() {
      return scheduleMorning;
  }
  this.getAfternoon = function() {
      return scheduleAfternoon;
  }
  this.getEvening = function() {
      return scheduleEvening;
  }

  this.eventTimeDivide = function(event) {
    timeDivideSchedule.push(event);
    notifyObservers();
  }


  this.removeEvent = function(value){
    if (value == 1) {
      scheduleMorning = [];
      notifyObservers();
      return scheduleMorning;
    }
    else if (value == 2) {
      scheduleAfternoon = [];
      notifyObservers();
      return scheduleAfternoon;
    }
    else {
      scheduleEvening = [];
      notifyObservers();
      return scheduleEvening;
    }

}

  // API Calls


  this.getEventsPerState = function (state, startTime, endTime) {
    let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey='+ key + '&stateCode=' + state + '&startDateTime=' + startTime + '&endDateTime=' + endTime + '&size=30';
    return fetch(url)
      .then(processResponse)
      .catch(handleError)
  }

  this.getEventDetails = function (id) {
    const url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + key + '&id=' + id
    return fetch(url)
      .then(processResponse)
      .catch(handleError)

  }
  // API Helper methods

  const processResponse = function (response) {
    if (response.ok) {
      return response.json()
    }
    throw response;
  }

  const handleError = function (error) {
    if (error.json) {
      error.json().then(error => {
        console.error('getEventsPerState() API Error:', error.message || error)
      })
    } else {
      console.error('getEventsPerState() API Error:', error.message || error)
    }
  }

  // Observer pattern

  this.addObserver = function (observer) {
    observers.push(observer);
  };

  this.removeObserver = function (observer) {
    observers = observers.filter(o => o !== observer);
  };

  const notifyObservers = function () {
    observers.forEach(o => o.update());

  };
};

export const modelInstance = new EventModel();
