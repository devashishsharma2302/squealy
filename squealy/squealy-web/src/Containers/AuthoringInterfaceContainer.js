import React, {Component} from 'react'
import MainComponent from './../Components/MainComponent'
import {
  getEmptyApiDefinition, postApiRequest, getApiRequest, apiCall, formatTestParameters, 
  getEmptyUserInfo } from './../Utils'
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
      currentChartMode: null
    }
  }

  componentDidMount() {
    getApiRequest(DOMAIN_NAME+'charts/', null,
                    (response)=>this.loadInitialCharts(response),
                     this.loadInitialCharts, null)
    getApiRequest(DOMAIN_NAME+'user/', null,
       (data) => {this.setState({userInfo: data})},
        (error) => console.error(e), null)
  }

  onChartSaved = () => {
    this.setState({'savedStatus': true, 'saveInProgress': false})
  }

  onChartSaveError = (e) => {
    this.setState({'savedStatus': false, 'saveInProgress': false})
  }

  saveChart = (chart) => {
    if (chart.id) {
      this.setState({'saveInProgress': true},
            postApiRequest(DOMAIN_NAME+'charts/', {'chart': chart},
            this.onChartSaved,this.onChartSaveError, null)
      )
    }
  }

  // Updates the selected chart index and updates the selected chart name in the URL
  onChartDeleted = (index, callback) => {
    const {selectedChartIndex, charts} = this.state
    if(charts.length > 1) {
      let charts = JSON.parse(JSON.stringify(this.state.charts)),
        newChartIndex = (selectedChartIndex !== 0)?selectedChartIndex - 1:selectedChartIndex
      charts.splice(index, 1)
      this.setState({
        charts: charts,
        selectedChartIndex: newChartIndex,
        savedStatus: true,
        saveInProgress: false,
        currentChartMode: (charts[newChartIndex].can_edit || false)
      }, () => {
        callback.constructor === 'Function' || callback()
      })
    } else {
      this.setState({
        charts: [],
        selectedChartIndex: 0,
        savedStatus: true,
        saveInProgress: false,
        currentChartMode: false
      }, () => {
        callback.constructor === 'Function' ||callback()
      })
    }
  }

  // Calls the Delete chart API and triggers onChartDelete function if the API
  // is successfull
  chartDeletionHandler = (index, callback) => {
    const chartId = this.state.charts[index].id
    this.setState({'saveInProgress': true},
                  apiCall(DOMAIN_NAME+'charts/', JSON.stringify({'id': chartId}), 'DELETE',
                  () => this.onChartDeleted(index, callback),this.onChartSaveError, null)
    )
  }

  onNewChartSaved = (newChartIndex, id) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    charts[newChartIndex].id = id
    this.setState({'charts': charts, 'savedStatus': true, 'saveInProgress': false},
     ()=> this.saveChart(charts[newChartIndex]))
  }

  saveNewChart = (newChartIndex) => {
    this.setState({'saveInProgress': true},
          postApiRequest(DOMAIN_NAME+'charts/', {'chart': this.state.charts[newChartIndex]},
          (id) => this.onNewChartSaved(newChartIndex, id),this.onChartSaveError, null)
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
              this.setState({selectedChartIndex: chartIndex, currentChartMode: charts[chartIndex].can_edit || false}, this.setUrlPath)
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
    const { selectedChartIndex, charts } = this.state
    const selectedChart = charts[selectedChartIndex]
    const canEditUrl = (charts[selectedChartIndex].can_edit) ? 'edit' : 'view'
    const newUrl = '/' + selectedChart.name + '/' + canEditUrl
    this.setState({currentChartMode: charts[selectedChartIndex].can_edit || false})
    window.history.replaceState('', '', newUrl);
  }

  // A generic function to handle change in any property inside the selected chart
  selectedChartChangeHandler = (key, value, callback=null, index) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
      chartIndex = index ? index : this.state.selectedChartIndex
    charts[chartIndex][key] = value
    if (key === 'name') {
      charts[chartIndex].url = value.replace(/ /g, '-').toLowerCase()
    }
    this.setState({charts: charts}, ()=>{this.saveChart(charts[chartIndex]); (callback) && callback()})
  }

  // Updates the selected chart's chart data with the result set returned by the
  // query written by the user
  onSuccessTest = (data) => {
    let currentChartData = [...this.state.charts]
    currentChartData[this.state.selectedChartIndex]['chartData'] = data
    currentChartData[this.state.selectedChartIndex].apiErrorMsg = null
    this.setState({charts: currentChartData})
  }

  // Updates the selected chart with the error message recieved from the backend
  onErrorTest = (e) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    charts[this.state.selectedChartIndex].apiErrorMsg = e.responseJSON.error
    this.setState({charts: charts})
  }

  // Handles click event on run button. This function makes a POST call to get
  // result set of the query written by the user and triggers onSuccessTest if
  // the API is successfull
  onHandleTestButton = () => {
    const selectedChart = this.state.charts[this.state.selectedChartIndex]
    let transformations = selectedChart.transformations.map(transformation => {
        let kwargs = null
        if(transformation.value === 'split') {
          kwargs = {
            pivot_column: selectedChart.pivotColumn.value,
            metric_column: selectedChart.metric.value
          }
        }
        if(transformation.value === 'merge') {
          kwargs = {
            columns_to_merge: selectedChart.columnsToMerge.map(column=>column.value),
            new_column_name: selectedChart.newColumnName
          }
        }
        return {
          name: transformation.value,
          kwargs: kwargs
      }
    })


    let payloadObj = {
      params: formatTestParameters(selectedChart.parameters)
    }
    postApiRequest(DOMAIN_NAME+'squealy/'+selectedChart.url+'/', payloadObj,
                    this.onSuccessTest, this.onErrorTest, 'table')
  }

  

  //Appends an empty API definition object to current API Definitions
  chartAdditionHandler = (name) => {
    //TODO: open the addition modal and add the new chart to state also making it the selected chart
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
        newChart = getEmptyApiDefinition()
        newChart.name = name
        newChart.can_edit = true
        newChart.url = name.replace(/ /g, '-').toLowerCase()
    let newChartIndex = charts.push(newChart) - 1
    this.setState({
      charts: charts
    }, ()=>this.saveNewChart(newChartIndex))
  }

  //Changes the selected API index to the one which was clicked from the API list
  chartSelectionHandler = (index) => {
    this.setState({selectedChartIndex: index, currentChartMode: this.state.charts[index].can_edit || false},
      () => this.setUrlPath())
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== nextProps) {
      return true
    }
  }

  updateViewMode = (val) => {
    const { selectedChartIndex, charts } = this.state
    const newUrl = '/' + charts[selectedChartIndex].name + '/' + (val ? 'view' : 'edit') + '/'
    this.setState({currentChartMode: !val}, () => {
      window.history.replaceState('', '', newUrl);
    })
  }


  render () {
    const { charts, selectedChartIndex, parameters, savedStatus, saveInProgress, userInfo, currentChartMode } = this.state
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
          />
      </div>
    )
  }
}
