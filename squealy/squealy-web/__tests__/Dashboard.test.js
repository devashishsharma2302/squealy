import React from 'react'
import { shallow } from 'enzyme'

import Dashboard from '../src/Components/dashboard-view/Dashboard'
import {getEmptyWidgetDefinition} from '../src/Utils'


describe('Unit tests for Dashboard component', () => {

  const dashboardDefinitionMock = {
    dashboardName: 'Untitled dashboard 0',
    styles: {background: '#e6e6e6'},
    widgets: [
      getEmptyWidgetDefinition()
    ]
  }

  const widgetAdditionHandler = jest.fn()

  const component = shallow(
    <Dashboard
      dashboardDefinition={dashboardDefinitionMock}
      widgetAdditionHandler={widgetAdditionHandler} />
  )

  const editorContentMock = '{"legend": {"position": "bottom"}}'

  it('Triggers modalVisibilityEnabler and sets the selected widget in the state', () => {
    component.instance().modalVisibilityEnabler(0)
    expect(component.state('showEditWidgetModal')).toBe(true)
    expect(component.state('selectedWidget')).toEqual(getEmptyWidgetDefinition())
    expect(component.state('editorContent')).toBe('null')
  })

  it('It triggers update widget data and updates the definition of selected widget data', () => {
    component.instance().updateWidgetData('title', 'New Title')
    expect(component.state('selectedWidget').title).toBe('New Title')
  })

  it('It triggers updateEditorContent and sets the editor content in the state', () => {
    component.instance().updateEditorContent(editorContentMock)
    expect(component.state('editorContent')).toBe(editorContentMock)
  })
})
