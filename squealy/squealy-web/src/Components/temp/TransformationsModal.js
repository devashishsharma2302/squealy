import React, { Component} from 'react'
import Select from 'react-select'

import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { AVAILABLE_TRANSFORMATIONS } from '../../Constant'

export default class TransformationsModal extends Component {
  constructor(props) {
    super(props)
  }

  handleOnChange = (key, values) => {
    this.props.selectedChartChangeHandler(key, values)
  }

  render () {
    const {
      testParameters,
      selectedChartChangeHandler,
      showModal,
      closeModal,
      transformations,
      chartColumns,
      pivotColumn,
      metric,
      columnsToMerge
    } = this.props
    const columnNames = chartColumns.map(column => {
      return {
        label: column.label,
        value: column.label
      }
    })
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
              onChange={(transformattions)=>this.handleOnChange('transformations', transformattions)}
              multi={true}
            />
          </div>
        </div>
        <div className='col-md-12'>
          <label htmlFor='validationQuery' className='col-md-3'>
            Metric:
          </label>
          <div className="col-md-7">
            <Select
              value={metric}
              options={columnNames}
              placeholder='Type transformation names'
              onChange={(metric)=>this.handleOnChange('metric', metric)}
            />
          </div>
        </div>
        {(transformations.find(transformation => transformation.value === 'split'))&&
          <div className='col-md-12'>
            <label htmlFor='validationQuery' className='col-md-3'>
              Pivot Column:
            </label>
            <div className="col-md-7">
              <Select
                value={pivotColumn}
                options={columnNames}
                placeholder='Type column names'
                onChange={(column)=>this.handleOnChange('pivotColumn', column)}
              />
            </div>
          </div>
        }
        {(transformations.find(transformation => transformation.value === 'merge'))&&
          <div className='col-md-12'>
            <label htmlFor='validationQuery' className='col-md-3'>
              Columns to merge:
            </label>
            <div className="col-md-7">
              <Select
                value={columnsToMerge}
                options={columnNames}
                placeholder='Type column names'
                onChange={(column)=>this.handleOnChange('columnsToMerge', column)}
                multi={true}
              />
            </div>
          </div>
        }
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
      />
    )
  }
  
}
