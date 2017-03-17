import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { PARAM_FORMAT_OPTIONS } from './../Constant'
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

      selectedDateFormat: 'DD-MM-YYYY',
      selectedDateTimeFormat:'DD-MM-YYYY LT',
      selectedTimeFormat:'LT',
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false,
      editMode: false

    }
  }
  
  editArrayIndex = -1

  //Fuction to check if date entered is according to the format
  checkFormat = (checkField, errorField,typeFormat) => {
    if (this.state.selectedValue == 'date' || this.state.selectedValue == 'datetime') {
      if (checkField === 'name') {
        if (this.state.paramDefinition[checkField] === '') {
          this.setState({
            [errorField]: true
          })
        } else {
          this.setState({
            [errorField]: false
          })
        }
      } else {
        if (moment(this.state.paramDefinition[checkField], this.state[typeFormat], true).isValid() == false) {
          this.setState({
            [errorField]: true
          })
        } else {
          this.setState({
            [errorField]: false
          })
        }
      }
    } else {
      if (this.state.paramDefinition[checkField] === '') {
        this.setState({
          [errorField]: true
        })
      } else {
        this.setState({
          [errorField]: false
        })
      }
    }
  }
  //Function to validate if right format of date is entered
  setDateFormat = (dateFormat) => {
    let newDateTimeFormat = dateFormat + ' ' + this.state.selectedTimeFormat
    this.setState({
      selectedDateFormat: dateFormat,
      selectedDateTimeFormat:newDateTimeFormat
    })
  }

//funciton to validate time format
setTimeFormat = (timeFormat) => {
  let newDateTimeFormat = this.state.selectedDateFormat + ' ' + timeFormat
  //console.log(moment('13-12-2014 15:00','DD-MM-YYYY HH:mm',true).isValid(),'hello')
  this.setState({
    selectedTimeFormat:timeFormat,
    selectedDateTimeFormat:newDateTimeFormat
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

  saveParamHandler = (typeFormat) => {
    let checkError = false
    if (this.state.paramDefinition.name === '') {
      checkError = true
      this.setState({
        errorName: true
      })
    }
    if (this.state.selectedValue === 'date' || this.state.selectedValue == 'datetime') {
      if (moment(this.state.paramDefinition.test_value, this.state[typeFormat], true).isValid === false) {
        checkError = true
        this.setState({
          errorTestValue: true
        })
      }

      if (moment(this.state.paramDefinition.default_value, this.state[typeFormat], true).isValid === false) {
        checkError = true
        this.setState({
          errorDefaultValue: true
        })
      }
    } else {
      if (this.state.paramDefinition.test_value === '') {
        checkError = true
        this.setState({
          errorTestValue: true
        })
      }
      if (this.state.paramDefinition.default_value === '') {
        checkError = true
        this.setState({
          errorDefaultValue: true
        })
      }

    }

    if (checkError) return;

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
      <div className='modal-container'>
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
              onChange={(e) => this.onChangeParamHandler('name', e.target.value)}
              onBlur={() => {
                let typeSelectedValue = null
                if (this.state.selectedValue == 'date')
                  typeSelectedValue = 'selectedDateFormat'
                else if (this.state.selectedValue == 'datetime')
                  typeSelectedValue = 'selectedDateTimeFormat'
                this.checkFormat('name', 'errorName',typeSelectedValue)
                }
              }/>
            {
              this.state.errorName &&
              <div className="col-md-8 pull-right validation-error">
                <p> Error in name </p>
              </div>
            }
          </div>
          <div className='col-md-12'>
            <label htmlFor='testValue' className='col-md-4'>Test Data: </label>
            <input type='text' name='testValue' value={this.state.paramDefinition.test_value}
              onChange={(e) => this.onChangeParamHandler('test_value', e.target.value)}
              onBlur={() => {
                let typeSelectedValue = null
                if (this.state.selectedValue == 'date')
                  typeSelectedValue = 'selectedDateFormat'
                else if (this.state.selectedValue == 'datetime')
                  typeSelectedValue = 'selectedDateTimeFormat'
                this.checkFormat('test_value', 'errorTestValue',typeSelectedValue)
            }} />
            {
              this.state.errorTestValue &&
              <div className="col-md-8 pull-right validation-error">
                <p> Error in TEst VAlue </p>
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
              : null
          }

          {
            (this.state.selectedValue === 'datetime')
              ? <div className='col-md-12'>
                <label htmlFor='selectedValueFormat' className='col-md-4'>DateTime Format: </label>
                <SquealyDropdown
                  options={DATE_FORMAT_OPTIONS}
                  name='paramFormat'
                  onChangeHandler={this.setDateFormat}
                  selectedValue={this.state.selectedDateFormat} />
                  <SquealyDropdown
                  options={TIME_FORMAT_OPTIONS}
                  name='paramFormat'
                  onChangeHandler={this.setTimeFormat}
                  selectedValue={this.state.selectedTimeFormat} />
                
              </div>
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
              onChange={(e) => this.onChangeParamHandler('default_value', e.target.value)}
              onBlur={() => {
                                let typeSelectedValue = null
                if (this.state.selectedValue == 'date')
                  typeSelectedValue = 'selectedDateFormat'
                else if (this.state.selectedValue == 'datetime')
                  typeSelectedValue = 'selectedDateTimeFormat'
                this.checkFormat('default_value', 'errorDefaultValue',typeSelectedValue)
              }} />
            {
              this.state.errorDefaultValue &&
              <div className="col-md-8 pull-right validation-error">
                <p> Error in Default Value </p>
              </div>
            }
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className='btn btn-default' onClick={this.closeParamForm}>Cancel</button>
            <button className='btn btn-info' onClick={() => {
                              let typeSelectedValue = null
                if (this.state.selectedValue == 'date')
                  typeSelectedValue = 'selectedDateFormat'
                else if (this.state.selectedValue == 'datetime')
                  typeSelectedValue = 'selectedDateTimeFormat'
              this.saveParamHandler(typeSelectedValue)
            }}>Save</button>
          </div>
        </div>
      </div>
    const paramDefinitionEntry =
      <div>
        <table className='table table-hover api-param-def-table'>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Test Data</th>
              <th>Format</th>
              <th>Default</th>
              <th className='align-center clickable-element'>
                <i className='fa fa-plus'
                  aria-hidden='true' data-toggle='modal'
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
                      <td>{param.data_type}</td>
                      <td>{param.default_value}</td>
                      <td className='align-center clickable-element'>
                        <i className='fa fa-trash-o' aria-hidden='true'
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
