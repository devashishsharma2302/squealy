import React from 'react'
import { shallow, mount } from 'enzyme'

import {
  SquealyModal,
  SquealyDropdown
} from '../src/Components/SquealyUtilsComponents'


describe('Tests the Squealy utility components', () => {
  const options = [{
    name: 'option1',
    value: '1'
  }, {
    name: 'option2',
    value: '2'
  }]
      , selectedValue = options[0]
      , onChangeHandler = jest.fn()
      , modalHeader = "Mock Header"
      , modalId = 1
      , modalContent = "Mock Content"
      , saveChanges = jest.fn()
      , showModal = true
      , modalSize = '100px'

  it('Triggers change event on select tag', () => {
    const component = mount(
      <SquealyDropdown
        options = {options}
        selectedValue = {selectedValue}
        onChangeHandler = {onChangeHandler}
      />
    )

    // Find the select tag and trigger change event
    const selectElement = component.find('select').first()
    selectElement.simulate('change', { target: { value: '2' } })

    // Check if the mock function was called with '2' as an argument
    expect(onChangeHandler).toBeCalledWith('2')
  })

  it('Triggers click event on save button and calls saveChanges function', () => {
    const component = mount(
      <SquealyModal
        modalHeader={modalHeader}
        modalId={modalId}
        modalContent={modalContent}
        saveChanges={saveChanges}
        showModal={showModal}
        modalSize={modalSize}
      />
    )
    const saveButton = component.find('button').first()
    saveButton.simulate('click')
    expect(saveChanges).toBeCalled
  })
})
