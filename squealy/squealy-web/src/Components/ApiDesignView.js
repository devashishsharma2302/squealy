import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'
import ViewOnlyResults from './ViewModeResults'

export default class ApiDesignView extends Component {
  render() {
    const { chart,selectedChartChangeHandler,
      selectedChartIndex,
      googleDefined,
      onHandleTestButton,
      updateViewMode,
      currentChartMode
    } = this.props
    return (
      <div className="full-height">
        <div className="col-md-12 tabs-container">
          <TabsComponent
            chart={chart}
            updateViewMode={updateViewMode}
            onHandleTestButton={onHandleTestButton}
            selectedChartChangeHandler={selectedChartChangeHandler}
            currentChartMode={currentChartMode}
            />
        </div>
        {
          currentChartMode && 
          <div>
            <div className="col-md-12">
              <QueryEditor
                query={chart.query}
                parameters={chart.parameters}
                selectedChartChangeHandler={selectedChartChangeHandler}/>
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
        }
        {
          currentChartMode === false && 
          <div className="col-md-12">
            <ViewOnlyResults
              chart={chart}
              googleDefined={googleDefined}
            />
          </div>
        }
        </div>
      )
  }
}
