import React, {
    Component
} from 'react'
import Select from 'react-select'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'

import Widget from './Widget'
import Filter from './Filter'
import {
    HidashModal
} from '../HidashUtilsComponents'
import {
    GOOGLE_CHART_TYPE_OPTIONS,
    INCORRECT_JSON_ERROR,
    FILTER_TYPES,
    DEFAULT_FILTER_VALUES
} from '../../Constant'
import {
    isJsonString,
    getEmptyWidgetDefinition,
    getEmptyFilterDefinition
} from '../../Utils'


export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
          showEditWidgetModal: false,
          showAddWidgetModal: false,
          showFilterModal: false,
          selectedWidget: null,
          editorContent: null,
          newWidget: null,
          widgetApiParams: [],
          apiParamMessage: '',
          filterValues: {}
        }
    }

    selectedWidgetIndex = null

    addParam = () => {
        let widgetParam = this.state.widgetApiParams.slice()
        widgetParam[this.selectedWidgetIndex]['key'] = 'value'
        this.setState({
            widgetApiParams: widgetParam,
            apiParamMessage: ''
        })
    }

    updateFilterValues = (name, value) => {
      let newFilterValues = Object.assign({}, this.state.filterValues)
      newFilterValues[name] = value
      this.setState({filterValues: newFilterValues})
    }

    updateParam = (index) => {
      let widgetParam = this.state.widgetApiParams.slice()
      if (!widgetParam[this.selectedWidgetIndex].hasOwnProperty(this.refs['paramName' + index].value)) {
          delete widgetParam[this.selectedWidgetIndex]['key']
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

    filterModalEnabler = () => {
      this.setState({
        showFilterModal: true,
        selectedFilter: getEmptyFilterDefinition()
      })
    }

    newWidgetChangeHandler = (keyToUpdate, updatedValue) => {
      let updatedNewWidget = Object.assign({}, this.state.newWidget)
      updatedNewWidget[keyToUpdate] = updatedValue
      this.setState({
          newWidget: updatedNewWidget
      })
    }

    // Updates the filter definition in this component's state
    // called by fields in filter modal
    updateFilterDefinition = (keyToUpdate, updatedValue) => {
      let newFilterDefinition = Object.assign({}, this.state.selectedFilter)
      newFilterDefinition[keyToUpdate] = updatedValue
      this.setState({selectedFilter: newFilterDefinition})
    }

    saveNewFilter = () => {
      const {selectedFilter} = this.state
      let newFilterValues = this.state.filterValues
      newFilterValues[selectedFilter.label] = DEFAULT_FILTER_VALUES[selectedFilter.type]
      this.setState({
        showFilterModal: false,
        filterValues: newFilterValues
      },() => {
        this.props.filterAdditionHandler(
          this.props.selectedDashboardIndex,
          this.state.selectedFilter
        )
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
          this.props.updateWidgetDefinition(0, this.selectedWidgetIndex, updatedWidgetDefinition)
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

    filterModalVisibilityEnabler = (filterIndex) => {
      const {dashboardDefinition} = this.props
      this.setState({
        selectedFilter: dashboardDefinition.filters[filterIndex],
        showFilterModal: true
      })
    }

  render() {
    const {
      dashboardDefinition,
      widgetAdditionHandler,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      selectedDashboardIndex,
      deleteFilter,
      filterResizeHandler,
      filterRepositionHandler
    } = this.props
    let currentWidgetParams = this.state.widgetApiParams[this.selectedWidgetIndex]
    const {selectedWidget, editorContent, newWidget, selectedFilter} = this.state
    const filterModalContent =
      selectedFilter?
      <div className="row">
        <div className="col-md-12">
          <label className="col-md-4">Filter Label: </label>
          <input 
            type="text"
            ref="filterLabel"
            value={selectedFilter.label}
            onChange={(event)=>this.updateFilterDefinition('label', event.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label className="col-md-4">Filter Type: </label>
          <div className="col-md-5" style={{paddingLeft: '0', paddingRight: '35px'}}>
            <Select
              options={FILTER_TYPES}
              value={selectedFilter.type}
              onChange={(format)=>this.updateFilterDefinition(
                'type',
                format?format.value:null
              )}
            />
          </div>
        </div>
        {(selectedFilter.type === 'dropdown')?
          <div className="col-md-12">
            <label className="col-md-4">Api Url: </label>
            <input 
              type="text"
              ref="filterLabel"
              value={selectedFilter.apiUrl}
              onChange={(event)=>this.updateFilterDefinition('apiUrl', event.target.value)}
            />
          </div>
        :
          null
        }
      </div>
      :
      null
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
                        <td> <input defaultValue={currentWidgetParams.key} onBlur={() => this.updateParam(index)} ref={'paramValue'+index} placeholder="Enter Value" /></td>
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
        <button className="btn btn-info" onClick={this.filterModalEnabler}>
          Add a new filter
        </button>
        <input
          type='text'
          ref='widgetTitle'
          value={dashboardDefinition.styles.background}
          onChange={(event)=>updateDashboardDefinition(0, 'styles', {background:event.target.value})}
        />
        <div id="dashboardArea" style={dashboardDefinition.styles}>
          {
            dashboardDefinition.filters.map((filter, index) => 
              <Filter
                key={index}
                index={index}
                filterDefinition={filter}
                updateFilterValues={this.updateFilterValues}
                deleteFilter={deleteFilter}
                selectedDashboardIndex={selectedDashboardIndex}
                filterResizeHandler={filterResizeHandler}
                filterRepositionHandler={filterRepositionHandler}
                modalVisibilityEnabler={this.filterModalVisibilityEnabler}
              />
            )}
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
          <HidashModal
            modalId='filterModal'
            closeModal={()=>this.setState({showFilterModal: false})}
            showModal={this.state.showFilterModal}
            modalHeader='Filter'
            modalContent={filterModalContent}
            saveChanges={this.saveNewFilter}
          />
        </div>
      </div>
    )
  }
}
