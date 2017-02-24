import React, { Component} from 'react'
import Select from 'react-select'

import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { AVAILABLE_TRANSFORMATIONS } from '../../Constant'

export default class TransformationsModal extends Component {
  constructor(props) {
    super(props)
  }

  handleOnChange = (selectedTransformations) => {
    let newTransformations = selectedTransformations
    this.props.selectedChartChangeHandler('transformations', newTransformations)
  }

  render () {
    const {
      testParameters,
      selectedChartChangeHandler,
      showModal,
      closeModal,
      transformations
    } = this.props
    const testParametersHTML =
    <div className="modal-container">
      <div className='row add-modal-content'>
        <div className='col-md-12'>
          <label htmlFor='validationQuery' className='col-md-3'>
            Select Transformation:
          </label>
          <div className="col-md-7">
            <Select
              value={transformations}
              options={AVAILABLE_TRANSFORMATIONS}
              placeholder='Type transformation names'
              onChange={this.handleOnChange}
              multi={true}
            />
          </div>
        </div>
        <div className='col-md-12 param-form-footer'>
          <button className="btn btn-default" onClick={this.formVisibilityHandler}>Cancel</button>
          <button className="btn btn-primary" onClick={this.onClickSave}>Save</button>
        </div>
      </div>
    </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='addTestParametersModal'
        closeModal={closeModal}
        showModal={showModal}
        modalHeader='Transformations'
        modalContent={testParametersHTML}
        noFooter={true}
      />
    )
  }
  
}
