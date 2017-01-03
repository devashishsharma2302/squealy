import React, {Component} from 'react'
import {HidashModal, HidashDropdown} from './HidashUtilsComponents'
import {PARAM_FORMAT_OPTIONS} from './../Constant'
import AceEditor from 'react-ace'


export default class ParamDefinitionModalWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: 'dateTime',
      showValidationForm: false,
      isValidationTypeQuery: true,
      query: '',
      isParamDefCustom: false
    }
  }
  editParam = false
  editParamIndex = -1

  paramFormatSelectionHandler = (value) => {
    this.setState({selectedValue: value})
  }

  //Reset Input field every time open modal to add new validations
  resetValidations = () => {
    this.setState({showValidationForm: true}, () => {
      this.refs.errorMessage.value = ''
      this.refs.errorCode.value = ''
      this.refs.validationQuery.value = ''
    })
  }

  onChangeValidationType = (bool) => {
    this.setState({isValidationTypeQuery: bool})
  }


  onChangeParamDefType = (value) => {
    this.setState({isParamDefCustom: value})
  }

  saveParamHandler = () => {
    let paramDef = this.props.selectedApiDefinition.paramDefinition.slice()
    if (this.state.isParamDefCustom && !this.refs.customParamPath.value) {
      console.error('Custom Param Definition Path is mandatory if paramDefinition type is selected as Custom')
      return
    }

    let newParamObj = {
      isParamDefCustom: this.state.isParamDefCustom,
      name: this.refs.varName.value,
      type: this.state.isParamDefCustom ? this.refs.customParamPath.value : this.state.selectedValue,
      optional: this.refs.mandatoryField.checked ? false : true,
      default_values: this.refs.defaultValues.value
    }

    if (!this.state.isParamDefCustom && (this.state.selectedValue === 'date' || this.state.selectedValue === 'dateTime')) {
      newParamObj.kwargs = {format: this.refs.selectedValueFormat.value}
    }

    if (!this.editParam) {
      paramDef.push(newParamObj)
    } else {
      paramDef[this.editParamIndex] = newParamObj
    }
    this.props.handleEditParam(false, -1)
    this.props.onChangeApiDefinition('paramDefinition', paramDef)
    this.props.closeParamModal()
  }

  getDefaultFunctionObj = () => {
    return {
      validation_function: {
        kwargs: {
          error_message: this.refs.errorMessage.value,
          error_code: this.refs.errorCode.value
        },
        name: this.refs.validationFunc.value
      }
    }
  }

  getDefaultQueryObj = () => {
    return {
      validation_function: {
        name: 'squealy.validators.run_query',
        kwargs: {
          query: this.state.query,
          error_message: this.refs.errorMessage.value,
          error_code: this.refs.errorCode.value
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.editParam = nextProps.editParamState.editParam
    this.editParamIndex = nextProps.editParamState.paramIndex
    if (nextProps.editParamState.editParam) {
      let selectedApiParamDef = nextProps.editParamState.selectedApiParamDef
      if (this.refs.hasOwnProperty('selectedValueFormat')) {
        this.refs.selectedValueFormat.value = selectedApiParamDef.kwargs ? selectedApiParamDef.kwargs.format : ''
      }
      if (selectedApiParamDef.paramDefType === 'custom') {
        this.setState({isParamDefCustom: true}, () => {
          this.refs.customParamPath.value = selectedApiParamDef.type
        })
      } else {
        this.setState({isParamDefCustom: false}, () => {
          this.setState({selectedValue: selectedApiParamDef.type})
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.editParam = this.props.editParamState.editParam
    this.editParamIndex = this.props.editParamState.paramIndex
    if (this.props.editParamState.editParam) {
      if (this.refs) {
        let selectedApiParamDef = this.props.editParamState.selectedApiParamDef
        this.refs.varName.value = selectedApiParamDef.name
        this.refs.mandatoryField.checked = !selectedApiParamDef.optional
        this.refs.defaultValues.value = selectedApiParamDef.default_values
      }
    }
  }

  validationQueryHandler = (text) => {
    this.setState({query: text})
  }

  saveValidationHandler = () => {
    let curValidations = this.props.selectedApiDefinition.validations.slice()
    let newValidatorObj = this.state.isValidationTypeQuery ? this.getDefaultQueryObj() : this.getDefaultFunctionObj()

    if (this.editValidationMode) {
      curValidations[this.selectedValidatorIndex] = newValidatorObj
    } else {
      curValidations.push(newValidatorObj)
    }
    this.props.onChangeApiDefinition('validations', curValidations)
    this.setState({showValidationForm: false, query: ''})
    this.editValidationMode = false
    this.selectedValidatorIndex = null
    this.props.closeValidationModal()
  }

  deleteEntry = (index, fieldName) => {
    let curdata = this.props.selectedApiDefinition[fieldName].slice()
    curdata.splice(index, 1)
    this.props.onChangeApiDefinition(fieldName, curdata)
  }

  editValidation = (index) => {
    let validationObj = this.props.selectedApiDefinition.validations.slice()
    this.setState({showValidationForm: true}, () => {
      this.refs.errorMessage.value = validationObj[index].validation_function.kwargs.error_message
      this.refs.errorCode.value = validationObj[index].validation_function.kwargs.error_code
      if(validationObj[index].validation_function.kwargs) {
        this.setState({query: validationObj[index].validation_function.kwargs.query})
      }
      else {
        this.refs.validationFunc.value = validationObj[index].validation_function.name
      }
    })
    this.editValidationMode = true
    this.selectedValidatorIndex = index
  }

  render() {
    const {selectedApiDefinition, onChangeApiDefinition, editParam} = this.props
    let paramDefinition = selectedApiDefinition.paramDefinition,
      validations = selectedApiDefinition.validations
    //Modal body for Add Param modal
    let addParamModalContent =
      <div className='row add-modal-content'>
        <div className="validation-options">
          <label className='radio-inline'>
            <input type="radio" name='paramDefType' ref='paramDefinitionPre' checked={!this.state.isParamDefCustom} onChange={() => {this.onChangeParamDefType(false)}}/>Pre Defined
          </label>
          <label className='radio-inline'>
            <input type='radio' name='paramDefType' ref='paramDefinitionCustom' checked={this.state.isParamDefCustom} onChange={() => {this.onChangeParamDefType(true)}}/>Custom
          </label>
        </div>

        <div className='col-md-12'>
          <label htmlFor='varName' className='col-md-4'>Variable Name: </label>
          <input type='text' name='varName' id='varName' ref='varName'/>
        </div>
        {
          this.state.isParamDefCustom ? <div className='col-md-12'>
            <label htmlFor='customParamPath' className='col-md-4'>Custom Param Definition Path: </label>
            <input type='text' name='customParamPath' id='customParamPath' ref='customParamPath'/>
          </div> :
          <div className='col-md-12'>
            <label htmlFor='paramFormat' className='col-md-4'>Param Definition Format: </label>
            <HidashDropdown
              options={PARAM_FORMAT_OPTIONS}
              name='paramFormat'
              onChangeHandler={this.paramFormatSelectionHandler}
              selectedValue={this.state.selectedValue}/>
          </div>
        }
        {
          (!this.state.isParamDefCustom && (this.state.selectedValue === 'dateTime' || this.state.selectedValue === 'date')) ? <div className='col-md-12'>
              <label htmlFor='selectedValueFormat' className='col-md-4'>Date/DateTime Format: </label>
              <input type='text' name='selectedValueFormat' id='selectedValueFormat' ref='selectedValueFormat'/>
            </div>
          : null
        }
        <div className='col-md-12'>
          <label htmlFor='mandatoryField' className='col-md-4'>Mandatory: </label>
          <input type='checkbox' name='mandatoryField' id='mandatoryField' ref='mandatoryField'/>
        </div>
        <div className='col-md-12'>
          <label htmlFor='customParamPath' className='col-md-4'>Default Values: </label>
          <input type='text' name='defaultValues' id='defaultValues' ref='defaultValues'/>
        </div>
      </div>

    //Modal body for Add Validations modal
    let addValidationsModalContent =
      <div className='add-modal-content'>
        <div className='validation-table-wrapper'>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Error Message</th>
                <th>Error Code</th>
                <th>Validation Function/Query</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {validations.length ?
                validations.map((validation, i) => {
                  return (
                    <tr key={'param_row_'+i}>
                      <td onClick={() => this.editValidation(i)} className='param-name'>{validation.validation_function.kwargs.error_message}</td>
                      <td>{validation.validation_function.kwargs.error_code}</td>
                      <td>{validation.validation_function.kwargs.query ? validation.validation_function.kwargs.query : validation.validation_function.name}</td>
                      <td className='delete-validation-button'><div><i className="fa fa-trash-o" aria-hidden="true" onClick={() =>this.deleteEntry(i, 'validations')}/></div></td>
                    </tr>
                  )
                })
              : null}
            </tbody>
            <tfoot><tr><td/><td/><td/><td className='add-validation-button'><div><i className="fa fa-plus-square-o" aria-hidden="true" onClick={this.resetValidations}/></div></td></tr></tfoot>
          </table>
        </div>
        {
          this.state.showValidationForm ?
            <div className='row add-validation-form'>
              <div className='col-md-12'>
                <h3>Add Validation</h3>
                <hr/>
                <div className="validation-options">
                  <label className='radio-inline'>
                    <input type="radio" name='validationType' ref='fValidation' checked={!this.state.isValidationTypeQuery} onChange={() => {this.onChangeValidationType(false)}}/>Function
                    </label>
                  <label className='radio-inline'>
                    <input type='radio' name='validationType' ref='qValidation' checked={this.state.isValidationTypeQuery} onChange={() => {this.onChangeValidationType(true)}}/>Query
                  </label>
                </div>
              </div>
              <div className='col-md-12'>
                <label htmlFor='errorMessage' className='col-md-4'>Error Message</label>
                <input type='text' name='errorMessage' ref='errorMessage'/>
              </div>
              <div className='col-md-12'>
                <label htmlFor='errorCode' className='col-md-4'>Error Code</label>
                <input type='text' name='errorCode' ref='errorCode'/>
              </div>
              <div className='col-md-12'>
                <label htmlFor='validationQuery' className='col-md-4'>Validation {this.state.isValidationTypeQuery ? 'Query' : 'Function' }</label>
                {
                  this.state.isValidationTypeQuery ?
                  <AceEditor
                    mode="sql"
                    theme="tomorrow"
                    name="validationQuery"
                    height="100px"
                    width="50%"
                    fontSize={13}
                    maxLines={10}
                    minLines={5}
                    highlightActiveLine={true}
                    onChange={this.validationQueryHandler}
                    value={this.state.query}
                    ref="validationQuery"
                  /> :
                  <input type='text' name='validationFunc' ref='validationFunc'/>
              }
              </div>
            </div>
          : null
        }
      </div>
    return  (<div>
      <HidashModal modalId='addParamsModal' closeModal={this.props.closeParamModal} showModal={this.props.showParamModal} modalHeader='Add Parameters'
      modalContent={addParamModalContent} saveChanges={this.saveParamHandler}/>
      <HidashModal modalId='addValidationsModal' closeModal={this.props.closeValidationModal} showModal={this.props.showValidationModal} modalHeader='Validations'
      modalContent={addValidationsModalContent} saveChanges={this.saveValidationHandler} modalSize="large"/>
      </div>)
  }
}
