import React, {Component} from 'react';
import './Printout.css';
import { Link } from 'react-router-dom';
import {modelInstance} from '../data/EventModel';
import Logo from './../media/newLets.png';
import Sidebar from '../Sidebar/Sidebar';


class Printout extends Component {
  constructor(props) {
    super(props);
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

  update () {
    this.setState({
      morning: modelInstance.getMorning(),
      afternoon: modelInstance.getAfternoon(),
      evening: modelInstance.getEvening(),
    })
  }

  render() {
    const morning = this.state.morning;
    const afternoon = this.state.afternoon;
    const evening = this.state.evening;

    console.log(evening);

    return (
      <div className = "Printout">
      <div className="container">
      <div className='header'>
      <center>
        <h2 className="mb-4">Thank you for choosing</h2>
        <img className="logotype" src={Logo} alt='' height="500"/>
        </center>
      </div>

        <div className="row">
          <div className='col-sm-3 m-auto'>
            <Link to={"/search/" + window.location.pathname.substring(10,23)}>
              <button id='goBackPrintout' type="button" className=" btn btn-success">Go back and edit schedule</button>
            </Link>
          </div>
          <div className='col-sm-3 m-auto'></div>
          <div className='col-sm-3 m-auto'></div>
          <div className='col-sm-3 m-auto'>
        <Link to={"/printout/" + window.location.pathname.substring(10,23)}>
          <button type="button" onClick={() => window.parent.print()} className="btn btn-success mt-4">Print Full Schedule</button>
          </Link>
          </div>
        </div>
      <center>
      <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
        <Sidebar model={this.props.model} date = {this.props.state} />
      </div>
      </center>


      </div>
      </div>

    )
  }
}

export default Printout;
