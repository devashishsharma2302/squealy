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
      selectedFilterChangeHandler,
      onHandleTestFilterButton
    } = this.props
    let chartMode = selectedChartIndex !== null ? true : false
    return (
      <div className="full-height">
        <div className="col-md-12 tabs-container">
          <TabsComponent
            chartMode={chartMode}
            chart={chart}
            filter={filter}
            updateViewMode={updateViewMode}
            onHandleTestButton={onHandleTestButton}
            selectedChartChangeHandler={selectedChartChangeHandler}
            currentChartMode={currentChartMode}
            databases={databases}
            selectedFilterChangeHandler={selectedFilterChangeHandler}
            onHandleTestFilterButton={onHandleTestFilterButton}
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
                chartMode={chartMode}
              />
            </div>
            <div className="col-md-12">
              <ResultSection
                chartMode={chartMode}
                errorMessage={chartMode ? chart.apiErrorMsg : filter.apiErrorMsg}
                resultData={chartMode ? chart.chartData : filter.filterData}
                options={chartMode ? chart.options : null}
                viewType={chartMode ? chart.type : 'table'}
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
