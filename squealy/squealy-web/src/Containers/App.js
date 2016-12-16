import React, {Component} from 'react'


export default class App extends Component{
  render() {
    return(
      <div className="parent-div container-fluid">
        {this.props.children}
      </div>
    )
  }
}
