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
            widgetApiParams: this.props.dashboardDefinition.widgetsParams?this.props.dashboardDefinition.widgetsParams:[],
            apiParamMessage: ''
        }
    }

    selectedWidgetIndex = null

    //Add a new parameter
    addParam = () => {
        let widgetParam = this.state.widgetApiParams.slice()
        widgetParam[this.selectedWidgetIndex][''] = ''
        this.setState({
            widgetApiParams: widgetParam,
            apiParamMessage: ''
        })
    }

    //Update Parameter For API
    updateParam = (index) => {
        let widgetParam = this.state.widgetApiParams.slice()
        if (!widgetParam[this.selectedWidgetIndex].hasOwnProperty(this.refs['paramName' + index].value)) {
            delete widgetParam[this.selectedWidgetIndex]['']
            widgetParam[this.selectedWidgetIndex][this.refs['paramName' + index].value] = null
            this.setState({
                widgetApiParams: widgetParam,
                apiParamMessage: ''
            })
        } else {
            if(widgetParam[this.selectedWidgetIndex][this.refs['paramName' + index].value] === null){
              widgetParam[this.selectedWidgetIndex][this.refs['paramName' + index].value] = this.refs['paramValue' + index].value
              this.setState({
                  widgetApiParams: widgetParam,
                  apiParamMessage: ''
              })
            }
            else {
              this.setState({
                  apiParamMessage: 'Parameter names cannot be repeated.'
              })
            }
        }
    }

    //Delete Api parameter
    deleteParam = (index) => {
        let widgetParam = this.state.widgetApiParams.slice()
        delete widgetParam[this.selectedWidgetIndex][this.refs['paramName' + index].value]
        this.setState({
            widgetApiParams: widgetParam
        })
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
            newWidget: getEmptyWidgetDefinition()
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
        let widgetApiParams = this.state.widgetApiParams.slice()
        widgetApiParams.push({})
        this.setState({
            showAddWidgetModal: false,
            widgetApiParams: widgetApiParams
        })
    }

    // Updates the definition of selected widget
    updateWidgetData = (keyToUpdate, updatedValue) => {
        let selectedWidgetNewDefinition = Object.assign({}, this.state.selectedWidget)
        selectedWidgetNewDefinition[keyToUpdate] = updatedValue
        this.setState({
            selectedWidget: selectedWidgetNewDefinition
        })
    }

    // Passes the updated widget data saved in the state to the dashboard container
    // and closes the edit widget modal
    saveUpdatedWidgetData = () => {
        if (isJsonString(this.state.editorContent)) {
            let updatedWidgetDefinition = Object.assign({}, this.state.selectedWidget)
            updatedWidgetDefinition.chartStyles = JSON.parse(this.state.editorContent)
            let widgetApiParams = this.state.widgetApiParams.slice()
            updatedWidgetDefinition.apiParams = widgetApiParams[this.selectedWidgetIndex]
            this.props.updateWidgetDefinition(this.props.selectedDashboardIndex, this.selectedWidgetIndex, updatedWidgetDefinition)
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
      widgetAdditionHandler,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      selectedDashboardIndex
    } = this.props
    let currentWidgetParams = this.state.widgetApiParams[this.selectedWidgetIndex]
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
          <h5>API Testing Parameters:</h5>
          { this.state.apiParamMessage ? <div className="alert alert-info">
              <strong>Info!</strong> {this.state.apiParamMessage}
              </div> :
            null
          }
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
                currentWidgetParams ?
                  Object.keys(currentWidgetParams).map((key, index) => {
                    return (
                      <tr key={index}>
                        <td> <input defaultValue={key} onBlur={() => this.updateParam(index)} ref={'paramName'+index}  placeholder='Enter Parameter' /></td>
                        <td> <input defaultValue={currentWidgetParams[key]} onBlur={() => this.updateParam(index)} ref={'paramValue'+index} placeholder="Enter Value" /></td>
                        <td onClick={()=>{this.deleteParam(index)}}><i className="fa fa-trash"/></td>
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
