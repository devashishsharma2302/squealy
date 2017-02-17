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
      <div>
        <div className="col-md-12 tabs-container">
          <TabsComponent 
            selectedChartChangeHandler={selectedChartChangeHandler}
            transformations={chart.transformations} 
            onHandleTestButton={onHandleTestButton}
            parameters={chart.parameters}/>
        </div>
        <div className="col-md-12">
          <QueryEditor query={chart.query} 
            selectedChartChangeHandler={selectedChartChangeHandler} />
        </div>
        <div className="col-md-12">
          <ResultSection 
            chartData={chart.chartData}
            options={chart.options}
            chartType={chart.chartType}
            selectedChartIndex={selectedChartIndex}
            googleDefined={googleDefined} />
        </div>
      </div>
    )
  }
}
