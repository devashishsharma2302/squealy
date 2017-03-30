import React, {Component} from 'react'
import MainComponent from './../Components/MainComponent'
import {
  getEmptyApiDefinition, postApiRequest, getApiRequest, apiCall, formatTestParameters, 
  getEmptyUserInfo, getEmptyFilterDefinition} from './../Utils'
import { DOMAIN_NAME } from './../Constant'

export default class AuthoringInterfaceContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      charts: [],
      selectedChartIndex: 0,
      saveInProgress: false,
      savedStatus: true,
      userInfo: getEmptyUserInfo(),
      currentChartMode: null,
      databases: [],
      filters: [],
      selectedFilterIndex: null
    }
  }

  componentDidMount() {
    getApiRequest(DOMAIN_NAME+'charts/', null,
                    (response)=>this.loadInitialCharts(response),
                     this.loadInitialCharts, null)
    getApiRequest(DOMAIN_NAME+'user/', null,
       (data) => {this.setState({userInfo: data})},
        (error) => console.error(e), null)
    getApiRequest(DOMAIN_NAME+'databases/', null,
                  (data) => {
                    this.setState({databases: data.databases})
                  },
                  (error) => console.error(error), null)
    getApiRequest(DOMAIN_NAME+'filters/', null,
                  (data) => {
                    this.setState({filters: data})
                  },
                  (error) => console.error(error), null)
  }

  onAPISaved = (response, stateKey, data, callback=null) => {
    this.setState({'savedStatus': true, 'saveInProgress': false, [stateKey]: data}, 
      () => {
        callback && callback.constructor === Function ? callback() : null
      }
    )
  }

  onAPISaveError = (err, callback=null) => {
    this.setState({'savedStatus': false, 'saveInProgress': false}, 
      () => {
    callback && callback.constructor === Function ? callback(err) : null
      })
  }

  saveChart = (charts, chartIndex, onSuccess=null, onFailure=null) => {
    let chart = charts[chartIndex]
    if (chart.id) {
      this.setState({'saveInProgress': true},
            postApiRequest(DOMAIN_NAME+'charts/', {'chart': chart},
            (response) =>this.onAPISaved(response, 'charts', charts, onSuccess),
            (error)=>this.onAPISaveError(error, onFailure), null)
      )
    }
  }

  saveFilter = (filters, index, onSuccess=null, onFailure=null) => {
    let filter = filters[index]
    if (filter.id) {
      this.setState({'saveInProgress': true},
            postApiRequest(DOMAIN_NAME+'filters/', {'filter': filter},
            (response) =>this.onAPISaved(response, 'filters', filters, onSuccess),
            (error)=>this.onAPISaveError(error, onFailure), null)
      )
    }
  }

  // Updates the selected chart index and updates the selected chart name in the URL
  onWidgetDeleted = (index, selectedWidgetStateKey, widgetStateKeyData, callback) => {
    const selectedIndex = this.state[selectedWidgetStateKey],
      currWidgetData = this.state[widgetStateKeyData]

    if(currWidgetData.length > 1) {
      let widgetData = JSON.parse(JSON.stringify(currWidgetData)),
        newChartIndex = (selectedIndex !== 0) ? selectedIndex - 1 : selectedIndex
      widgetData.splice(index, 1)
      this.setState({
        [widgetStateKeyData]: widgetData,
        [selectedWidgetStateKey]: newChartIndex,
        savedStatus: true,
        saveInProgress: false,
        currentChartMode: (widgetData[newChartIndex].can_edit || false)
      }, () => {
        callback && callback.constructor === Function && callback()
      })
    } else {
      this.setState({
        [widgetStateKeyData]: [],
        [selectedWidgetStateKey]: 0,
        savedStatus: true,
        saveInProgress: false,
        currentChartMode: false
      }, () => {
        callback && callback.constructor === Function && callback()
      })
    }
  }

  // Calls the Delete chart API and triggers onChartDelete function if the API
  // is successfull
  chartDeletionHandler = (index, callback) => {
    const chartId = this.state.charts[index].id
    this.setState({'saveInProgress': true},
                  apiCall(DOMAIN_NAME+'charts/', JSON.stringify({'id': chartId}), 'DELETE',
                  () => this.onWidgetDeleted(index, 'selectedChartIndex', 'charts', callback), this.onAPISaveError, null)
    )
  }

  // Calls the Delete chart API and triggers onChartDelete function if the API
  // is successfull
  filterDeletionHandler = (index, callback) => {
    const filterId = this.state.filters[index].id
    this.setState({'saveInProgress': true},
                  apiCall(DOMAIN_NAME+'filters/', JSON.stringify({'id': filterId}), 'DELETE',
                  () => this.onWidgetDeleted(index, 'selectedFilterIndex', 'filters', callback), this.onAPISaveError, null)
    )
  }


  onNewAPISaved = (newData, id, selectedIndexStateKey, widgetDataKey, onSuccess) => {
    let data = JSON.parse(JSON.stringify(this.state[widgetDataKey]))
    let newIndex = data.push(newData) - 1
    data[newIndex].id = id
    this.setState({
      [widgetDataKey]: data,
      [selectedIndexStateKey]: newIndex,
      'savedStatus': true,
      'saveInProgress': false}, onSuccess)
  }

  saveNewChart = (newChart, onSuccess, onFailure) => {
    this.setState({'saveInProgress': true},
          postApiRequest(DOMAIN_NAME+'charts/', {'chart': newChart},
          (id) => this.onNewAPISaved(newChart, id, 'selectedChartIndex', 'charts', onSuccess),(err)=>this.onAPISaveError(err, onFailure), null)
    )
  }

  saveNewFilter = (newFilter, onSuccess, onFailure) => {
    this.setState({'saveInProgress': true},
          postApiRequest(DOMAIN_NAME+'filters/', {'filter': newFilter},
          (id) => this.onNewAPISaved(newFilter, id, 'selectedFilterIndex', 'filters', onSuccess),(err)=>this.onAPISaveError(err, onFailure), null)
    )
  }


  loadInitialCharts = (response) => {
    let charts = [],
    tempChart = {}
    if (response && response.length !== 0) {
      response.map(chart => {
        tempChart = chart
        tempChart.testParameters = {}
        charts.push(tempChart)
      })
      this.setState({charts: charts}, ()=> {
        const { selectedChartIndex, charts } = this.state
        const currentPath = window.location.pathname.split('/')
        // If there is a string after / , set the selected chart else set the
        // chart name in the URL
        if (currentPath[1] !== '') {
          const chartInUrl = currentPath[1]
          if (charts[selectedChartIndex].name !== decodeURIComponent(chartInUrl)) {
            let chartIndex = undefined
            charts.map((chart, i) => {
              if(chart.name === chartInUrl) {
                chartIndex = i
              }
            })
            if(chartIndex) {
              this.setState({selectedChartIndex: chartIndex}, this.setUrlPath)
            } else {
              alert('Chart not found')
              this.setState({selectedChartIndex: 0}, this.setUrlPath)
            }
          } else {
            this.setUrlPath()
          }
        } else {
          this.setUrlPath()
        }
      })
    }
  }

  // Updates the URL with the selected chart name
  setUrlPath() {
    const { selectedChartIndex, charts, currentChartMode } = this.state
    const selectedChart = charts[selectedChartIndex]
    const canEditUrl = (charts[selectedChartIndex].can_edit && !window.location.pathname.includes('view')) ? 'edit' : 'view'
    const newUrl = '/' + selectedChart.name + '/' + canEditUrl + window.location.search
    this.setState({currentChartMode: charts[selectedChartIndex].can_edit && !window.location.pathname.includes('view') || false})
    window.history.replaceState('', '', newUrl);
  }

  // A generic function to handle change in any property inside the selected chart
  selectedChartChangeHandler = (updatedObj, onSuccess=null, index=null, onFailure=null) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
      chartIndex = parseInt(index, 10) //To avoid unexpected errors with value 0
    chartIndex = chartIndex >= 0 ? chartIndex : this.state.selectedChartIndex

    if (updatedObj) {
      Object.keys(updatedObj).map(key => {
        charts[chartIndex][key] = updatedObj[key]
          if (key === 'name') {
            charts[chartIndex].url = updatedObj[key].replace(/ /g, '-').toLowerCase()
          }
      })
    }
    this.saveChart(charts, chartIndex, onSuccess, onFailure)
  }

  //A generic function to handle change in any property inside the selected filter
  selectedFilterChangeHandler = (updatedObj, onSuccess=null, index=null, onFailure=null) => {
    let filters = JSON.parse(JSON.stringify(this.state.filters)),
      filterIndex = parseInt(index, 10) //To avoid unexpected errors with value 0
    filterIndex = filterIndex >= 0 ? filterIndex : this.state.selectedFilterIndex

    if (updatedObj) {
      Object.keys(updatedObj).map(key => {
        filters[filterIndex][key] = updatedObj[key]
          if (key === 'name') {
            filters[filterIndex].url = updatedObj[key].replace(/ /g, '-').toLowerCase()
          }
      })
    }
    this.saveFilter(filters, filterIndex, onSuccess, onFailure)
  }

  // Updates the selected chart's chart data with the result set returned by the
  // query written by the user
  onSuccessTest = (data, callback) => {
    let currentChartData = JSON.parse(JSON.stringify(this.state.charts))
    currentChartData[this.state.selectedChartIndex]['chartData'] = data
    currentChartData[this.state.selectedChartIndex].apiErrorMsg = null
    this.setState({charts: currentChartData}, () => {
      callback ? callback() : null
    })
  }

  onSuccessFilterTest = (data, callback) => {
    let curFilterData = JSON.parse(JSON.stringify(this.state.filters))
    curFilterData[this.state.selectedFilterIndex]['filterData'] = data
    curFilterData[this.state.selectedFilterIndex].apiErrorMsg = null
    this.setState({filters: curFilterData}, () => {
      callback ? callback() : null
    })
  }

  // Updates the selected chart with the error message recieved from the backend
  onErrorTest = (e) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    charts[this.state.selectedChartIndex].apiErrorMsg = e.responseJSON.error
    this.setState({charts: charts})
  }

  onErrorFilterTest = (e) => {
    let curFilterData = JSON.parse(JSON.stringify(this.state.filters))
    curFilterData[this.state.selectedFilterIndex].apiErrorMsg = e.responseJSON.error
    this.setState({filters: curFilterData})
  }

  // Handles click event on run button. This function makes a POST call to get
  // result set of the query written by the user and triggers onSuccessTest if
  // the API is successfull
  onHandleTestButton = (callback=null) => {
    const selectedChart = this.state.charts[this.state.selectedChartIndex]
    let payloadObj = formatTestParameters(selectedChart.parameters, 'name', 'test_value')
    postApiRequest(DOMAIN_NAME+'squealy/'+selectedChart.url+'/', payloadObj,
                    this.onSuccessTest, this.onErrorTest, callback)
  }

  onHandleTestFilterButton = (callback=null) => {
    const selectedChart = this.state.filters[this.state.selectedFilterIndex]
    getApiRequest(DOMAIN_NAME+'filter/'+selectedChart.url+'/', {format: 'GoogleChartsFormatter'},
                    this.onSuccessFilterTest, this.onErrorFilterTest, callback)
  }


  //Appends an empty API definition object to current API Definitions
  chartAdditionHandler = (name, database, onSuccess, onFailure) => {
    let newChart = getEmptyApiDefinition()
    newChart.name = name
    newChart.database = database
    newChart.can_edit = true
    newChart.url = name.replace(/ /g, '-').toLowerCase()
 
    this.saveNewChart(newChart, onSuccess, onFailure)
  }

  //Appends an empty filter definition object to current filter Definitions
  filterAdditionHandler = (name, database, onSuccess, onFailure) => {
    let newFilter = getEmptyFilterDefinition()
    newFilter.name = name
    newFilter.database = database
    newFilter.can_edit = true
    newFilter.url = name.replace(/ /g, '-').toLowerCase()
 
    this.saveNewFilter(newFilter, onSuccess, onFailure)
  }

  //Changes the selected API index to the one which was clicked from the API list
  chartSelectionHandler = (index) => {
    window.history.replaceState('', '', window.location.pathname);
    this.setState({
      selectedChartIndex: index,
      selectedFilterIndex: null,
      currentChartMode: this.state.charts[index].can_edit || false}, this.setUrlPath)
  }

  //Changes the selected API index to the one which was clicked from the Filter list
  filterSelectionHandler = (index) => {
    window.history.replaceState('', '', window.location.pathname);
    this.setState({selectedFilterIndex: index, selectedChartIndex: null})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== nextProps) {
      return true
    }
  }

  updateViewMode = (val, editPermission) => {
    if (editPermission) {
      const { selectedChartIndex, charts } = this.state
      const newUrl = '/' + charts[selectedChartIndex].name + '/' + (val ? 'view' : 'edit/') 
      window.history.replaceState('', '', newUrl);
      this.setState({currentChartMode: !val})
    }
  }


  render () {
    const {
      charts,
      selectedChartIndex,
      parameters,
      savedStatus,
      saveInProgress,
      userInfo,
      currentChartMode,
      databases,
      filters,
      selectedFilterIndex
    } = this.state
    const { googleDefined } = this.props
    return (
      <div className="parent-div container-fluid">
        <MainComponent
          userInfo={userInfo}
          charts={charts}
          saveInProgress={saveInProgress}
          savedStatus={savedStatus}
          onHandleTestButton={this.onHandleTestButton}
          selectedChartIndex={selectedChartIndex}
          googleDefined={googleDefined}
          chartAdditionHandler={this.chartAdditionHandler}
          chartSelectionHandler={this.chartSelectionHandler}
          chartDeletionHandler={this.chartDeletionHandler}
          selectedChartChangeHandler={this.selectedChartChangeHandler}
          currentChartMode={currentChartMode}
          updateViewMode={this.updateViewMode}
          databases={databases}
          filters={filters}
          filterAdditionHandler={this.filterAdditionHandler}
          filterDeletionHandler={this.filterDeletionHandler}
          selectedFilterChangeHandler={this.selectedFilterChangeHandler}
          selectedFilterIndex={selectedFilterIndex}
          filterSelectionHandler={this.filterSelectionHandler}
          onHandleTestFilterButton={this.onHandleTestFilterButton}
        />
      </div>
    )
  }
}
