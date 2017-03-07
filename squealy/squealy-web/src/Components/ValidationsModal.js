import React, { Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'

import { SquealyModal } from './SquealyUtilsComponents'

export default class ValidationsModal extends Component {

  constructor() {
    super()
    this.state = {
      selectedValidation: undefined,
      showForm: false,
      validationName: '',
      validationQuery: ''
    }
  }

  // Handles validation editing
  updateFormFields = (index) => {
    const { selectedValidation, validationName, validationQuery } = this.state
    const { validations } = this.props
    this.setState({
      selectedValidation: index,
      validationName: validations[index].name,
      validationQuery: validations[index].query,
      showForm: true
    })

  }

  // Handles validation addition/updation
  onClickSave = () => {
    const { selectedValidation, validationName, validationQuery } = this.state
    let newValidation  = {
      name: validationName,
      query: validationQuery
    }
    let newValidations = JSON.parse(JSON.stringify(this.props.validations))
    if(selectedValidation !== undefined) {
      newValidations[selectedValidation].name = newValidation.name
      newValidations[selectedValidation].query = newValidation.query
    } else {
      newValidations.push(newValidation)
    }
    this.props.selectedChartChangeHandler('validations', newValidations, ()=> {
      this.clearFormFields()
      this.formVisibilityHandler()
    })
  }

  // Handles validation deletion
  validationDeletionHandler = (validationIndex) => {
    let newValidations = this.props.validations.filter((validation, index)=>index!=validationIndex)
    this.props.selectedChartChangeHandler('validations', newValidations)
  }

  // Clears form field values
  clearFormFields = () => {
    this.setState({
      validationQuery: '',
      validationName: '',
      selectedValidation: undefined
    })
  }

  // Handles the visibility of validation form
  formVisibilityHandler = () => {
    this.setState({showForm: !this.state.showForm})
  }

  // Updates form fields
  onChangeHandler = (key, value) => {
    this.setState({[key]: value})
  }

  render () {
    const { testParameters, selectedChartChangeHandler, validations } = this.props
    const {
      selectedValidation,
      showForm,
      validationName,
      validationQuery
    } = this.state
    const form =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-12'>
            <label htmlFor='paramName' className='col-md-2'>Name: </label>
            <input
              type='text'
              name='paramName'
              value={validationName}
              onChange={(e)=>this.onChangeHandler('validationName', e.target.value)}
              />
          </div>
          <div className='col-md-12'>
            <label htmlFor='validationQuery' className='col-md-2'>
              Query:
            </label>
            <div className="col-md-10 validation-query">
              <AceEditor
                mode="sql"
                theme="tomorrow"
                name={'validationQuery'}
                height="200px"
                width="100%"
                fontSize={15}
                maxLines={20}
                minLines={12}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: true}}
                onChange={(value)=>this.onChangeHandler('validationQuery', value)}
                value={validationQuery}
              />
            </div>
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-default" onClick={this.formVisibilityHandler}>Cancel</button>
            <button className="btn btn-primary" onClick={this.onClickSave}>Save</button>
          </div>
        </div>
      </div>

    const modalContent =
      <div>
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="align-center clickable-element">
                <i
                  className="fa fa-plus"
                  aria-hidden="true" data-toggle="modal"
                  onClick={this.formVisibilityHandler}>
                </i>
              </th>
            </tr>
          </thead>
          <tbody>
            {(validations)?
              validations.map((validation, index)=>
                <tr key={'validation_row_' + index}>
                  <td
                    onClick={()=>this.updateFormFields(index)}
                    className='param-name'>{validation.name}</td>
                  <td className="align-center clickable-element">
                    <i className="fa fa-trash-o" aria-hidden="true" 
                    onClick={() => this.validationDeletionHandler(index)} />
                  </td>
                </tr>
              )
              :
              <div>No Validations added</div>
            }
          </tbody>
        </table>
        {(showForm)?form:null}
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='transformationsModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Validations'
        helpText='Write queries to validate the API of this chart. The chart will not be accessible if any of these queries return no rows'
        modalContent={modalContent}
        noFooter={true}
      />
    )
  }
  
}
