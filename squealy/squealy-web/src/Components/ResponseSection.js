import React, {Component} from 'react'

import GoogleChartComponent from './GoogleChartComponent'
import JSONViewer from './JSONViewer'
import { QueryResponseTable } from './ResponseTable'
import {VISUALIZATION_MODES, RESPONSE_FORMATS} from '../Constant'
import {chartData} from '../mockData'

const responseElementReferenceMap = {
  'JSON':  JSONViewer,
  'table': QueryResponseTable,
  'GoogleChartsFormatter': JSONViewer,
  'HighchartsFormatter': JSONViewer
}


export default class ResponseSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visualizationMode: VISUALIZATION_MODES.raw
    }
  }

  visualizationChangeHandler = (event, mode) => {
    this.setState({visualizationMode: mode})
  }

  render() {
    const {
      selectedTestData,
      selectedAPIDefinition,
      onChangeApiDefinition
    } = this.props
    const {visualizationMode} = this.state
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
          <div>
            {(visualizationMode==VISUALIZATION_MODES.raw)?
              responseElem:<GoogleChartComponent config={chartData} />
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
