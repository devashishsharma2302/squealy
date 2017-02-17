import React, { Component } from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { PARAM_FORMAT_OPTIONS } from './../../Constant'
import AceEditor from 'react-ace'


export default class ParamDefinitionModalWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefForm: false,
      selectedValue: 'dateTime',
      query: '',
      isParamDefCustom: false
    }
  }
  //TODO: Need to write logic to save definition in state.
  handleEditParam = (bool, index) => {
    // this.setState({editParam: bool, paramIndex:index})
    // let selectedApiParamDef = this.props.selectedApiDefinition.paramDefinition
    // this.setState({selectedApiParamDef: selectedApiParamDef[index]})
    // if(bool) {
    //   this.setState({showParamModal: bool})
    // }
    console.log('Editing Param Def modal', index)
  }

  deleteEntry = (index, fieldName) => {
    // let curdata = this.props.selectedApiDefinition[fieldName].slice()
    // curdata.splice(index, 1)
    // this.props.onChangeApiDefinition(fieldName, curdata)
    console.log('Deleting Param Def modal', index, fieldName)
  }

  addParamDefHandler = () => {
    this.setState({ showParamDefForm: true })
    console.log('Adding Param Modal')
  }

  closeParamForm = () => {
    this.setState({ showParamDefForm: false })
  }

  saveParamHandler = () => {
    console.log('saving it')
  }

  render() {
    const {parameters, onChangeChartDefinition} = this.props
    const addParamDefFormHTML =
    <div className="modal-container">
      <div className='row add-modal-content'>
        <i className="fa fa-times" aria-hidden="true" onClick={this.closeParamForm}></i>
        <div className="validation-options">
          <label className='radio-inline'>
            <input type="radio" name='paramDefType' ref='paramDefinitionPre'
               checked={!this.state.isParamDefCustom}
              onChange={() => { this.onChangeParamDefType(false) } } />Pre Defined
          </label>
          <label className='radio-inline'>
            <input type='radio' name='paramDefType' ref='paramDefinitionCustom'
              checked={this.state.isParamDefCustom}
              onChange={() => { this.onChangeParamDefType(true) } } />Custom
          </label>
        </div>

        <div className='col-md-12'>
          <label htmlFor='varName' className='col-md-4'>Variable Name: </label>
          <input type='text' name='varName' id='varName' ref='varName' />
        </div>
        {
          this.state.isParamDefCustom ? <div className='col-md-12'>
            <label htmlFor='customParamPath' className='col-md-4'>Custom Param Definition Path: </label>
            <input type='text' name='customParamPath' id='customParamPath' ref='customParamPath' />
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
            <input type='text' name='selectedValueFormat' id='selectedValueFormat'
              ref='selectedValueFormat' />
          </div>
            : null
        }
        <div className='col-md-12'>
          <label htmlFor='mandatoryField' className='col-md-4'>Mandatory: </label>
          <input type='checkbox' name='mandatoryField' id='mandatoryField' ref='mandatoryField' />
        </div>
        <div className='col-md-12'>
          <label htmlFor='customParamPath' className='col-md-4'>Default Values: </label>
          <input type='text' name='defaultValues' id='defaultValues' ref='defaultValues' />
        </div>
      </div>
    </div>

    const paramDefinitionHTML =
      <div>
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Format</th>
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
                      <td onClick={() => this.handleEditParam(true, i)}
                        className='param-name'>{param.name}</td>
                      <td>{param.type}</td>
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
          saveChanges={this.saveParamHandler} />
      </div>
    )
  }
}
