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
      currentChartMode: null,
      databases: []
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
  }

  onChartSaved = (response, charts, callback=null) => {
    this.setState({'savedStatus': true, 'saveInProgress': false, charts: charts}, 
      () => {
        callback && callback.constructor === Function ? callback() : null
      }
    )
  }

  onChartSaveError = (err, callback=null) => {
    this.setState({'savedStatus': false, 'saveInProgress': false}, 
  		() => {
		callback && callback.constructor === Function ? callback(err) : null
  		}
	)
  }

  saveChart = (charts, chartIndex, onSuccess=null, onFailure=null) => {
    let chart = charts[chartIndex]
    if (chart.id) {
      this.setState({'saveInProgress': true},
            postApiRequest(DOMAIN_NAME+'charts/', {'chart': chart},
            (response) =>this.onChartSaved(response, charts, onSuccess),
            (error)=>this.onChartSaveError(error, onFailure), null)
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
        callback && callback.constructor === Function || callback()
      })
    } else {
      this.setState({
        charts: [],
        selectedChartIndex: 0,
        savedStatus: true,
        saveInProgress: false,
        currentChartMode: false
      }, () => {
        callback && callback.constructor === Function || callback()
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

  onNewChartSaved = (newChart, id, onSuccess) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    let newChartIndex = charts.push(newChart) - 1
    charts[newChartIndex].id = id
    this.setState({'charts': charts, selectedChartIndex: newChartIndex,
     'savedStatus': true, 'saveInProgress': false},
     onSuccess)
  }

  saveNewChart = (newChart, onSuccess, onFailure) => {
    this.setState({'saveInProgress': true},
          postApiRequest(DOMAIN_NAME+'charts/', {'chart': newChart},
          (id) => this.onNewChartSaved(newChart, id, onSuccess),(err)=>this.onChartSaveError(err, onFailure), null)
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
  selectedChartChangeHandler = (key, value, onSuccess=null, index=null, onFailure=null) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
      chartIndex = parseInt(index, 10) //To avoid unexpected errors with value 0
    
    chartIndex = chartIndex >= 0 ? chartIndex : this.state.selectedChartIndex

    charts[chartIndex][key] = value
    if (key === 'name') {
      charts[chartIndex].url = value.replace(/ /g, '-').toLowerCase()
    }
    
    this.saveChart(charts, chartIndex, onSuccess, onFailure)
    
  }

  // Updates the selected chart's chart data with the result set returned by the
  // query written by the user
  onSuccessTest = (data, callback) => {
    let currentChartData = [...this.state.charts]
    currentChartData[this.state.selectedChartIndex]['chartData'] = data
    currentChartData[this.state.selectedChartIndex].apiErrorMsg = null
    this.setState({charts: currentChartData}, () => {
      callback ? callback() : null
    })
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
  onHandleTestButton = (callback=null) => {
    const selectedChart = this.state.charts[this.state.selectedChartIndex]
    let payloadObj = formatTestParameters(selectedChart.parameters, 'name', 'test_value')
    postApiRequest(DOMAIN_NAME+'squealy/'+selectedChart.url+'/', payloadObj,
                    this.onSuccessTest, this.onErrorTest, callback)
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

  //Changes the selected API index to the one which was clicked from the API list
  chartSelectionHandler = (index) => {
    window.history.replaceState('', '', window.location.pathname);
    this.setState({selectedChartIndex: index, currentChartMode: this.state.charts[index].can_edit || false}, this.setUrlPath)
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
      databases
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
        />
      </div>
    )
  }
}
