import React, { Component } from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'

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
      onHandleVisualizationTab
    } = this.props
    return (
      <div className="full-height">
        <NavHeader savedStatus={savedStatus} saveInProgress={saveInProgress} userInfo={userInfo}/>
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
            {(charts.length)?
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
                onHandleVisualizationTab={onHandleVisualizationTab}
              />
            : <div className='full-height no-charts'>
                <div className='col-md-6 col-md-offset-3 instructions'>
                  <h2> No charts to show. </h2>
                  <h6>Add a new chart if you see the plus icon in the side menu, or ask your administrator to add one for you.</h6>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
