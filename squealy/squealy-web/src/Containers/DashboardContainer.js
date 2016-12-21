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
    // TODO: Get dashboard definitions from local storage
    this.setState({
      dashboardDefinitions: [getEmptyDashboardDefinition()],
      selectedDashboardIndex: 0
    })
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


  // Adds a new widget definition to a certain dashboard definition
  widgetAdditionHandler = (dashboardDefinitionIndex, newWidget) => {
    let newdashboardDefinitions = this.state.dashboardDefinitions.slice()
    newdashboardDefinitions[dashboardDefinitionIndex].widgets.push(newWidget)
    this.setState({
      dashboardDefinitions: newdashboardDefinitions,
    })
  }

  // Updates the widget's postion in the main state
  widgetRepositionHandler = (dashboardIndex, widgetIndex, top, left) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].top = top
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].left = left
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget's size in the main state
  widgetResizeHandler = (dashboardIndex, widgetIndex, width, height) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].width = width
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].height = height
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget Definition in the state
  updateWidgetDefinition = (dashboardIndex, widgetIndex, updatedDefinition) => {
    let dashboardDefinitions= this.state.dashboardDefinitions.slice()
    let definitionToUpdate = dashboardDefinitions[dashboardIndex].widgets[widgetIndex]
    definitionToUpdate.title = updatedDefinition.title
    definitionToUpdate.chartType = updatedDefinition.chartType
    definitionToUpdate.chartStyles = updatedDefinition.chartStyles
    this.setState({dashboardDefinitions: dashboardDefinitions})
  }

  // Updates a dashboard definition in the state
  updateDashboardDefinition = (dashboardIndex, keyToUpdate, updatedValue) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex][keyToUpdate] = updatedValue
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  render() {
    const {dashboardDefinitions, selectedDashboardIndex} = this.state
    return (
      <div>
        <DashboardHeader />
        <DashboardNavigator
          selectDashboard={this.selectDashboard}
          selectedDashboardIndex={selectedDashboardIndex}
          dashboardDefinition={dashboardDefinitions}
          dashboardAdditionHandler={this.dashboardAdditionHandler}
          widgetAdditionHandler={this.widgetAdditionHandler}
          widgetRepositionHandler={this.widgetRepositionHandler}
          widgetResizeHandler={this.widgetResizeHandler}
          updateWidgetDefinition={this.updateWidgetDefinition}
          updateDashboardDefinition={this.updateDashboardDefinition}
        />
      </div>
    )
  }
}
