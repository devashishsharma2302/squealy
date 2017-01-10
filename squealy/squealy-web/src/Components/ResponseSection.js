import React, {Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import GoogleChartComponent from './GoogleChartComponent'
import JSONViewer from './JSONViewer'
import { QueryResponseTable } from './ResponseTable'
import {
  VISUALIZATION_MODES,
  RESPONSE_FORMATS,
  GOOGLE_CHART_TYPE_OPTIONS
} from '../Constant'
import {chartData} from '../mockData'

const responseElementReferenceMap = {
  'json':  JSONViewer,
  'table': QueryResponseTable,
  'GoogleChartsFormatter': JSONViewer,
  'HighchartsFormatter': JSONViewer
}


export default class ResponseSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visualizationMode: VISUALIZATION_MODES.raw,
      chartType: GOOGLE_CHART_TYPE_OPTIONS[7].value
    }
  }

  visualizationChangeHandler = (event, mode) => {
    this.setState({visualizationMode: mode})
  }

  render() {
    const {
      selectedTestData,
      selectedAPIDefinition,
      onChangeApiDefinition,
      selectedApiIndex
    } = this.props
    const {visualizationMode, chartType} = this.state
    let responseElem
    if (selectedTestData.apiSuccess) {
      //Gets the reference of the response element to be rendered
      const ReponseElementReference = responseElementReferenceMap[selectedTestData.selectedFormat]
      responseElem =
            <div>
              <ReponseElementReference
                response={selectedTestData.apiResponse}
                columnDefinition={selectedAPIDefinition.columns}
                onChangeApiDefinition={onChangeApiDefinition}
              />
            </div>
    } else if (selectedTestData.apiError) {
      responseElem =
      <div className="alert alert-danger query-error-section">
        <h2>Results: </h2>
        <strong>Error Occured!</strong>
        {selectedTestData.apiResponse.error}
      </div>
    }
    return (
      <div className="response-section">
      {(selectedTestData.selectedFormat === 'GoogleChartsFormatter')?
        <div>
          <div id="gc_response_header">
            <button 
              type="button"
              className="response-section-btn"
              onClick={(e) => this.visualizationChangeHandler(e, 'Raw')}>
              Raw Data
            </button>
            <button
              type="button"
              className="response-section-btn"
              onClick={(e) => this.visualizationChangeHandler(e, 'Widget')}>
              Visualize
            </button>
            {(visualizationMode === 'Widget')?
              <div id="chart_select">
                <Select
                  name="chart-type"
                  options={GOOGLE_CHART_TYPE_OPTIONS}
                  value={chartType}
                  onChange={(selectedChartType)=>this.setState({chartType: selectedChartType.value})}
                  placeholder='Select Database'
                />
              </div>
            :
              null
            }
          </div>
          <div>
            {(visualizationMode==VISUALIZATION_MODES.raw)?
              responseElem:<GoogleChartComponent 
                              config={{
                                ...selectedTestData.apiResponse,
                                index: 'visualization-section-'+selectedApiIndex,
                                height: 350,
                                chartType: chartType
                              }}
                           />
            }
          </div>
        </div>
        :
        responseElem
      }
      </div>
    )
  }
}
