import React, {Component} from 'react'

import {googleChartLoader} from '../Utils'


export default class App extends Component{

  componentWillMount() {
    googleChartLoader()
  }

  render() {
    return(
      <div className="parent-div container-fluid">
        {this.props.children}
      </div>
    )
  }
}
