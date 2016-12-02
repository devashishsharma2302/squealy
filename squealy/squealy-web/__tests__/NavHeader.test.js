import React from 'react'
import { mount, shallow } from 'enzyme'

import MenuBar from '../src/Components/NavHeader'
import {getEmptyApiDefinition} from '../src/Utils'


describe('Unit tests for NavHeader component', () => {
  const mockFunction = jest.fn().mockImplementation(() => {
    console.log("sdfsdfsdfsdfsdf")
  });
  const apiAdditionHandler = mockFunction
      , apiDefinition = [getEmptyApiDefinition()]
      , apiOpenHandler = mockFunction
      , exportConfigAsYaml = mockFunction

  it('Triggers api addition event', () => {
    const component = mount(
          <MenuBar
            apiOpenHandler={apiOpenHandler}
            apiDefinition={apiDefinition}
            apiAdditionHandler={apiAdditionHandler}/>
        )
    const menuItems = component.find('MenuItem')
    const apiAdditionElement = menuItems.findWhere(
      item => item.text() === 'Create a new API'
    )
    console.log(apiAdditionElement.first(), "asdasdas")
    apiAdditionElement.simulate('click')
    expect(apiAdditionHandler).toBeCalled()
  })

  it('Checks the text of first menu item', () => {
    const component = mount(
      <MenuBar
            apiOpenHandler={apiOpenHandler}
            apiDefinition={apiDefinition}
            apiAdditionHandler={apiAdditionHandler}/>
    )
    const menuItem = component.find('MenuItem').first()
    expect(menuItem.text()).toBe('No Api Available')
  })

  it('Triggers the click event on export button', () => {
    const component = shallow(
      <MenuBar
            apiOpenHandler={apiOpenHandler}
            apiDefinition={apiDefinition}
            apiAdditionHandler={apiAdditionHandler}
            exportConfigAsYaml={exportConfigAsYaml}/>
    )
    const exportBtn = component.find('button').first()
    exportBtn.simulate('click')
    expect(exportConfigAsYaml).toBeCalled()
  })
})
