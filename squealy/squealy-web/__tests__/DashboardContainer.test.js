import React from 'react'
import { shallow } from 'enzyme'

import DashboardContainer from '../src/Containers/DashboardContainer'
import {getEmptyWidgetDefinition} from '../src/Utils'

const expectedState = [ { apiName: 'Untitled Dashboard 0', widgets: [] } ]

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
})
