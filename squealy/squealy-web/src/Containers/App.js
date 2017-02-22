import React, {Component} from 'react'

import {googleChartLoader} from '../Utils'


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
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       googleDefined: googleDefined
      })
   )
    return(
      <div style={{height: '100%'}}>
        {childrenWithProps}
      </div>
    )
  }
}
