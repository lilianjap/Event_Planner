import React, { Component } from 'react';
import './Sidebar.css';
import {modelInstance} from '../data/EventModel';
import firebase from "firebase";
import {DB_CONFIG} from "../config.js";

let i;
class Sidebar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening(),
    }
  }

  componentDidMount() {
    modelInstance.addObserver(this)
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this)
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening(),
    })
  }
  update() {
    this.setState({
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening(),
    })
  }

  removeEvent = (e) => {
    if (e.target.value) {
      modelInstance.removeEvent(e.target.id, e.target.value)
      return;
    } else if (e.target.parentNode.value) {
      modelInstance.removeEvent(e.target.parentNode.id, e.target.parentNode.value)
   }
  }

  render() {
      const {morning} = this.state;
      const {afternoon} = this.state;
      const {evening} = this.state;

          return (
              <div className ="Sidebar">
              <div id='Sidebar'>
                <h4 className="mb-4 text-white">Your chosen schedule</h4>
                    {/*MORNING SCHEDULE*/}
                    <div className="card-header bg-grey text-white text-center" role="tab" id="headingOne">
                        <a data-toggle="collapse" data-parent="#accordion" aria-expanded="true" className="text-white" aria-controls="collapseOne">
                          Morning
                        </a>
                    </div>
                    <ul className="list-group">
                    { morning.length != 0 ? (
                      <li key={morning.id} className="list-group-item p-0" >
                          <div className="OneEvent" id={morning.id}>
                        <div className="container-fluid py-2">
                          <div className="row">
                            <div className='col-sm-4 m-auto'>
                              <div className="font1">
                                <i className="fa fa-calendar-o"> {morning.dates.start.localDate} </i>
                              </div>
                              <div className="font1">
                                <i className="fa fa-clock-o"> {morning.dates.start.localTime} </i>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <b>{morning.name}</b><br/>
                              { morning.place ? (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {morning.place.address.line1}</div>
                              ) : (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {morning._embedded.venues[0].address.line1}</div>
                              )
                            }
                            { morning.priceRanges ? (
                              <div>Price range: {morning.priceRanges[0].min}-{morning.priceRanges[0].max} {morning.priceRanges[0].currency}</div>
                            ) : (<i> Cost is not available at the moment</i>)}
                            </div>
                            <div className="OneEvent col-sm-2 m-auto" id={morning.id}>
                                <button id={morning.id} value='1' className='removeEvent btn btn-success' onClick={this.removeEvent}>
                                   Remove
                                </button>
                            </div>
                          </div>
                          </div>
                          </div>
                      </li>
                    ) : (
                      <div></div>
                      )}
                    </ul>

                    {/*AFTERNOON SCHEDULE*/}
                    <div className="card-header bg-grey text-white text-center" role="tab" id="headingTwo">
                        <a data-toggle="collapse" data-parent="#accordion" aria-expanded="true" className="text-white" aria-controls="collapseOne">
                        Afternoon
                        </a>
                    </div>
                    <ul className="list-group">
                    { afternoon.length != 0 ? (
                      <li key={afternoon.id} className="list-group-item p-0">
                          <div className="OneEvent " id={afternoon.id}>
                        <div className="container-fluid py-2">
                          <div className="row">
                            <div className='col-sm-4 m-auto'>
                              <div className="font1">
                                <i className="fa fa-calendar-o"> {afternoon.dates.start.localDate} </i>
                              </div>
                              <div className="font1">
                                <i className="fa fa-clock-o"> {afternoon.dates.start.localTime} </i>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <b>{afternoon.name}</b><br/>
                              { afternoon.place ? (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {afternoon.place.address.line1}</div>
                              ) : (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {afternoon._embedded.venues[0].address.line1}</div>
                              )
                            }
                            { afternoon.priceRanges ? (
                              <div>Price range: {afternoon.priceRanges[0].min}-{afternoon.priceRanges[0].max} {afternoon.priceRanges[0].currency}</div>
                            ) : (<i> Cost is not available at the moment</i>)}                            </div>
                            <div className="OneEvent col-sm-2 m-auto" id={afternoon.id}>
                                <button id={afternoon.id} value='2' className='removeEvent btn btn-success' onClick={this.removeEvent}>
                                  Remove
                                </button>
                            </div>
                          </div>
                          </div>
                          </div>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    </ul>

                    {/*EVENING SCHEDULE*/}
                    <div className="card-header bg-grey text-white text-center" role="tab" id="headingThree">
                        <a data-toggle="collapse" data-parent="#accordion" aria-expanded="true" className="text-white" aria-controls="collapseOne">
                          Evening
                        </a>
                    </div>
                    <ul className="list-group">
                    { evening.length != 0 ? (
                      <li key={evening.id} className="list-group-item">
                          <div className="OneEvent" id={evening.id}>
                        <div className="container-fluid py-2">
                          <div className="row">
                            <div className='col-sm-4 m-auto'>
                              <div className="font1">
                                <i className="fa fa-calendar-o"> {evening.dates.start.localDate} </i>
                              </div>
                              <div className="font1">
                                <i className="fa fa-clock-o"> {evening.dates.start.localTime} </i>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                              <b>{evening.name}</b><br/>
                              { evening.place ? (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {evening.place.address.line1}</div>
                              ) : (
                                <div className="text-muted"><i className="fa fa-map-marker"></i> {evening._embedded.venues[0].address.line1}</div>
                              )
                            }
                            { evening.priceRanges ? (
                              <div>Price range: {evening.priceRanges[0].min}-{evening.priceRanges[0].max} {evening.priceRanges[0].currency}</div>
                            ) : (<i> Cost is not available at the moment</i>)}                            </div>
                            <div className="OneEvent col-sm-2 m-auto" id={evening.id}>
                                <button id={evening.id} value='3' className='removeEvent btn btn-success' onClick={this.removeEvent}>
                                  Remove
                                </button>
                            </div>
                          </div>
                          </div>
                          </div>
                      </li>
                    ) : (
                      <div></div>
                    )}

                    </ul>



              </div>
              </div>
              )
  }
}

export default Sidebar;
