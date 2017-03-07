import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { PARAM_FORMAT_OPTIONS } from './../Constant'
import { getEmptyParamDefinition } from './../Utils'


export default class ParamDefinitionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedValue: 'string',
      query: '',
      paramDefinition: getEmptyParamDefinition()
    }
  }
  editMode = false
  editArrayIndex = -1

  //Function to open add param form and initialize form values
  addParamDefHandler = () => {
    this.setState({
      showParamDefForm: true,
      paramDefinition: getEmptyParamDefinition(),
      selectedDataType: 'string'
    })
  }

  //Function to open close param form
  closeParamForm = () => {
    this.setState({ showParamDefForm: false })
  }

  //Function to change param definition. It can be Custom or Predefined type like Date, DateTime, String
  onChangeParamDefType = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['data_type'] = this.state.selectedDataType
    this.setState({
      selectedDataType: currentParamDefinition.data_type,
      paramDefinition: currentParamDefinition
    })
  }

  //Function to select Type for Predefined params
  paramFormatSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['data_type'] = value
    this.setState({selectedValue: value, paramDefinition: currentParamDefinition})
  }

  onChangeParamHandler = (key, value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition[key] = value
    this.setState({paramDefinition: currentParamDefinition})
  }

  handleEditParam = (index) => {
    this.setState({ showParamDefForm: true }, () => {
      let currentParamDefinition = this.props.parameters[index]
      this.editMode = true
      this.editArrayIndex = index
      this.setState({
        selectedValue: currentParamDefinition.data_type,
        paramDefinition: currentParamDefinition
      })
    })

  }

  deleteEntry = (index, fieldName) => {
    let currentParameters = [...this.props.parameters]
    currentParameters.splice(index, 1)
    this.props.selectedChartChangeHandler('parameters', currentParameters)
    this.setState({paramDefinition: getEmptyParamDefinition(), selectedValue: 'string'})
  }

  saveParamHandler = () => {
    let selectedChartParamDef = [...this.props.parameters]
    if (this.editMode) {
      selectedChartParamDef[this.editArrayIndex] = this.state.paramDefinition
    } else {
      selectedChartParamDef.push(this.state.paramDefinition)
    }

    this.props.selectedChartChangeHandler('parameters', selectedChartParamDef,
      () => {
        this.setState({showParamDefForm: false})
        this.editMode = false
        this.editArrayIndex = -1
      })
  }

  render() {
    const {parameters, selectedChartChangeHandler} = this.props
    const addParamDefFormContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-12'>
            <label htmlFor='paramName' className='col-md-4'>Name: </label>
            <input type='text' name='paramName' value={this.state.paramDefinition.name}
              onChange={(e) => this.onChangeParamHandler('name', e.target.value)} />
          </div>
          <div className='col-md-12'>
            <label htmlFor='testValue' className='col-md-4'>Test Value: </label>
            <input type='text' name='testValue' value={this.state.paramDefinition.test_value}
              onChange={(e) => this.onChangeParamHandler('test_value', e.target.value)} />
          </div>
          <div className='col-md-12'>
            <label htmlFor='paramFormat' className='col-md-4'>Type: </label>
            <SquealyDropdown
              options={PARAM_FORMAT_OPTIONS}
              name='paramFormat'
              onChangeHandler={this.paramFormatSelectionHandler}
              selectedValue={this.state.selectedValue} />
          </div>
          {
            (this.state.selectedValue === 'datetime' || this.state.selectedValue === 'date')
                ? <div className='col-md-12'>
              <label htmlFor='selectedValueFormat' className='col-md-4'>Date/DateTime Format: </label>
              <input type='text' name='selectedValueFormat'
                value={this.state.paramDefinition.kwargs.format}
                onChange={(e) => this.onChangeParamHandler('kwargs', {'format': e.target.value})} />
            </div>
              : null
          }
          <div className='col-md-12'>
            <label htmlFor='mandatoryField' className='col-md-4'>Mandatory: </label>
            <input type='checkbox' name='mandatoryField'
              value={this.state.paramDefinition.mandatory}
              checked={this.state.paramDefinition.mandatory}
              onChange={(e) => this.onChangeParamHandler('mandatory', e.target.checked)} />
          </div>
          <div className='col-md-12'>
            <label htmlFor='defaultValues' className='col-md-4'>Default Value: </label>
            <input type='text' name='defaultValues'
              value={this.state.paramDefinition.default_value}
              onChange={(e) => this.onChangeParamHandler('default_value', e.target.value)} />
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-default" onClick={this.closeParamForm}>Cancel</button>
            <button className="btn btn-info" onClick={this.saveParamHandler}>Save</button>
          </div>
        </div>
      </div>

    const paramDefinitionEntry =
      <div>
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Test Data</th>
              <th>Type</th>
              <th>Default Value</th>
              <th className="align-center clickable-element">
                <i className="fa fa-plus"
                  aria-hidden="true" data-toggle="modal"
                  onClick={this.addParamDefHandler}>
                </i>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              parameters.length ?
                parameters.map((param, i) => {
                  return (
                    <tr key={'param_row_' + i}>
                      <td onClick={() => this.handleEditParam(i)}
                        className='param-name'>{param.name}</td>
                      <td>{param.test_value}</td>
                      <td>{param.data_type}</td>
                      <td>{param.default_value}</td>
                      <td className="align-center clickable-element">
                        <i className="fa fa-trash-o" aria-hidden="true"
                        onClick={() => this.deleteEntry(i, 'paramDefinition')} />
                      </td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
        {this.state.showParamDefForm && addParamDefFormContent}
      </div>
    return (
      <SquealyModal
        bsSize={'large'}
        modalId='addParameterDefModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Add Parameters Definition'
        helpText='Define your parameters here and provide values for them to test your query. The values under test data column are only for testing purposes.'
        modalContent={paramDefinitionEntry}
        noFooter={true} />
    )
  }
}
