import React, {Component} from 'react'
import {googleChartLoader} from './../Utils'
import AuthoringInterfaceContainer from './AuthoringInterfaceContainer'


export default class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      googleDefined: false
    }
  }

  componentWillMount() {
    googleChartLoader(()=> this.setState({googleDefined: true}))
  }

  render() {
    const { googleDefined } = this.state
    return(
      <div style={{height: '100%'}}>
        <AuthoringInterfaceContainer googleDefined={googleDefined} />
      </div>
    )
  }
}
