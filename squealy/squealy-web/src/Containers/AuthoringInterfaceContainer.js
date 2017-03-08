import React, {Component} from 'react'
import MainComponent from './../Components/MainComponent'
import {
  getEmptyApiDefinition, postApiRequest, getApiRequest, apiCall, formatTestParameters
} from './../Utils'
import { DOMAIN_NAME } from './../Constant'

export default class AuthoringInterfaceContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      charts: [],
      selectedChartIndex: 0,
      saveInProgress: false,
      savedStatus: true
    }
  }

  componentDidMount() {
    //TODO: Get charts from backend
    getApiRequest(DOMAIN_NAME+'charts/', null,
                    (response)=>this.loadInitialCharts(response),
                     this.loadInitialCharts, null)

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

  onChartDeleted = (index, callback) => {
    const {selectedChartIndex, charts} = this.state
    if(charts.length > 1) {
      let charts = JSON.parse(JSON.stringify(this.state.charts))
      charts.splice(index, 1)
      this.setState({
        charts: charts,
        selectedChartIndex: (selectedChartIndex !== 0)?selectedChartIndex - 1:selectedChartIndex,
        savedStatus: true,
        saveInProgress: false
      }, () => {
        callback.constructor === 'Function' || callback()
      })
    } else {
      this.setState({
        charts: [],
        selectedChartIndex: 0,
        savedStatus: true,
        saveInProgress: false
      }, () => {
        callback.constructor === 'Function' ||callback()
      })
    }
  }

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

          if (charts[selectedChartIndex].name !== chartInUrl) {
            let chartIndex = undefined
            charts.map((chart, i) => {
              if(chart.name === chartInUrl) {
                chartIndex = i
              }
            })
            if(chartIndex) {
              this.setState({selectedChartIndex: chartIndex})
            } else {
              console.error('Chart not found')
            }
          }
        } else {
          this.setUrlPath()
        }
      })
    }
  }

  setUrlPath() {
    const { selectedChartIndex, charts } = this.state
    const selectedChart = charts[selectedChartIndex]
    const newUrl = '/' + selectedChart.name
    window.history.replaceState('', '', newUrl);
  }

  selectedChartChangeHandler = (key, value, callback=null, index) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
      chartIndex = index ? index : this.state.selectedChartIndex
    charts[chartIndex][key] = value
    if (key === 'name') {
      charts[chartIndex].url = value.replace(/ /g, '-').toLowerCase()
    }
    this.setState({charts: charts}, ()=>{this.saveChart(charts[chartIndex]); (callback) && callback()})
  }

  onSuccessTest = (data) => {
    let currentChartData = [...this.state.charts]
    currentChartData[this.state.selectedChartIndex]['chartData'] = data
    currentChartData[this.state.selectedChartIndex].apiErrorMsg = null
    this.setState({charts: currentChartData})
  }

  onErrorTest = (e) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    charts[this.state.selectedChartIndex].apiErrorMsg = e.responseJSON.error
    this.setState({charts: charts})
  }

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
        newChart.url = name.replace(/ /g, '-').toLowerCase()
    let newChartIndex = charts.push(newChart) - 1
    this.setState({
      charts: charts
    }, ()=>this.saveNewChart(newChartIndex))
  }

  //Changes the selected API index to the one which was clicked from the API list
  chartSelectionHandler = (index) => {
    this.setState({selectedChartIndex: index}, () => this.setUrlPath())
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== nextProps) {
      return true
    }
  }

  render () {
    const { charts, selectedChartIndex, parameters, savedStatus, saveInProgress} = this.state
    const { googleDefined } = this.props
    return (
      <div className="parent-div container-fluid">
        <MainComponent
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
          />
      </div>
    )
  }
}
