import React, { Component} from 'react'
import Select from 'react-select'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'
import { FormErrorMessage } from './ErrorMessageComponent'

export default class AddWidgetModal extends Component {
  constructor() {
    super()
    this.state = {
      widgetName: '',
      widgetNameError: '',
      database: '',
      errorInName: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      const {editMode, widgetData, selectedWidgetIndex} = nextProps
      if (editMode && selectedWidgetIndex && widgetData.length > selectedWidgetIndex) {
        this.setState({
          database: widgetData[selectedWidgetIndex].database,
          widgetName: widgetData[selectedWidgetIndex].name
        })
      } else {
        this.setState({
          database: null,
          widgetName: ''
        })
      }
    }
  }

  onChangeWidgetName = (e) => {
    this.setState({widgetName: e.target.value})
  }

  widgetAdditionModalSave = (e) => {
    const {widgetName, database} = this.state
    let onSuccess = () => {this.setState({widgetNameError: '' }, ()=> {
      this.props.closeModal()
    })},
    onFailure = (error) => {
      this.setState({widgetNameError: JSON.parse(error.responseText).detail})
    }
    if (!widgetName) {
      this.setState({errorInName: true}, () => {
        return
      })
    } else {
      if (this.props.editMode) {
        this.props.selectedWidgetHandler(
          {name: widgetName}, onSuccess, this.props.selectedWidgetIndex, onFailure)
      } else {
        this.props.widgetAdditionHandler(widgetName, database, onSuccess, onFailure)
      }
    }
  }

  onChangeDatabase = (db) => {
    let dbVal = db || ''
    this.setState({database: dbVal}, () => {
      this.props.editMode ? 
        this.props.selectedWidgetHandler({database: dbVal}, null, this.state.selectedWidgetIndex) : null
    })
  }

  render () {
    const {
      selectedWidgetHandler,
      widgetAdditionHandler,
      editMode,
      selectedWidgetIndex,
      modalId,
      modalHeading,
      showModal,
      closeModal,
      databases,
      helpText,
      widgetData
    } = this.props
    let databasesWithBlank = JSON.parse(JSON.stringify(databases))
    databasesWithBlank.unshift({value: '', label: 'Select Database'})
    const {database, widgetNameError, widgetName} = this.state
    const modalContent =
      <div className='app-modal-content'>
        <span className='chart-name-error'> {widgetNameError} </span>
        <div className="row">
          <label className='col-md-4'>Name: </label>
          <input className='chart-name-input' type='text' defaultValue={widgetName} onChange={this.onChangeWidgetName} required={true}/>
          {
            this.state.errorInName &&
            <FormErrorMessage classValue={'col-md-8 pull-right validation-error'}
              message='This field is Mandatory'/>
          }
        </div>
        <div className='row'>
          <label className='col-md-4'>Databse: </label>
          <div className='col-md-8 chart-modal-db'>
            <SquealyDropdown
              options={databasesWithBlank}
              name='paramType'
              onChangeHandler={this.onChangeDatabase}
              selectedValue={(database) ? database : ''} />
          </div>
        </div>
      </div>

    return (
      <SquealyModal
        modalId={modalId}
        closeModal={closeModal}
        showModal={showModal}
        modalHeader= {modalHeading}
        modalContent={modalContent}
        helpText={helpText}
        saveChanges={this.widgetAdditionModalSave} />
    )
  }
}
