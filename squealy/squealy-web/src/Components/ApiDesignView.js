import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'
import ViewOnlyResults from './ViewModeResults'

export default class ApiDesignView extends Component {
  render() {
    const {
      chart,
      selectedChartChangeHandler,
      selectedChartIndex,
      googleDefined,
      onHandleTestButton,
      updateViewMode,
      currentChartMode,
      databases,
      filter,
      selectedFilterIndex,
      selectedFilterChangeHandler
    } = this.props
    return (
      <div className="full-height">
        <div className="col-md-12 tabs-container">
          <TabsComponent
            chartMode={selectedChartIndex !== null ? true : false}
            chart={chart}
            filter={filter}
            updateViewMode={updateViewMode}
            onHandleTestButton={onHandleTestButton}
            selectedChartChangeHandler={selectedChartChangeHandler}
            currentChartMode={currentChartMode}
            databases={databases}
            selectedFilterChangeHandler={selectedFilterChangeHandler}
            />
        </div>
        {
          currentChartMode && 
          <div>
            <div className="col-md-12">
              <QueryEditor
                query={selectedChartIndex !== null ? chart.query : filter.query}
                parameters={selectedChartIndex !== null ? chart.parameters : []}
                selectedChartChangeHandler={selectedChartChangeHandler}
                selectedFilterChangeHandler={selectedFilterChangeHandler}
              />
            </div>
            <div className="col-md-12">
              <ResultSection
                errorMessage={chart.apiErrorMsg}
                chartData={chart.chartData}
                options={chart.options}
                chartType={chart.type}
                selectedChartIndex={selectedChartIndex}
                selectedFilterIndex={selectedFilterIndex}
                googleDefined={googleDefined}
                selectedChartChangeHandler={selectedChartChangeHandler}
                selectedFilterChangeHandler={selectedFilterChangeHandler} />
            </div>
          </div>
        }
        {
          currentChartMode === false && selectedChartIndex &&
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
