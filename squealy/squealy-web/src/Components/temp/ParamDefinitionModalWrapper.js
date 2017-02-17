import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { PARAM_FORMAT_OPTIONS } from './../../Constant'
import { getEmptyParamDefinition } from './../../Utils'


export default class ParamDefinitionModalWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedValue: 'dateTime',
      query: '',
      isParamDefCustom: false,
      paramDefinition: getEmptyParamDefinition()
    }
  }

  //Function to open add param form and initialize form values
  addParamDefHandler = () => {
    this.setState({ 
      showParamDefForm: true,
      paramDefinition: getEmptyParamDefinition(),
      selectedValue: 'dateTime'
    })
  }

  //Function to open close param form
  closeParamForm = () => {
    this.setState({ showParamDefForm: false })
  }

  //Function to change param definition. It can be Custom or Predefined type like Date, DateTime, String 
  onChangeParamDefType = (value) => {
    let currentParamDefinition = Object.assign({}, this.state.paramDefinition)
    currentParamDefinition['paramFormat'] = value ? 'custom' : this.state.selectedValue
    this.setState({
      isParamDefCustom: value,
      selectedValue: currentParamDefinition.paramFormat,
      paramDefinition: currentParamDefinition
    })
  }

  //Function to select Type for Predefined params
  paramFormatSelectionHandler = (value) => {
    let currentParamDefinition = Object.assign({}, this.state.paramDefinition)
    currentParamDefinition['paramFormat'] = value
    this.setState({selectedValue: value, paramDefinition: currentParamDefinition})
  }

  onChangeParamHandler = (key, value) => {
    console.log(key, value)
    let currentParamDefinition = Object.assign({}, this.state.paramDefinition)
    currentParamDefinition[key] = value
    this.setState({paramDefinition: currentParamDefinition})
  }

  handleEditParam = (index) => {
    let currentParamDefinition = Object.assign({}, this.props.parameters[index])
    this.setState({
      selectedValue: currentParamDefinition.paramFormat,
      paramDefinition: currentParamDefinition
    })
  }

  deleteEntry = (index, fieldName) => {
    let currentParameters = [...this.props.parameters]
    currentParameters.splice(index, 1)
    this.props.selectedChartChangeHandler('parameters', currentParameters)
    this.setState({paramDefinition: getEmptyParamDefinition(), selectedValue: 'datetime'})
  }

  saveParamHandler = () => {
    let selectedChartParamDef = [...this.props.parameters]
    selectedChartParamDef.push(this.state.paramDefinition)
    this.props.selectedChartChangeHandler('parameters', selectedChartParamDef)
    this.setState({paramDefinition: getEmptyParamDefinition(), selectedValue: 'dateTime'})
  }

  render() {
    const {parameters, selectedChartChangeHandler} = this.props
    const addParamDefFormHTML =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className="validation-options">
            <label className='radio-inline'>
              <input type="radio" checked={!this.state.isParamDefCustom}
                onChange={() => { this.onChangeParamDefType(false) }} />Pre Defined
            </label>
            <label className='radio-inline'>
              <input type='radio' checked={this.state.isParamDefCustom}
                onChange={() => { this.onChangeParamDefType(true) }} />Custom
            </label>
          </div>

          <div className='col-md-12'>
            <label htmlFor='paramName' className='col-md-4'>Name: </label>
            <input type='text' name='paramName' value={this.state.paramDefinition.paramName} 
              onChange={(e) => this.onChangeParamHandler('paramName', e.target.value)} />
          </div>
          {
            this.state.isParamDefCustom ? <div className='col-md-12'>
              <label htmlFor='customParamPath' className='col-md-4'>Custom Param Definition Path: </label>
              <input type='text' name='customParamPath' 
                value={this.state.paramDefinition.customParamPath} 
                onChange={(e) => this.onChangeParamHandler('customParamPath', e.target.value)} />
            </div> :
              <div className='col-md-12'>
                <label htmlFor='paramFormat' className='col-md-4'>Format: </label>
                <SquealyDropdown
                  options={PARAM_FORMAT_OPTIONS}
                  name='paramFormat'
                  onChangeHandler={this.paramFormatSelectionHandler}
                  selectedValue={this.state.selectedValue} />
              </div>
          }
          {
            (!this.state.isParamDefCustom && 
              (this.state.selectedValue === 'dateTime' || this.state.selectedValue === 'date')) 
                ? <div className='col-md-12'>
              <label htmlFor='selectedValueFormat' className='col-md-4'>Date/DateTime Format: </label>
              <input type='text' name='selectedValueFormat' 
                value={this.state.paramDefinition.selectedValueFormat} 
                onChange={(e) => this.onChangeParamHandler('selectedValueFormat', e.target.value)} />
            </div>
              : null
          }
          <div className='col-md-12'>
            <label htmlFor='mandatoryField' className='col-md-4'>Mandatory: </label>
            <input type='checkbox' name='mandatoryField'
              value={this.state.paramDefinition.mandatoryField}
              checked={this.state.paramDefinition.mandatoryField}
              onChange={(e) => this.onChangeParamHandler('mandatoryField', e.target.checked)} />
          </div>
          <div className='col-md-12'>
            <label htmlFor='defaultValues' className='col-md-4'>Default Values: </label>
            <input type='text' name='defaultValues' 
              value={this.state.paramDefinition.defaultValues} 
              onChange={(e) => this.onChangeParamHandler('defaultValues', e.target.value)} />
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-default" onClick={this.closeParamForm}>Cancel</button>
            <button className="btn btn-info" onClick={this.saveParamHandler}>Save</button>
          </div>
        </div>
      </div>

    const paramDefinitionHTML =
      <div>
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Format/Path</th>
              <th className="add-new">
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
                        className='param-name'>{param.paramName}</td>
                      {
                        param.paramFormat === 'custom' ?
                          <td>{param.customParamPath}</td>
                          : <td>{param.paramFormat}</td>
                      }
                      <td><i className="fa fa-trash-o" aria-hidden="true" 
                        onClick={() => this.deleteEntry(i, 'paramDefinition')} /></td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
        {this.state.showParamDefForm && addParamDefFormHTML}
      </div>
    return (
      <div>
        <SquealyModal
          bsSize={'large'}
          modalId='addParameterDefModal'
          closeModal={this.props.closeModal}
          showModal={this.props.showModal}
          modalHeader='Add Parameters Definition'
          modalContent={paramDefinitionHTML}
          noFooter={true} />
      </div>
    )
  }
}
