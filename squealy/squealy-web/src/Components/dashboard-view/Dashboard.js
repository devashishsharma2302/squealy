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

import AddIcon from '../../images/Add_icon.png'
import ChartApiModal from './ChartApiModal'

export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEditWidgetModal: false,
            showAddWidgetModal: false,
            selectedWidget: null,
            editorContent: null,
            newWidget: null,
            newWidgetApiParams: {},
            filterValues: {},
            showChartApiModal: false,
            newApiType: null
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

    updateFilterValues = (name, value) => {
      let newFilterValues = Object.assign({}, this.state.filterValues)
      newFilterValues[name] = value
      this.setState({filterValues: newFilterValues})
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
          newApiType: 'chart',
          selectedWidget: this.props.dashboardDefinition.widgets[widgetIndex],
          editorContent: newEditorContent
      })
    }

    addWidgetModalenabler = () => {
      this.setState({
        showAddWidgetModal: true,
        newApiType: 'chart',
        newWidget: getEmptyWidgetDefinition(),
        newWidgetApiParams: {}
      })
    }

    filterModalEnabler = () => {
      this.setState({
        showFilterModal: true,
        newApiType: 'filter',
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

    filterModalVisibilityEnabler = (filterIndex) => {
      const {dashboardDefinition} = this.props
      this.setState({
        selectedFilter: dashboardDefinition.filters[filterIndex],
        showFilterModal: true,
        newApiType: 'filter'
      })
    }
    chartApiModalVisibilityEnabler = () => {
      this.setState ({showChartApiModal: true})
    }

    closeChartApiModal = (newApiUrl, newApiType) => {
      if (this.state.newApiType === 'chart') {
        let newWidget = JSON.parse(JSON.stringify(this.state.newWidget))
        newWidget.api_url = newApiUrl
        this.setState({newWidget: newWidget, showChartApiModal: false})
      }
      else {
        let newFilter = JSON.parse(JSON.stringify(this.state.selectedFilter))
        newFilter.apiUrl = newApiUrl
        this.setState({selectedFilter: newFilter, showChartApiModal: false})
      }
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
      googleDefined,
      filterDeletionHandler,
      filterResizeHandler,
      filterRepositionHandler,
      saveChartApi
    } = this.props

    const {
      selectedWidget,
      editorContent,
      newWidget,
      newWidgetApiParams,
      selectedFilter,
      filterValues,
      showChartApiModal,
      newApiType
    } = this.state

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
            <img  
              src={AddIcon}
              className='add-icon'
              onClick={()=>this.chartApiModalVisibilityEnabler()}
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
            /> <img src={AddIcon}
                    className='add-icon'
                   onClick={this.chartApiModalVisibilityEnabler}
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
        <button className="btn btn-info" onClick={this.filterModalEnabler}>
          Add a new filter
        </button>
        <input
          type='text'
          ref='widgetTitle'
          value={dashboardDefinition.styles.background}
          onChange={(event)=>updateDashboardDefinition(dashboardIndex, 'styles', {background:event.target.value})}
        />
        <div id="dashboardArea" style={dashboardDefinition.styles}>
          {dashboardDefinition.filters.map((filter, index) => 
              (filter)?
                <Filter
                  key={index}
                  index={index}
                  value={(filter.label in filterValues)?filterValues[filter.label]:DEFAULT_FILTER_VALUES[filter.type]}
                  filterDefinition={filter}
                  updateFilterValues={this.updateFilterValues}
                  filterDeletionHandler={filterDeletionHandler}
                  selectedDashboardIndex={selectedDashboardIndex}
                  filterResizeHandler={filterResizeHandler}
                  filterRepositionHandler={filterRepositionHandler}
                  modalVisibilityEnabler={this.filterModalVisibilityEnabler}
                />
              :
                null
            )
          }
          {
            dashboardDefinition.widgets.map((widget, index) =>
              <Widget
                filterValues={filterValues}
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
          <HidashModal
            modalId='filterModal'
            closeModal={()=>this.setState({showFilterModal: false})}
            showModal={this.state.showFilterModal}
            modalHeader='Filter'
            modalContent={filterModalContent}
            saveChanges={this.saveNewFilter}
          />
          <ChartApiModal
            showModal={showChartApiModal}
            closeChartApiModal={this.closeChartApiModal}
            saveChartApi={saveChartApi}
            newApiType={newApiType}
          />
        </div>
      </div>
    )
  }
}
