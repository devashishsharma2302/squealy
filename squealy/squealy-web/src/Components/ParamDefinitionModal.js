import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { PARAM_FORMAT_OPTIONS, PARAM_TYPE_OPTIONS, PARAM_TYPE_MAP} from './../Constant'
import { getEmptyParamDefinition } from './../Utils'


export default class ParamDefinitionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedFormatValue: 'string',
      query: '',
      selectedType: 'query',
      paramDefinition: getEmptyParamDefinition(),
      editMode: false
    }
  }
  
  editArrayIndex = -1

  //Function to open add param form and initialize form values
  addParamDefHandler = () => {
    this.setState({
      showParamDefForm: true,
      editMode: false,
      paramDefinition: getEmptyParamDefinition(),
      selectedDataType: 'string',
      selectedType: 'query'
    })
  }

  //Function to open close param form
  closeParamForm = () => {
    this.setState({ showParamDefForm: false })
  }


  //Function to select Type for Predefined params
  paramFormatSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['data_type'] = value
    this.setState({selectedFormatValue: value, paramDefinition: currentParamDefinition})
  }

  paramTypeSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['type'] = (value === 'query') ? 1 : 2
    this.setState({selectedType: value, paramDefinition: currentParamDefinition})
  }

  onChangeParamHandler = (key, value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition[key] = value
    this.setState({paramDefinition: currentParamDefinition})
  }

  handleEditParam = (index) => {
    this.setState({ showParamDefForm: true }, () => {
      let currentParamDefinition = this.props.parameters[index]
      this.editArrayIndex = index
      this.setState({
        editMode: true,
        selectedFormatValue: currentParamDefinition.data_type,
        paramDefinition: currentParamDefinition,
        selectedType: PARAM_TYPE_MAP[currentParamDefinition.type]
      })
    })

  }

  deleteEntry = (index, fieldName) => {
    let currentParameters = [...this.props.parameters]
    currentParameters.splice(index, 1)
    this.props.selectedChartChangeHandler('parameters', currentParameters)
    if (index === this.editArrayIndex) {
      this.setState({
        paramDefinition: getEmptyParamDefinition(),
        selectedFormatValue: 'string', 
        selectedType: 'query',
        showParamDefForm: (index === this.editArrayIndex) ? false : this.state.showParamDefForm
      })
    }
  }

  saveParamHandler = () => {
    let selectedChartParamDef = [...this.props.parameters]
    if (this.state.editMode) {
      selectedChartParamDef[this.editArrayIndex] = this.state.paramDefinition
    } else {
      selectedChartParamDef.push(this.state.paramDefinition)
    }

    this.props.selectedChartChangeHandler('parameters', selectedChartParamDef,
      () => {
        this.setState({showParamDefForm: false, editMode: false})
        this.editArrayIndex = -1
      })
  }

  render() {
    const {parameters, selectedChartChangeHandler} = this.props
    const addParamDefFormContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          {
            !this.state.editMode &&
              <div className='col-md-12'>
                <label htmlFor='paramType' className='col-md-4'>Type: </label>
                <SquealyDropdown
                  options={PARAM_TYPE_OPTIONS}
                  name='paramType'
                  onChangeHandler={this.paramTypeSelectionHandler}
                  selectedValue={this.state.selectedType} />
              </div>
          }
          <div className='col-md-12'>
            <label htmlFor='paramName' className='col-md-4'>Name: </label>
            <input type='text' name='paramName' value={this.state.paramDefinition.name}
              onChange={(e) => this.onChangeParamHandler('name', e.target.value)} />
          </div>
          <div className='col-md-12'>
            <label htmlFor='testValue' className='col-md-4'>Test Data: </label>
            <input type='text' name='testValue' value={this.state.paramDefinition.test_value}
              onChange={(e) => this.onChangeParamHandler('test_value', e.target.value)} />
          </div>
          { this.state.selectedType === 'query' &&
            <div>
              <div className='col-md-12'>
                <label htmlFor='paramFormat' className='col-md-4'>Format: </label>
                <SquealyDropdown
                  options={PARAM_FORMAT_OPTIONS}
                  name='paramFormat'
                  onChangeHandler={this.paramFormatSelectionHandler}
                  selectedValue={this.state.selectedFormatValue} />
              </div>
              {
                (this.state.selectedFormatValue === 'datetime' || this.state.selectedFormatValue === 'date')
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
            </div>
          }
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
              <th>Type</th>
              <th>Name</th>
              <th>Test Data</th>
              <th>Format</th>
              <th>Default</th>
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
                      <td>{param.type}</td>
                      <td onClick={() => this.handleEditParam(i)}
                        className='param-name'>{param.name}</td>
                      <td>{param.test_value}</td>
                      <td>{param.data_type ? param.data_type : '--'}</td>
                      <td>{param.default_value ? param.default_value : '--'}</td>
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
