import React from 'react'
import { shallow } from 'enzyme'

import DashboardContainer from '../src/Containers/DashboardContainer'
import {getEmptyWidgetDefinition} from '../src/Utils'
import {GOOGLE_CHART_TYPE_OPTIONS} from '../src/Constant'

const expectedState = [{ 
  apiName: 'Untitled Dashboard 0',
  styles:{"background":"#e6e6e6"},
  widgets: []
}]

const widgetPositionMock = {
  top: 12,
  left: 12
}

const widgetSizeMock = {
  widht: 400,
  height: 400
}

const widgetDefinitionMock = {
  title: 'updated chart title',
  chartType: GOOGLE_CHART_TYPE_OPTIONS[0].value,
  chartStyles: {
    legend: {
      position: 'bottom'
    }
  },
  width: 434,
  height: 300,
  top:20,
  left:20,
  editMode: false
}

describe('Unit tests for Dashboard Container', () => {
  const component = shallow(<DashboardContainer />)

  it('Adds an empty dashboard definition before the component mounts', () => {
    expect(component.state('dashboardDefinitions')).toEqual(expectedState)
  })

  it('Triggers addWidgetHandler and updates the state', () => {
    // Trigger the method to add an empty widget definition at 0th definition
    component.instance().widgetAdditionHandler(0)
    expect(component.state('dashboardDefinitions')[0].widgets).toEqual([getEmptyWidgetDefinition()])
  })

  it('Triggers widgetRepositionHandler and updates the widget definition', () => {
    component.instance().widgetRepositionHandler(0, 0, widgetPositionMock.top, widgetPositionMock.left)
    expect(component.state('dashboardDefinitions')[0].widgets[0].top).toEqual(widgetPositionMock.top)
    expect(component.state('dashboardDefinitions')[0].widgets[0].left).toEqual(widgetPositionMock.left)
  })

  it('Triggers widgetResizeHandler and updates the widget definition', () => {
    component.instance().widgetResizeHandler(0, 0, widgetSizeMock.width, widgetSizeMock.height)
    expect(component.state('dashboardDefinitions')[0].widgets[0].width).toEqual(widgetSizeMock.width)
    expect(component.state('dashboardDefinitions')[0].widgets[0].height).toEqual(widgetSizeMock.height)
  })

  it('Triggers updateWidgetDefinition and updates the widget definition', () => {
    component.instance().widgetAdditionHandler(0)
    component.instance().updateWidgetDefinition(0, 1, widgetDefinitionMock)
    expect(component.state('dashboardDefinitions')[0].widgets[1]).toEqual(widgetDefinitionMock)
  })

  it('Triggers updateDashboardDefinition and updates the dashboard definition', () => {
    component.instance().updateDashboardDefinition(0, 'styles', {background: '#fff'})
    expect(component.state('dashboardDefinitions')[0].styles).toEqual({background: '#fff'})
  })
})
