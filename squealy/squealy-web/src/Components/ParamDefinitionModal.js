import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown, ErrorMessage } from './SquealyUtilsComponents'
import { PARAM_TYPE_OPTIONS, PARAM_FORMAT_OPTIONS, PARAM_TYPE_MAP, PARAM_FORMAT_MAP } from './../Constant'
import { getEmptyParamDefinition } from './../Utils'
import moment from 'moment'


export default class ParamDefinitionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedFormatValue: 'string',
      query: '',
      selectedType: 'query',
      paramDefinition: getEmptyParamDefinition(),
      editMode: false,
      selectedDateFormat: 'DD-MM-YYYY',
      selectedDateTimeFormat: 'DD-MM-YYYY LT',
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false,
      validateFormat: false,
    }
  }
  
  editArrayIndex = -1


  //Function to validate string
  validateString = (checkField,errorField) => {
    let change = false
    if (this.state.paramDefinition[checkField] === '') {
        change = true
        this.setState({ [errorField]: true })
      } else {
        this.setState({ [errorField]: false })
      }
      return change
  }

  //Function to validate Date and DateTime
  validateParamValueFormat = (checkField,errorField) => {
    let typeFormat = 'string'
    if (this.state.selectedFormatValue === 'date') {
      typeFormat = 'selectedDateFormat'
    }
    else if (this.state.selectedFormatValue === 'datetime') {
      typeFormat = 'selectedDateTimeFormat'
    }
    let change = false
    if (this.state.selectedFormatValue !== 'date' && this.state.selectedFormatValue !== 'datetime') {
        change = this.validateString(checkField,errorField) || change
    } else {
      if (moment(this.state.paramDefinition[checkField], this.state[typeFormat], true).isValid() == false) {
        change = true
        this.setState({ [errorField]: true })
      } else {
        this.setState({ [errorField]: false })
      }
    }
    return change
  }
 
  setInputDateFormat = (setDate, stateKey) => {
    let paramDef = JSON.parse(JSON.stringify(this.state.paramDefinition))
    paramDef.kwargs.format = setDate
    this.setState({
      [stateKey]: setDate,
      paramDefinition: paramDef
    })
  }

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
    this.setState({ selectedFormatValue: value, paramDefinition: currentParamDefinition })
  }

  paramTypeSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['type'] = (value === 'query') ? 1 : 2
    this.setState({ selectedType: value, paramDefinition: currentParamDefinition })
  }

  onChangeParamHandler = (key, value,errorField) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition[key] = value
    this.setState({ paramDefinition: currentParamDefinition },(errorField === 'errorName')? ()=> this.validateString(key,errorField) : () => this.validateParamValueFormat(key, errorField))
  }

  handleEditParam = (e, index) => {
    const {parameters} = this.props
    let dateFormatType = parameters[index].data_type === 'date' || null,
      dateTimeFormatType =  parameters[index].data_type === 'datetime' || null
    this.setState({ showParamDefForm: true }, () => {
      let currentParamDefinition = this.props.parameters[index]
      this.editArrayIndex = index

      this.setState({
        editMode: true,
        selectedDateFormat: dateFormatType ? currentParamDefinition.kwargs.format : '',
        selectedDateTimeFormat: dateTimeFormatType ? currentParamDefinition.kwargs.format : '',
        selectedFormatValue: currentParamDefinition.data_type,
        paramDefinition: currentParamDefinition,
        selectedType: PARAM_TYPE_MAP[currentParamDefinition.type]
      })
    })

  }

  deleteEntry = (e, index, fieldName) => {
    e.stopPropagation()
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
    let checkVar = this.validateString('name', 'errorName')
    checkVar = this.validateParamValueFormat('test_value', 'errorTestValue') || checkVar
    checkVar = this.validateParamValueFormat('default_value', 'errorDefaultValue') || checkVar
    if (checkVar) {
      return;
    }
    let selectedChartParamDef = [...this.props.parameters]
    if (this.state.editMode) {
      selectedChartParamDef[this.editArrayIndex] = this.state.paramDefinition
    } else {
      selectedChartParamDef.push(this.state.paramDefinition)
    }

    this.props.selectedChartChangeHandler('parameters', selectedChartParamDef,
      () => {
        this.setState({ showParamDefForm: false, editMode: false })
        this.editArrayIndex = -1
        this.props.updateNoteHandler(false)
      })
  }


  render() {
    const {parameters, selectedChartChangeHandler, note} = this.props
    const addParamDefFormContent =
      <div className="modal-container">
        <div className='add-modal-content'>
          {
            !this.state.editMode &&
            <div className='row'>
              <label htmlFor='paramType' className='col-md-4'>Type: </label>
              <div className='col-md-8'>
                <SquealyDropdown
                  options={PARAM_TYPE_OPTIONS}
                  name='paramType'
                  onChangeHandler={this.paramTypeSelectionHandler}
                  selectedValue={this.state.selectedType} />
              </div>
            </div>
          }
          <div className='row'>
            <label htmlFor='paramName' className='col-md-4'>Name: </label>
            <div className='col-md-8'>
              <input type='text' name='paramName' 
                value={this.state.paramDefinition.name}
                onChange={(e) => this.onChangeParamHandler('name', e.target.value,'errorName')}
              />
            </div>
            {
              this.state.errorName &&
              <ErrorMessage classValue={'col-md-8 pull-right validation-error'}
                message={'Error in name'} />
            }
          </div>
          <div className='row'>
            <label htmlFor='testValue' className='col-md-4'>Test Data: </label>
            <div className='col-md-8'>
              <input type='text' name='testValue' 
                value={this.state.paramDefinition.test_value}
		onChange={(e) => this.onChangeParamHandler('test_value', e.target.value,'errorTestValue')}
               />
            </div>
            {
              this.state.errorTestValue &&
              <ErrorMessage classValue={'col-md-8 pull-right validation-error'} 
                message={'Error in Test Value'} />
            }
          </div>
          { this.state.selectedType === 'query' && 
            <div className='row'>
              <label htmlFor='paramFormat' className='col-md-4'>Format: </label>
              <div className='col-md-8'>
                <SquealyDropdown
                  options={PARAM_FORMAT_OPTIONS}
                  name='paramFormat'
                  onChangeHandler={this.paramFormatSelectionHandler}
                  selectedValue={this.state.selectedFormatValue} />
              </div>
            </div>
          }
          { (this.state.selectedType === 'query' &&  this.state.selectedFormatValue === 'date') &&
              <div className='row'>
                <label htmlFor='dateFormat' className='col-md-4'>Date Format: </label>
                <div className='col-md-8'>
                  <input type='text' name='dateFormat' value={this.state.selectedDateFormat}
                    onChange={(e) => this.setInputDateFormat(e.target.value, 'selectedDateFormat')} />
                </div>
                {
                  (this.state.selectedFormatValue === 'date') && this.state.validateFormat &&
                  <ErrorMessage classValue={''} message={'Enter valid date format'} />
                }
              </div>
          }
          {(this.state.selectedType === 'query' && this.state.selectedFormatValue === 'datetime') &&
            <div className='row'>
              <label htmlFor='dateTimeFormatDropdown' className='col-md-4'>DateTime Format: </label>
              <div className='col-md-8'>
                <input type='text' name='dateTimeFormatDropdown' 
                  value={this.state.selectedDateTimeFormat}
                  onChange={(e) => this.setInputDateFormat(e.target.value, 'selectedDateTimeFormat')} />
              </div>
              {
                (this.state.selectedFormatValue === 'datetime') && this.state.validateFormat &&
                <ErrorMessage classValue={''} message={'Enter valid datetime format'} />
              }
            </div>
          }
          {
            this.state.selectedType === 'query' && 
            <div className='row'>
              <label htmlFor='mandatoryField' className='col-md-4'>Mandatory: </label>
              <div className='col-md-8'>
                <input type='checkbox' name='mandatoryField'
                  value={this.state.paramDefinition.mandatory}
                  checked={this.state.paramDefinition.mandatory}
                  onChange={(e) => this.onChangeParamHandler('mandatory', e.target.checked)} />
              </div>
            </div>
          }
          {
            this.state.selectedType === 'query' && 
            <div className='row'>
              <label htmlFor='defaultValues' className='col-md-4'>Default Value: </label>
              <div className='col-md-8'>
                <input type='text' name='defaultValues'
                  value={this.state.paramDefinition.default_value}
 		              onChange={(e) => this.onChangeParamHandler('default_value', e.target.value,'errorDefaultValue')} />
              </div>
              {
                this.state.errorDefaultValue &&
                <ErrorMessage classValue={'col-md-8 pull-right validation-error'} message={'Error in Default Value'} />
              }
            </div>
          }
          <div className='row param-form-footer'>
            <button className="btn btn-default" onClick={this.closeParamForm}>Cancel</button>
            <button className="btn btn-info" onClick={this.saveParamHandler }>Save</button>
          </div>
        </div>
      </div>

    const paramDefinitionEntry =
      <div>
        {note ? <p className="note-text">{note}</p> : null}
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
                    <tr key={'param_row_' + i} onClick={(e) => this.handleEditParam(e, i)}
                      className='param-row'>
                      <td>{param.type}</td>
                      <td className='param-name'>{param.name}</td>
                      <td>{param.test_value}</td>
                      <td>{param.data_type ? PARAM_FORMAT_MAP[param.data_type] : '--'}</td>
                      <td>{param.default_value ? param.default_value : '--'}</td>
                      <td className="align-center clickable-element" name='deleteParam'
                        onClick={(e) => this.deleteEntry(e, i, 'paramDefinition')}>
                        <i className="fa fa-trash-o" aria-hidden="true"/>
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


