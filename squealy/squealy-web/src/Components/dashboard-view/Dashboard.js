import React, {
    Component
} from 'react'
import Select from 'react-select'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'

import Widget from './Widget'
import {
    HidashModal
} from '../HidashUtilsComponents'
import {
    GOOGLE_CHART_TYPE_OPTIONS,
    INCORRECT_JSON_ERROR
} from '../../Constant'
import {
    isJsonString,
    getEmptyWidgetDefinition
} from '../../Utils'


export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEditWidgetModal: false,
            showAddWidgetModal: false,
            selectedWidget: null,
            editorContent: null,
            newWidget: null,
            newWidgetApiParams: {}
        }
    }

    selectedWidgetIndex = null

    //Add a new parameter
    addParam = () => {
        let newWidgetDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
        newWidgetDefinition.apiParams[''] = ''
        this.setState({
            selectedWidget: newWidgetDefinition
        })
    }

    //Update Parameter For API
    updateParamKey = (currentKey, newKey) => {
        let newWidgetDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
        let newParams = newWidgetDefinition.apiParams
        
        if (currentKey !== newKey) {
          if(!newParams.hasOwnProperty(newKey)) {
            newParams[newKey] = newParams[currentKey]
            delete newParams[currentKey]
          }
          else {
            delete newParams[currentKey]
          }
        }
        newWidgetDefinition.apiParams = newParams
        this.setState({
            selectedWidget: newWidgetDefinition
        })
    }

    updateParamValue = (key, newValue) => {
        let newWidgetDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
        let newParams = newWidgetDefinition.apiParams
        if (newParams.hasOwnProperty(key)) {
          newParams[key] = newValue
        }
        newWidgetDefinition.apiParams = newParams
        this.setState({
            selectedWidget: newWidgetDefinition
        })
    }

    //Delete Api parameter
    deleteParam = (key) => {
        let newWidgetDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
        let newParams = newWidgetDefinition.apiParams
        delete newParams[key]
        newWidgetDefinition.apiParams = newParams
        this.setState({
            selectedWidget: newWidgetDefinition
        })
    }

    updateNewParamKey = (currentKey, newKey) => {
        let newParams = JSON.parse(JSON.stringify(this.state.newWidgetApiParams))
        if (currentKey !== newKey) {
          if(!newParams.hasOwnProperty(newKey)) {
            newParams[newKey] = newParams[currentKey]
            delete newParams[currentKey]
          }
          else {
            delete newParams[currentKey]
          }
        }
        this.setState({newWidgetApiParams: newParams})
        this.newWidgetChangeHandler('apiParams', newParams)
    }
    updateNewParamValue = (key, newValue) => {
        let newParams = JSON.parse(JSON.stringify(this.state.newWidgetApiParams))
        if (newParams.hasOwnProperty(key)) {
          newParams[key] = newValue
        }
        this.setState({newWidgetApiParams: newParams})
        this.newWidgetChangeHandler('apiParams', newParams)
    }
    addParamToNewWidget = () => {
        let newParams = Object.assign({}, this.state.newWidgetApiParams)
        newParams[''] = ''
        this.setState({newWidgetApiParams: newParams})
        this.newWidgetChangeHandler('apiParams', newParams)
    }

    deleteNewParam = (key) => {
        let newParams = Object.assign({}, this.state.newWidgetApiParams)
        delete newParams[key]
        this.setState({newWidgetApiParams: newParams})
        this.newWidgetChangeHandler('apiParams', newParams)
    }

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
            newWidget: getEmptyWidgetDefinition(),
            newWidgetApiParams: {}

        })
    }

    newWidgetChangeHandler = (keyToUpdate, updatedValue) => {
        let updatedNewWidget = Object.assign({}, this.state.newWidget)
        updatedNewWidget[keyToUpdate] = updatedValue
        this.setState({
            newWidget: updatedNewWidget
        })
    }

    saveNewWidget = () => {
        this.props.widgetAdditionHandler(this.props.selectedDashboardIndex, this.state.newWidget)
        this.setState({
            showAddWidgetModal: false,
            newWidget: {}
        })
    }

    // Updates the definition of selected widget
    updateWidgetData = (keyToUpdate, updatedValue) => {
        let selectedWidgetNewDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
        selectedWidgetNewDefinition[keyToUpdate] = updatedValue
        this.setState({
            selectedWidget: selectedWidgetNewDefinition
        })
    }

    // Passes the updated widget data saved in the state to the dashboard container
    // and closes the edit widget modal
    saveUpdatedWidgetData = () => {
        if (isJsonString(this.state.editorContent)) {
            let updatedWidgetDefinition = JSON.parse(JSON.stringify(this.state.selectedWidget))
            updatedWidgetDefinition.chartStyles = JSON.parse(this.state.editorContent)
            this.props.updateWidgetDefinition(this.props.dashboardIndex, this.selectedWidgetIndex, updatedWidgetDefinition)
            this.setState({
                showEditWidgetModal: false
            })
        } else {
            console.error(INCORRECT_JSON_ERROR)
        }
    }

    updateEditorContent = (updatedEditorContent) => {
        this.setState({
            editorContent: updatedEditorContent
        })
    }

  render() {
    const {
      dashboardDefinition,
      widgetDeletionHandler,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      selectedDashboardIndex,
      dashboardIndex,
      googleDefined
    } = this.props
    const {selectedWidget, editorContent, newWidget, newWidgetApiParams} = this.state
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
          <h5>API Parameters:</h5>
          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Parameter Name</th>
                <th>Value</th>
                <th onClick={this.addParam}><i className="fa fa-plus"></i></th>
              </tr>
            </thead>
            <tbody>
              {
                selectedWidget.apiParams ?
                  Object.keys(selectedWidget.apiParams).map((key, index) => {
                    return (
                      <tr key={key}>
                        <td> <input defaultValue={key} onBlur={(e) => this.updateParamKey(key, e.target.value)} placeholder='Enter Parameter' /></td>
                        <td> <input defaultValue={selectedWidget.apiParams[key]} onBlur={(e) => this.updateParamValue(key, e.target.value)} placeholder="Enter Value" /></td>
                        <td onClick={()=>{this.deleteParam(key)}}><i className="fa fa-trash"/></td>
                      </tr>
                    )
                  })
                  : null
              }
            </tbody>
          </table>
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
          <div className="col-md-12">
          <h5>API Parameters:</h5>
          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Parameter Name</th>
                <th>Value</th>
                <th onClick={this.addParamToNewWidget}><i className="fa fa-plus"></i></th>
              </tr>
            </thead>
            <tbody>
              {
                newWidgetApiParams ?
                  Object.keys(newWidgetApiParams).map((key, index) => {
                    return (
                      <tr key={key}>
                        <td> <input defaultValue={key} onBlur={(e) => this.updateNewParamKey(key, e.target.value)} placeholder='Enter Parameter' /></td>
                        <td> <input defaultValue={newWidgetApiParams[key]} onBlur={(e) => this.updateNewParamValue(key, e.target.value)} placeholder="Enter Value" /></td>
                        <td onClick={()=>{this.deleteNewParam(key)}}><i className="fa fa-trash"/></td>
                      </tr>
                    )
                  })
                  : null
              }
            </tbody>
          </table>
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
                dashboardIndex={dashboardIndex}
                widgetDeletionHandler={widgetDeletionHandler}
                googleDefined={googleDefined}
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
