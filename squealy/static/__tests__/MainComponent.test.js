import React from 'react'
import { shallow } from 'enzyme'

import MainComponent from '../src/Components/MainComponent'
import { getEmptyApiDefinition, getEmptyTestData } from '../src/Utils'


describe('Unit tests for MainComponent using shallow rendering', () => {

  const onHandleTestButtonMock = jest.fn()
  const onChangeTestDataMock = jest.fn()
  const apiDefinitionMock = [getEmptyApiDefinition()]
  let testData = [getEmptyTestData()]

  it('Triggers click event on Run query button', () => {
    const component = shallow(
      <MainComponent
        onHandleTestButton={onHandleTestButtonMock}
        apiDefinition={apiDefinitionMock}
        testData={testData}
        selectedApiIndex={0}
        onChangeTestData={onChangeTestDataMock}
      />
    )

    // Manually simulate click event on test button
    const testBtn = component.find('.hidash-btn').first()
    testBtn.simulate('click')

    // Check if handleTestButton function got called
    expect(onHandleTestButtonMock).toBeCalled()
  })
})
