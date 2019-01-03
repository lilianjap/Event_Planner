import React, { Component } from 'react';
import './App.css';
import Logo from './media/newLets.png';
import { Route } from 'react-router-dom';
import Welcome from './Welcome/Welcome';
import { modelInstance } from './data/EventModel'
import SelectEvent from "./SelectEvent/SelectEvent";
import Details from "./Details/Details";
import Overview from "./Overview/Overview";
import Printout from "./Printout/Printout";
import WhereWhen from "./WhereWhen/WhereWhen";
import firebase from "firebase";
import {DB_CONFIG} from "./config.js"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "LET'S",
    }
    this.app = firebase.initializeApp(DB_CONFIG);
    var database = firebase.database();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

       <nav className="navbar navbar-expand-md navbar-light fixed-top bg-green shadow">
         <div className="container">
                <a className="navbar-brand text-white brand" href="/" > <img src={Logo} alt='' height="50"/> Let's </a>

          </div>
      </nav>

          {/* We rended diffrent component based on the path */}
          <Route exact path="/" component={Welcome}/>
          <Route path="/search/:stateDate" render={() => <SelectEvent model={modelInstance}/>}/>
          <Route path="/details/:id" render={() => <Details model={modelInstance}/>}/>
          <Route path="/overview" render={() => <Overview model={modelInstance}/>}/>
          <Route path="/printout" render={() => <Printout model={modelInstance}/>}/>
          <Route path="/wherewhen/:stateDate" render={() => <WhereWhen model={modelInstance}/>}/>


        </header>
      </div>
    );
  }
}

export default App;
