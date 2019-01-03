import React, { Component } from 'react';
import WhereWhen from './WhereWhen/WhereWhen';
import Events from './Events/Events';

class CalendarOverview extends Component {
  render() {
    return (
      <div className = 'CalendarOverview'>
      <WhereWhen model = {this.props.model}/>
      <Events model = {this.props.model}/>

      </div>


    )



  }


}
