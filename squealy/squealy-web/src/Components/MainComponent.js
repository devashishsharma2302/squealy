import React, { Component } from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'
import { MainErrorMessage } from '../Utils'

export default class MainComponent extends Component {

  render() {
    const {
      charts,
      chartAdditionHandler,
      chartDeletionHandler,
      chartSelectionHandler,
      selectedChartIndex,
      googleDefined,
      selectedChartChangeHandler,
      onHandleTestButton,
      parameters,
      savedStatus,
      saveInProgress,
      userInfo,
      updateViewMode,
      currentChartMode,
      databases,
      filters,
      filterAdditionHandler,
      filterDeletionHandler,
      selectedFilterChangeHandler,
      selectedFilterIndex,
      filterSelectionHandler,
      onHandleTestFilterButton,
      onResultTabChanged,
      resultSectionActiveKey,
      resultLoading,
      dataLoading,
      visualisationLoading
    } = this.props

    return (
      <div className="full-height">
        <NavHeader savedStatus={savedStatus} saveInProgress={saveInProgress} userInfo={userInfo} />
        <div className="row side-menu-container">
          <div className="col-md-3 side-menu-parent">
            <SideMenu
              userInfo={userInfo}
              chartAdditionHandler={chartAdditionHandler}
              charts={charts}
              selectedChartIndex={selectedChartIndex}
              chartSelectionHandler={chartSelectionHandler}
              chartDeletionHandler={chartDeletionHandler}
              selectedChartChangeHandler={selectedChartChangeHandler}
              databases={databases}
              filters={filters}
              filterAdditionHandler={filterAdditionHandler}
              filterDeletionHandler={filterDeletionHandler}
              selectedFilterChangeHandler={selectedFilterChangeHandler}
              selectedFilterIndex={selectedFilterIndex}
              filterSelectionHandler={filterSelectionHandler}
              />
          </div>
          <div className="col-md-9 api-design-container">
            {!(charts.length === 0 && filters.length === 0) ?
              <div>
                {
                  !(currentChartMode === null && selectedChartIndex === null && selectedFilterIndex === null) ?
                    <ApiDesignView
                      userInfo={userInfo}
                      selectedChartIndex={selectedChartIndex}
                      selectedFilterIndex={selectedFilterIndex}
                      chart={selectedChartIndex !== null ? charts[selectedChartIndex] : []}
                      selectedChartChangeHandler={selectedChartChangeHandler}
                      selectedChartIndex={selectedChartIndex}
                      googleDefined={googleDefined}
                      onHandleTestButton={onHandleTestButton}
                      updateViewMode={updateViewMode}
                      currentChartMode={currentChartMode}
                      databases={databases}
                      selectedFilterChangeHandler={selectedFilterChangeHandler}
                      filters={filters}
                      onHandleTestFilterButton={onHandleTestFilterButton}
                      onResultTabChanged={onResultTabChanged}
                      resultSectionActiveKey={resultSectionActiveKey}
                      resultLoading={resultLoading}
                      dataLoading={dataLoading}
                      visualisationLoading={visualisationLoading}
                      />
                    :
                    <MainErrorMessage errorComponent={"Filters"} />
                }
              </div>
              : 
              <MainErrorMessage errorComponent={"Charts"}/>
            }
          </div>
        </div>
      </div>
    )
  }
}
