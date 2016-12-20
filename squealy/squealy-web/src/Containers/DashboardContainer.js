import React, {Component} from 'react'
import DashboardNavigator from '../Components/dashboard-view/DashboardNavigator'
import {getEmptyDashboardDefinition, getEmptyWidgetDefinition, getApiRequest, postApiRequest} from '../Utils'
import DashboardHeader from '../Components/dashboard-view/DashboardHeader'


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

  dashboardAdditionHandler = () => {
    let dashboardList = this.state.dashboardDefinitions.slice()
    dashboardList.push(getEmptyDashboardDefinition())
    this.setState({dashboardDefinitions: dashboardList,
      selectedDashboardIndex: dashboardList.length-1
    })
  }

  selectDashboard = (index) => {
    this.setState({selectedDashboardIndex: index})
  }


  // Adds an empty widget definition to a certain dashboard definition
  widgetAdditionHandler = (dashboardDefinitionIndex) => {
    let newdashboardDefinitions = this.state.dashboardDefinitions.slice()
    newdashboardDefinitions[dashboardDefinitionIndex].widgets.push(getEmptyWidgetDefinition())
    this.setState({
      dashboardDefinitions: newdashboardDefinitions,
    })
  }

  render() {
    const {dashboardDefinitions} = this.state
    return (<div>
        <DashboardHeader />
        <DashboardNavigator
          selectDashboard={this.selectDashboard}
          selectedDashboardIndex={this.state.selectedDashboardIndex}
          dashboardDefinition={dashboardDefinitions}
          dashboardAdditionHandler={this.dashboardAdditionHandler}
          widgetAdditionHandler={this.widgetAdditionHandler}/>
      </div>
    )
  }
}
