import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'

export default class ApiDesignView extends Component {
  render() {
    const { chart,selectedChartChangeHandler,
      selectedChartIndex,
      googleDefined,
      onHandleTestButton,
    } = this.props
    return (
      <div className="full-height">
        <div className="col-md-12 tabs-container">
          <TabsComponent
            selectedChartChangeHandler={selectedChartChangeHandler}
            chart={chart}
            onHandleTestButton={onHandleTestButton}/>
        </div>
        <div className="col-md-12">
          <QueryEditor
            query={chart.query}
            parameters={chart.parameters}
            selectedChartChangeHandler={selectedChartChangeHandler} />
        </div>
        <div className="col-md-12">
          <ResultSection
            errorMessage={chart.apiErrorMsg}
            chartData={chart.chartData}
            options={chart.options}
            chartType={chart.type}
            selectedChartIndex={selectedChartIndex}
            googleDefined={googleDefined}
            selectedChartChangeHandler={selectedChartChangeHandler} />
        </div>
      </div>
    )
  }
}
