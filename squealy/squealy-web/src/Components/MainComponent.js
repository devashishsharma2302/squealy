import React, { Component } from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'

export default class MainComponent extends Component {
  
  render() {
    const { charts, chartAdditionHandler, chartDeletionHandler,
      chartSelectionHandler, selectedChartIndex, googleDefined,
      selectedChartChangeHandler, onHandleTestButton, parameters, savedStatus, saveInProgress, userInfo, updateViewMode, currentChartMode} = this.props
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
              />
          </div>
          <div className="col-md-9 api-design-container">
            <ApiDesignView
              userInfo={userInfo}
              chart={charts[selectedChartIndex]}
              selectedChartChangeHandler={selectedChartChangeHandler}
              selectedChartIndex={selectedChartIndex}
              googleDefined={googleDefined}
              onHandleTestButton={onHandleTestButton}
              updateViewMode={updateViewMode}
              currentChartMode={currentChartMode}
              />
          </div>
        </div>
      </div>
    )
  }
}
