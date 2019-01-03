import React, {Component} from 'react';
import './Overview.css';
import { Link } from 'react-router-dom';
import {modelInstance} from '../data/EventModel';
import Sidebar from '../Sidebar/Sidebar';


class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
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

  update () {
    this.setState({
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening(),
    })
  }


  checkList = (e) => {
    console.log(modelInstance.getMorning());
    console.log(modelInstance.getAfternoon());
    console.log(modelInstance.getEvening());

    if (modelInstance.getMorning().length == 0 && modelInstance.getAfternoon().length == 0 && modelInstance.getEvening().length == 0){
      e.preventDefault()
      alert("You have to choose events! Please go back and edit your schedule")
    }
  }


  render() {
    const{morning} = this.state;
    const{afternoon} = this.state;
    const{evening} = this.state;

    return (
      <div className = "Overview">
          <div className="container">
            <div className='row' id='overviewHeader'>
              <div className='col-md-10'>
                <h2>Day of events</h2>
              </div>
              <div className='col-md-2 '>
              <Link to={"/search/" + window.location.pathname.substring(10,23)} >
                <button type="button" className="goBack btn btn-success ">Go Back and Edit</button>
              </Link>
              </div>
            </div>
              <div className='row' id='overviewEvents'>
                  <div className='col-sm-9'>
                  <Sidebar model={this.props.model} morning={this.state.morning} afternoon={this.state.afternoon} evening={this.state.evening} />
                  </div>
              </div>
              <div className='row'>
                <div className='col-sm-9'></div>
              </div>
              <div className='row'>
                <div className='col-sm-9'></div>
                <div className="col-sm-3">
                  <Link to={"/printout/" + window.location.pathname.substring(10,23)}>
                    <button type="button" onClick={this.checkList} className="btn btn-success mt-4">Print Full Schedule</button>
                  </Link>
                </div>
              </div>
         </div>
      </div>
    )
  }
}

export default Overview;
