import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'
import GoogleChartsComponent from './GoogleChartsComponent'
import ViewOnlyResults from './ViewModeResults'

export default class ApiDesignView extends Component {
  render() {
    const { chart,selectedChartChangeHandler,
      selectedChartIndex,
      googleDefined,
      onHandleTestButton,
      currentChartMode
    } = this.props

    return (
      <div className="full-height">
        <div className="col-md-12 tabs-container">
          <TabsComponent
            currentChartMode={currentChartMode}
            chart={chart}
            onHandleTestButton={onHandleTestButton}
            userPermission={chart.user_permission || false}
            />
        </div>
        {
          currentChartMode === 'edit' && 
          <div>
            <div className="col-md-12">
              <QueryEditor
                query={chart.query}
                parameters={chart.parameters}
                selectedChartChangeHandler={selectedChartChangeHandler}/>
            </div>
            <div className="col-md-12">
              <ResultSection
                currentChartMode={currentChartMode}
                errorMessage={chart.apiErrorMsg}
                chartData={chart.chartData}
                options={chart.options}
                chartType={chart.type}
                selectedChartIndex={selectedChartIndex}
                googleDefined={googleDefined}
                selectedChartChangeHandler={selectedChartChangeHandler} />
            </div>
          </div>
        }
        {
          currentChartMode === 'view' && 
          <div className="col-md-12">
            <ViewOnlyResults
              errorMessage={chart.apiErrorMsg}
              chartData={chart.chartData}
              chartType={chart.type}
              googleDefined={googleDefined}
              chartParameters={chart.parameters}
            />
          </div>
        }
        </div>
      )
  }
}
