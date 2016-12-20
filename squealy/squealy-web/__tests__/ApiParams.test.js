import React from 'react'
import { mount, shallow } from 'enzyme'

import ApiParams from '../src/Components/ApiParamsComponent'
import {getEmptyApiDefinition} from '../src/Utils'


describe('Test the behavior of ApiParamsCompnent', () => {
  // it('Sets initial state of the component', () => {
  //   const component = shallow(<ApiParams />)
  //   const panel = component.find('Panel').first()

  //   // Manually trigger enter event and check the component's state
  //   expect(component.state('apiParamString')).toBe('')
  //   expect(component.state('accordionHeaderIcon')).toBe('fa-caret-right')
  // })

  // it('Triggers onEnter event and sets the state', () => {
  //   const component = shallow(<ApiParams />)
  //   const panel = component.find('Panel').first()

  //   // Manually trigger enter event and check the component's state
  //   panel.simulate('enter')
  //   expect(component.state('apiParamString')).toBe('')
  //   expect(component.state('accordionHeaderIcon')).toBe('fa-caret-down')
  // })

  it('Triggers onExit event and sets the component state', () => {
    let selectedApiDefinition = getEmptyApiDefinition()
    selectedApiDefinition.paramDefinition = [{
      name: 'param1',
      format: 'Datetime'
    }, {
      name: 'param2',
      format: 'String'
    }]
    const component = shallow(
      <ApiParams selectedApiDefinition={selectedApiDefinition}/>
    )
    const panel = component.find('Panel').first()

    // Manually trigger exit event and check the component's state
    panel.simulate('exit')
    expect(component.state('apiParamString')).toBe('param1,param2')
    expect(component.state('accordionHeaderIcon')).toBe('fa-caret-right')
  })
})
