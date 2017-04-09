import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown} from './SquealyUtilsComponents'
import { PARAM_TYPE_OPTIONS, PARAM_FORMAT_OPTIONS, PARAM_TYPE_MAP, PARAM_FORMAT_MAP } from './../Constant'
import { getEmptyParamDefinition } from './../Utils'
import moment from 'moment'
import { FormErrorMessage } from './ErrorMessageComponent'


export default class ParamDefinitionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedFormatValue: 'string',
      selectedType: 'query',
      paramDefinition: getEmptyParamDefinition(),
      editMode: false,
      selectedDateFormat: 'DD-MM-YYYY',
      selectedDateTimeFormat: 'DD-MM-YYYY LT',
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false,
      validateFormat: false,
      editArrayIndex: -1,
      dropdownApiOptions: [],
      selectedDropdownAPI: ''
    }
  }

  componentDidMount() {
    const {filters} = this.props
    let dropdownApiOptions = [], selectedDropdownAPI

    filters.map((filter) => {
      dropdownApiOptions.push({
        value: filter.url,
        label: filter.name
      })
    })

    selectedDropdownAPI = dropdownApiOptions.length ? dropdownApiOptions[0].value : ''

    this.setState({dropdownApiOptions: dropdownApiOptions, selectedDropdownAPI: selectedDropdownAPI})
  }

  //Function to validate string
  validateString = (checkField, errorField) => {
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
  validateParamValueFormat = (checkField, errorField) => {
    let typeFormat = 'string'
    typeFormat = (this.state.selectedFormatValue === 'date') ?
      'selectedDateFormat' : 
      (this.state.selectedFormatValue === 'datetime') ?
      'selectedDateTimeFormat' : 'string'

    let change = false
    if (this.state.selectedFormatValue !== 'date' && this.state.selectedFormatValue !== 'datetime') {
        change = this.validateString(checkField, errorField) || change
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
      selectedType: 'query',
      order: this.props.parameters.length+1,
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false,
      selectedFormatValue: 'string',
      selectedDateFormat: 'DD-MM-YYYY',
      selectedDateTimeFormat: 'DD-MM-YYYY LT'
    })
  }

  //Function to open close param form
  closeParamForm = () => {
    this.setState({
      showParamDefForm: false,
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false})
  }


  //Function to select Type for Predefined params
  paramFormatSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition)),
      dateFormat = 'DD-MM-YYYY',
      dateTimeFormat = 'DD-MM-YYYY LT',
      selectedDropdownAPI = ''
    currentParamDefinition['data_type'] = value
    dateFormat = this.state.selectedDateFormat || dateFormat
    dateTimeFormat = this.state.selectedDateTimeFormat || dateTimeFormat
    selectedDropdownAPI = (value === 'dropdown' && this.state.dropdownApiOptions.length) ? 
      this.state.dropdownApiOptions[0].value :
      (this.state.selectedDropdownAPI || '')
    this.setState({
      selectedFormatValue: value,
      paramDefinition: currentParamDefinition,
      selectedDateFormat: dateFormat,
      selectedDateTimeFormat: dateTimeFormat,
      selectedDropdownAPI: selectedDropdownAPI
    })
  }

  paramTypeSelectionHandler = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition)),
    formatType = value === 'user' ? 'string' : this.state.selectedFormatValue
    currentParamDefinition['type'] = (value === 'query') ? 1 : 2

    this.setState({ 
      selectedType: value,
      paramDefinition: currentParamDefinition,
      selectedFormatValue: formatType,
      errorName: false,
      errorTestValue: false,
      errorDefaultValue: false
    })
  }

  onChangeParamHandler = (key, value, errorField) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition[key] = value
    this.setState({ paramDefinition: currentParamDefinition },
      (errorField === 'errorName') ?
        () => this.validateString(key, errorField)
        :
        () => this.validateParamValueFormat(key, errorField))
  }

  handleEditParam = (e, index) => {
    const {parameters} = this.props
    let dateFormatType = parameters[index].data_type === 'date' || null,
      dateTimeFormatType = parameters[index].data_type === 'datetime' || null,
      selectedDropdownAPI = parameters[index].dropdown_api || ''

    this.setState({ showParamDefForm: true }, () => {
      let currentParamDefinition = JSON.parse(JSON.stringify(this.props.parameters[index]))
      currentParamDefinition.order = currentParamDefinition.order === null ? '' : currentParamDefinition.order

      this.setState({
        editMode: true,
        selectedDateFormat: dateFormatType ? currentParamDefinition.kwargs.format : '',
        selectedDateTimeFormat: dateTimeFormatType ? currentParamDefinition.kwargs.format : '',
        selectedFormatValue: currentParamDefinition.data_type,
        paramDefinition: currentParamDefinition,
        selectedType: PARAM_TYPE_MAP[currentParamDefinition.type],
        errorName: false,
        errorTestValue: false,
        errorDefaultValue: false,
        editArrayIndex: index,
        selectedDropdownAPI: selectedDropdownAPI
      })
    })
  }

  deleteEntry = (e, index, fieldName) => {
    e.stopPropagation()
    let currentParameters = [...this.props.parameters]
    currentParameters.splice(index, 1)
    this.props.chartMode ?
      this.props.selectedChartChangeHandler({parameters: currentParameters}) :
      this.props.selectedFilterChangeHandler({parameters: currentParameters})
    if (index === this.state.editArrayIndex) {
      this.setState({
        paramDefinition: getEmptyParamDefinition(),
        selectedFormatValue: 'string',
        selectedType: 'query',
        selectedDropdownAPI: '',
        showParamDefForm: (index === this.state.editArrayIndex) ? false : this.state.showParamDefForm
      })
    }
  }


  updateOrderOfCharts = (obj1, obj2) => {
    let firstObjOrder = obj1.order === '' ? Number.MAX_VALUE : parseInt(obj1.order, 10),
      secondObjOrder = obj2.order === '' ? Number.MAX_VALUE : parseInt(obj2.order, 10)
    if (firstObjOrder < secondObjOrder) {
      return -1
    }
    if (firstObjOrder > secondObjOrder) {
      return 1
    }
    return 0
  }


  saveParamHandler = () => {
    let checkVar = this.validateString('name', 'errorName')
    checkVar = this.validateParamValueFormat('test_value', 'errorTestValue') || checkVar

    if (this.state.selectedType === 'query') {
      checkVar = this.validateParamValueFormat('default_value', 'errorDefaultValue') || checkVar
    }
    let curParamDef = JSON.parse(JSON.stringify(this.state.paramDefinition))

    if (checkVar) {
      return
    }

    let selectedChartParamDef = JSON.parse(JSON.stringify(this.props.parameters))
    curParamDef.order = curParamDef.order === '' ? null : curParamDef.order
    curParamDef.dropdown_api = curParamDef.data_type === 'dropdown' ? this.state.selectedDropdownAPI : ''
    
    if (this.state.editMode) {
      selectedChartParamDef[this.state.editArrayIndex] = curParamDef
    } else {
      selectedChartParamDef.push(curParamDef)
    }
    selectedChartParamDef.sort(this.updateOrderOfCharts)
    this.props.chartMode ?
      this.props.selectedChartChangeHandler({'parameters':selectedChartParamDef},
      () => {
        this.setState({ showParamDefForm: false, editMode: false, editArrayIndex: -1 })
        this.props.updateNoteHandler(false)
      }):
      this.props.selectedFilterChangeHandler({parameters: selectedChartParamDef},
      () => {
        this.setState({ showParamDefForm: false, editMode: false, editArrayIndex: -1 })
        this.props.updateNoteHandler(false)
      })
  }

  onChangeDropdownApi = (value) => {
    let currentParamDefinition = JSON.parse(JSON.stringify(this.state.paramDefinition))
    currentParamDefinition['dropdown_api'] = value
    this.setState({ 
      paramDefinition: currentParamDefinition,
      selectedDropdownAPI: value
    })
  }

  render() {
    const {parameters, selectedChartChangeHandler, note, selectedFilterChangeHandler, chartMode} = this.props
    const addParamDefFormContent =
      <div className="modal-container">
        <div className='add-modal-content'>
          {
            !this.state.editMode && chartMode &&
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
                onChange={(e) => this.onChangeParamHandler('name', e.target.value, 'errorName')}
                />
            </div>
            {
              this.state.errorName &&
              <FormErrorMessage classValue={'col-md-8 pull-right validation-error'}
                message={'Error in name'} />
            }
          </div>
          { chartMode &&
            <div className='row'>
              <label className='col-md-4' htmlFor='orderVal'>Order:</label>
              <div className='col-md-8'>
                <input type='number' name='orderVal'
                  value={this.state.paramDefinition.order}
                  onChange={(e) => this.onChangeParamHandler('order', e.target.value)} />
              </div>
            </div>
          }
          <div className='row'>
            <label htmlFor='testValue' className='col-md-4'>Test Data: </label>
            <div className='col-md-8'>
              <input type='text' name='testValue'
                value={this.state.paramDefinition.test_value}
                onChange={(e) => this.onChangeParamHandler('test_value', e.target.value, 'errorTestValue')}
                />
            </div>
            {
              this.state.errorTestValue &&
              <FormErrorMessage classValue={'col-md-8 pull-right validation-error'}
                message={'Error in Test Value'} />
            }
          </div>
          {this.state.selectedType === 'query' && chartMode &&
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
          {(this.state.selectedType === 'query' && this.state.selectedFormatValue === 'date') &&
            chartMode &&
            <div className='row'>
              <label htmlFor='dateFormat' className='col-md-4'>Date Format: </label>
              <div className='col-md-8'>
                <input type='text' name='dateFormat' value={this.state.selectedDateFormat}
                  onChange={(e) => this.setInputDateFormat(e.target.value, 'selectedDateFormat')} />
              </div>
              {
                (this.state.selectedFormatValue === 'date') && this.state.validateFormat &&
                <FormErrorMessage classValue={''} message={'Enter valid date format'} />
              }
            </div>
          }
          {(this.state.selectedType === 'query' && this.state.selectedFormatValue === 'datetime') &&
            chartMode &&
            <div className='row'>
              <label htmlFor='dateTimeFormatDropdown' className='col-md-4'>DateTime Format: </label>
              <div className='col-md-8'>
                <input type='text' name='dateTimeFormatDropdown'
                  value={this.state.selectedDateTimeFormat}
                  onChange={(e) => this.setInputDateFormat(e.target.value, 'selectedDateTimeFormat')} />
              </div>
              {
                (this.state.selectedFormatValue === 'datetime') && this.state.validateFormat &&
                <FormErrorMessage classValue={''} message={'Enter valid datetime format'} />
              }
            </div>
          }
          {(this.state.selectedType === 'query' && this.state.selectedFormatValue === 'dropdown') &&
            chartMode &&
            <div className='row'>
              <label htmlFor='dropwdownApi' className='col-md-4'>Dropdown API: </label>
              <div className='col-md-8'>
                <SquealyDropdown
                  options={this.state.dropdownApiOptions}
                  name='dropwdownApi'
                  onChangeHandler={this.onChangeDropdownApi}
                  selectedValue={this.state.selectedDropdownAPI} />
              </div>
            </div>
          }
          {
            this.state.selectedType === 'query' && this.state.selectedFormatValue === 'dropdown' &&
            <div className='row'>
              <label htmlFor='isParameterized' className='col-md-4'>Parameterized: </label>
              <div className='col-md-8'>
                <input type='checkbox' name='isParameterized'
                  value={this.state.paramDefinition.is_parameterized}
                  checked={this.state.paramDefinition.is_parameterized}
                  onChange={(e) => this.onChangeParamHandler('is_parameterized', e.target.checked)} />
              </div>
            </div>
          }
          {
            this.state.selectedType === 'query' && chartMode &&
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
            (this.state.selectedType === 'query' || !chartMode) &&
            <div className='row'>
              <label htmlFor='defaultValues' className='col-md-4'>Default Value: </label>
              <div className='col-md-8'>
                <input type='text' name='defaultValues'
                  value={this.state.paramDefinition.default_value}
                  onChange={(e) => this.onChangeParamHandler('default_value', e.target.value, 'errorDefaultValue')} />
              </div>
              {
                this.state.errorDefaultValue &&
                <FormErrorMessage classValue={'col-md-8 pull-right validation-error'} message={'Error in Default Value'} />
              }
            </div>
          }
          <div className='row param-form-footer'>
            <button className="btn btn-default" onClick={this.closeParamForm}>Cancel</button>
            <button className="btn btn-info" onClick={this.saveParamHandler}>Save</button>
          </div>
        </div>
      </div>

    const paramDefinitionEntry =
      <div>
        {note ? <p className="note-text">{note}</p> : null}
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              {chartMode && <th>Type</th>}
              <th>Name</th>
              <th>Test Data</th>
              {chartMode && <th>Format</th>}
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
                      className={this.state.editArrayIndex === i ? 'selected param-row' : 'param-row'}
                      >
                      {chartMode && <td>{param.type}</td>}
                      <td className='param-name'>{param.name}</td>
                      <td>{param.test_value}</td>
                      {chartMode && <td>{param.data_type ? PARAM_FORMAT_MAP[param.data_type] : '--'}</td>}
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
