import React from 'react'
import { mount, shallow } from 'enzyme';

import ApiUrlInputBox from '../src/Components/ApiUrlInputBox'

describe('Test onChange, Onblur and componentWillReceiveProps', () => {
    it('Triggers change events and sets the state of ApiUrlInputBox component', () => {
      let onChangeApiDefinitionMock = jest.fn()
      const component = mount(<ApiUrlInputBox onChangeApiDefinition={onChangeApiDefinitionMock} />)

      //Set the components state
      component.setState({apiUrl: 'test-url'})

      //Find the input element and trigger change manually
      const input = component.find('input').first()
      input.simulate('change', { target: { value: 'new-url' } })

      //Check if the change event changed the state as expected
      expect(component.state('apiUrl')).toBe('new-url')
    })

    it('Triggers blur event and triggers onChangeApiDefinition function', () => {
      let onChangeApiDefinitionMock = jest.fn()
      const component = mount(<ApiUrlInputBox onChangeApiDefinition={onChangeApiDefinitionMock} />)
      const input = component.find('input').first()

      //Set the components state
      component.setState({apiUrl: 'test-url'})

      //Simulate blur and expect the onBlur function to call our mock method
      //with parameters: 'urlName' and 'new-url'
      input.simulate('blur')
      expect(onChangeApiDefinitionMock).toBeCalledWith('urlName', 'test-url')
    })


    it('Hyphen seperates the API name and sets it as the apiUrl in the state', () => {
      const apiDefinitionMock = [{
        apiName: 'Untitled API 0',
        urlName: ''
      }]
      const apiDefinitionMock2 = [{
        apiName: 'New Test Name',
        urlName: ''
      }]
      const selectedApiIndexMock = 0
      const component = shallow(
        <ApiUrlInputBox
          apiDefinition={apiDefinitionMock}
          selectedApiIndex={selectedApiIndexMock}
        />
      )
      const input = component.find('input').first()
      component.setProps({apiDefinition: apiDefinitionMock2})
      expect(component.state('apiUrl')).toBe('new-test-name')
      component.setProps({apiDefinition: apiDefinitionMock2})
      expect(component.state('apiUrl')).toBe('new-test-name')
    })
  })
