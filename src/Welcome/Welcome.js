import React, { Component } from 'react';
import './Welcome.css';
import { Link } from 'react-router-dom';
import USAMap from "../usa/index"
import { modelInstance } from '../data/EventModel';
import Typed from 'react-typed';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateName: '',
    }
  }

  handleClick = (event) => {
    event.preventDefault()
    modelInstance.setStateCode(event.target.dataset.name);
    this.setState({stateName: event.target.dataset.name}, function() {
      this.stateClicked = true
      this.setPathName()
    })
  }

  setPathName() {
  if (this.stateClicked == true) {
    this.props.history.push("/wherewhen/" + this.state.stateName + Intl.DateTimeFormat('sv-SV').format());
   }
  }

  render() {
    return (
      <div className="Welcome">
        <h1 className="display-2 text-white">
          <Typed
            strings={['Plan your day...!']}
            typeSpeed={40}
            backSpeed={50}
            showCursor={false}
          />
        </h1>
        <Link to={"/wherewhen/" + this.state.stateName + Intl.DateTimeFormat('sv-SV').format()}>
        <div className="App">
            <USAMap onClick={this.handleClick}/>
        </div>
        </Link>
      </div>
    );
  }
}

export default Welcome;
