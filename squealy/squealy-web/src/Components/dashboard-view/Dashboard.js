import React, {Component} from 'react'
import Select from 'react-select'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'

import Widget from './Widget'
import {HidashModal} from '../HidashUtilsComponents'
import {GOOGLE_CHART_TYPE_OPTIONS, INCORRECT_JSON_ERROR} from '../../Constant'
import {isJsonString, getEmptyWidgetDefinition} from '../../Utils'


export default class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showEditWidgetModal: false,
      showAddWidgetModal: false,
      selectedWidget:  null,
      editorContent: null,
      newWidget: null
    }
  }

  selectedWidgetIndex = null

  // Launches the edit widget modal and sets the selected widget in the state
  modalVisibilityEnabler = (widgetIndex) => {
    this.selectedWidgetIndex = widgetIndex
    let newEditorContent = JSON.stringify(this.props.dashboardDefinition.widgets[widgetIndex].chartStyles)
    newEditorContent = JSON.stringify(JSON.parse(newEditorContent), null, '\t')
    this.setState({
      showEditWidgetModal: true,
      selectedWidget: this.props.dashboardDefinition.widgets[widgetIndex],
      editorContent: newEditorContent
    })
  }

  addWidgetModalenabler = () => {
    this.setState({
      showAddWidgetModal: true,
      newWidget: getEmptyWidgetDefinition()
    })
  }

  newWidgetChangeHandler = (keyToUpdate, updatedValue) => {
    let updatedNewWidget = Object.assign({}, this.state.newWidget)
    updatedNewWidget[keyToUpdate] = updatedValue
    this.setState({newWidget: updatedNewWidget})
  }

  saveNewWidget = () => {
    this.props.widgetAdditionHandler(this.props.selectedDashboardIndex, this.state.newWidget)
    this.setState({
      'showAddWidgetModal': false
    })
  }

  // Updates the definition of selected widget
  updateWidgetData = (keyToUpdate, updatedValue) => {
    let selectedWidgetNewDefinition = Object.assign({}, this.state.selectedWidget)
    selectedWidgetNewDefinition[keyToUpdate] = updatedValue
    this.setState({selectedWidget: selectedWidgetNewDefinition})
  }

  // Passes the updated widget data saved in the state to the dashboard container
  // and closes the edit widget modal
  saveUpdatedWidgetData = () => {
    if(isJsonString(this.state.editorContent)) {
      let updatedWidgetDefinition = Object.assign({}, this.state.selectedWidget)
      updatedWidgetDefinition.chartStyles = JSON.parse(this.state.editorContent)
      this.props.updateWidgetDefinition(0, this.selectedWidgetIndex, updatedWidgetDefinition)
      this.setState({showEditWidgetModal: false})
    }else {
      console.error(INCORRECT_JSON_ERROR)
    }
  }

  updateEditorContent = (updatedEditorContent) => {
    this.setState({editorContent: updatedEditorContent})
  }

  render() {
    const {
      dashboardDefinition,
      widgetAdditionHandler,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      selectedDashboardIndex
    } = this.props

    const {selectedWidget, editorContent, newWidget} = this.state
    const modalContent = 
      selectedWidget?
        <div className="row">
          <div className="col-md-12">
            <label className='col-md-4'>Widget Title: </label>
            <input
              type='text'
              ref='widgetTitle'
              value={selectedWidget.title}
              onChange={(event)=>this.updateWidgetData('title', event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className='col-md-4'>Chart type: </label>
            <div className="col-md-5" style={{paddingLeft: '0', paddingRight: '35px'}}>
              <Select
                options={GOOGLE_CHART_TYPE_OPTIONS}
                value={selectedWidget.chartType}
                onChange={(chartType)=>this.updateWidgetData('chartType', chartType.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label className='col-md-4'>Chart Styles: </label>
            <div className="col-md-12">
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="100px"
                width="100%"
                fontSize={15}
                maxLines={20}
                minLines={8}
                highlightActiveLine={true}
                ref="ace"
                value={editorContent}
                editorProps={{$blockScrolling: true}}
                onChange={this.updateEditorContent}
                onLoad={(editor => editor.focus())}
              />
            </div>
          </div>
        </div>
      :
        null
    const addWidgetModalContent = 
      newWidget?
      <div className="row">
          <div className="col-md-12">
            <label className='col-md-4'>API url: </label>
            <input
              type='text'
              ref='widgetTitle'
              value={newWidget.api_url}
              onChange={(event)=>this.newWidgetChangeHandler('api_url', event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className='col-md-4'>Widget Title: </label>
            <input
              type='text'
              ref='widgetTitle'
              value={newWidget.title}
              onChange={(event)=>this.newWidgetChangeHandler('title', event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className='col-md-4'>Chart type: </label>
            <div className="col-md-5" style={{paddingLeft: '0', paddingRight: '35px'}}>
              <Select
                options={GOOGLE_CHART_TYPE_OPTIONS}
                value={newWidget.chartType}
                onChange={(chartType)=>this.newWidgetChangeHandler('chartType', chartType.value)}
              />
            </div>
          </div>
        </div>
        :
          null
    return(
      <div id="dashboardAreaWrapper">
        <button className="btn btn-info" onClick={this.addWidgetModalenabler}>
          Add a new widget
        </button>
        <input
          type='text'
          ref='widgetTitle'
          value={dashboardDefinition.styles.background}
          onChange={(event)=>updateDashboardDefinition(0, 'styles', {background:event.target.value})}
        />
        <div id="dashboardArea" style={dashboardDefinition.styles}>
          {
            dashboardDefinition.widgets.map((widget, index) =>
              <Widget
                key={index}
                index={index}
                modalVisibilityEnabler={this.modalVisibilityEnabler}
                widgetResizeHandler={widgetResizeHandler}
                widgetRepositionHandler={widgetRepositionHandler}
                widgetData={widget}
                selectedDashboardIndex={selectedDashboardIndex}
              />
            )
          }
          <HidashModal
            modalId='EditWidgetModal'
            closeModal={()=>this.setState({showEditWidgetModal: false})}
            showModal={this.state.showEditWidgetModal}
            modalHeader='Edit Widget Definition' 
            modalContent={modalContent}
            saveChanges={this.saveUpdatedWidgetData}
          />
          <HidashModal
            modalId='AddWidgetModal'
            closeModal={()=>this.setState({showAddWidgetModal: false})}
            showModal={this.state.showAddWidgetModal}
            modalHeader='Add new widget' 
            modalContent={addWidgetModalContent}
            saveChanges={this.saveNewWidget}
          />
        </div>
      </div>
    )
  }
}
