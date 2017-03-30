import React, { Component} from 'react'
import Select from 'react-select'
import { SquealyModal } from './SquealyUtilsComponents'

export default class AddWidgetModal extends Component {
  constructor() {
    super()
    this.state = {
      widgetName: '',
      widgetNameError: '',
      database: null
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
    if (this.props.editMode) {
      this.props.selectedWidgetHandler(
        {name: widgetName}, onSuccess, this.props.selectedWidgetIndex, onFailure)
    } else {
      this.props.widgetAdditionHandler(widgetName, database, onSuccess, onFailure)
    }
  }

  onChangeDatabase = (db) => {
    let dbVal = db ? db.value : null
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

    const {database, widgetNameError, widgetName} = this.state
    const modalContent =
      <div className='app-modal-content'>
        <span className='chart-name-error'> {widgetNameError} </span>
        <div className="row">
          <label className='col-md-4'>Name: </label>
          <input className='chart-name-input' type='text' defaultValue={widgetName} onChange={this.onChangeWidgetName} />
        </div>
        <div className='row'>
          <label className='col-md-4'>Databse: </label>
          <div className='col-md-8 chart-modal-db'>
            <Select
              value={(database) ? database : null}
              options={databases}
              onChange={this.onChangeDatabase}
              placeholder={'Select Database'}
            />
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
