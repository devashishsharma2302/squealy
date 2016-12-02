import React from 'react'
import { shallow } from 'enzyme'

import ApiParamsDefinition from '../src/Components/ApiParamsDefinition'
import {getEmptyApiDefinition} from '../src/Utils'

describe('Tests the ApiParamsDefinition component', () => {
  let selectedApiDefinition = getEmptyApiDefinition()
  selectedApiDefinition.paramDefinition = [{
    name: 'param1',
    format: 'Datetime'
  }, {
    name: 'param2',
    format: 'String'
  }]
  const onChangeApiDefinition = jest.fn()
    , handleEditParam = jest.fn()
  const component = shallow(
        <ApiParamsDefinition
          selectedApiDefinition={selectedApiDefinition}
          onChangeApiDefinition={onChangeApiDefinition}
          handleEditParam={handleEditParam}
        />
        )
  it('Triggers delete parameter event and updates the state', () => {

    // Find the delete icon and trigger click event
    const deleteIcon = component.find('.fa').first()
    deleteIcon.simulate('click')

    // Expect click to trigger onChangeApiDefinition
    expect(onChangeApiDefinition).toBeCalledWith(
      'paramDefinition',
      [selectedApiDefinition.paramDefinition[1]]
    )
  })
})
