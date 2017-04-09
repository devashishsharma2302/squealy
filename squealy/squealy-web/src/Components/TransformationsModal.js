import React, { Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { AVAILABLE_TRANSFORMATIONS } from './../Constant'
 
export default class TransformationsModal extends Component {
  constructor(props) {
    super(props)
    this.state = this.constructState()
  }

  constructState = () => {
    let { chart } = this.props,
     transformations = [],
     columnsToMerge = [],
     pivotColumn = null,
     metric = null,
     newColumnName = ''
    chart.transformations.map((transformation, index) =>{
      transformations.push(AVAILABLE_TRANSFORMATIONS[transformation.name-1])
      if(transformation.name === 3) {
        columnsToMerge.push(transformation.kwargs.columns_to_merge.map(column => {
          return {
            value: column,
            label: column
          }
        }))
        newColumnName = transformation.kwargs.new_column_name
      } else if (transformation.name === 2) {
        pivotColumn = transformation.kwargs.pivot_column
        metric = transformation.kwargs.metric_column
      }
    })
    return {
      transformations: transformations,
      columnsToMerge: columnsToMerge[0],
      pivotColumn: pivotColumn,
      metric: metric,
      newColumnName: newColumnName
    }
  }
  handleChange = (key, value) => { 
    this.setState({[key]: value})
  }

  onClickSave = () => {
    const {
      transformations,
      pivotColumn,
      columnsToMerge,
      newColumnName,
      metric
    } = this.state

    let actualTransformations = []
    transformations.map(transformation => {
      if(transformation.value === 'transpose') {
        actualTransformations.push({
          name: 1,
          kwargs: {}
        })
      } else if (transformation.value === 'split') {
        actualTransformations.push({
          name: 2,
          kwargs: {
            pivot_column: pivotColumn,
            metric_column: metric
          }
        })
      } else if(transformation.value === 'merge') {
        actualTransformations.push({
          name: 3,
          kwargs: {
            columns_to_merge: columnsToMerge.map(c => c.value),
            new_column_name: newColumnName
          }
        })
      }
    })

    this.props.selectedChartChangeHandler(
      {transformations: actualTransformations}, this.props.closeModal)
  }

  render () {
    const {
      chart,
      selectedChartChangeHandler,
      showModal,
      closeModal,
    } = this.props

    const {
      transformations,
      columnsToMerge,
      pivotColumn,
      metric,
      newColumnName
    } = this.state

    let columnNames = []
    if(chart.chartData.cols) {
      columnNames = chart.chartData.cols.map(column => {
        return {
          label: column.label,
          value: column.label
        }
      })
    }
    const testParametersHTML =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-12'>
            <label className='col-md-3'>
              Select Transformation:
            </label>
            <div className="col-md-7">
              <Select
                value={transformations}
                options={AVAILABLE_TRANSFORMATIONS}
                placeholder='Type transformation names'
                onChange={(values) => this.handleChange('transformations', values)}
                multi={true}
              />
            </div>
          </div>
          {(transformations.filter(t => t.value === 'split')[0]) &&
            <div className='col-md-12'>
              <label className='col-md-3'>
                Metric:
              </label>
              <div className="col-md-7">
                <Select
                  value={(metric)?{label: metric, value: metric}:null}
                  options={columnNames}
                  placeholder='Type transformation names'
                  onChange={(metric)=>this.handleChange('metric', metric.value)}
                />
              </div>
            </div>
          }
          {(transformations.filter(t => t.value === 'split')[0]) &&
            <div className='col-md-12'>
              <label className='col-md-3'>
                Pivot Column:
              </label>
              <div className="col-md-7">
                <Select
                  value={(pivotColumn)?{label: pivotColumn, value: pivotColumn}:null}
                  options={columnNames}
                  placeholder='Type column names'
                  onChange={(column)=>this.handleChange('pivotColumn', column.value)}
                />
              </div>
            </div>
          }
          {(transformations.filter(t => t.value === 'merge')[0]) &&
            <div className='col-md-12'>
              <label className='col-md-3'>
                Columns to merge:
              </label>
              <div className="col-md-7">
                <Select
                  value={columnsToMerge}
                  options={columnNames}
                  placeholder='Type column names'
                  onChange={(columns)=>this.handleChange('columnsToMerge', columns)}
                  multi={true}
                />
              </div>
            </div>
          }
          {(transformations.filter(t => t.value === 'merge')[0]) &&
            <div className='col-md-12'>
              <label htmlFor='validationQuery' className='col-md-3'>
                New column name:
              </label>
              <div className="col-md-7">
                <input
                  type="text"
                  value={newColumnName}
                  placeholder="Enter new column name"
                  onChange={(e) => this.handleChange('newColumnName', e.target.value)}
                />
              </div>
            </div>
          }
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-primary" onClick={this.onClickSave}>Save</button>
          </div>
        </div>
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='transformationsModal'
        closeModal={closeModal}
        showModal={showModal}
        modalHeader='Transformations'
        helpText='Use transfromations on the result set of the query to avoid complex transformation logic inside the query'
        modalContent={testParametersHTML}
        noFooter={true}
      />
    )
  }
}
