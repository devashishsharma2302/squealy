import React, {Component} from 'react'

import Dashboard from '../Components/dashboard-view/Dashboard'
import {getEmptyDashboardDefinition, getEmptyWidgetDefinition} from '../Utils'


export default class DashboardContainer extends Component {
  constructor() {
    super()
    this.state = {
      dashboardDefinitions: []
    }
  }

  // If no definitions are present in the local storage, fill in an 
  // empty database definition
  componentWillMount() {
    this.setState({dashboardDefinitions: [getEmptyDashboardDefinition()]})
  }

  // Adds an empty widget definition to a certain dashboard definition
  widgetAdditionHandler = (dashboardDefinitionIndex) => {
    let newdashboardDefinitions = this.state.dashboardDefinitions.slice()
    newdashboardDefinitions[dashboardDefinitionIndex].widgets.push(getEmptyWidgetDefinition())
    this.setState({
      dashboardDefinitions: newdashboardDefinitions
    })
  }

  render() {
    const {dashboardDefinitions} = this.state
    return (
      <Dashboard
        dashboardDefinition={dashboardDefinitions[0]}
        widgetAdditionHandler={this.widgetAdditionHandler}/>
    )
  }
}
