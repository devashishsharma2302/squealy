import React, { Component } from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'

export default class MainComponent extends Component {
  
  render() {
    const { charts, chartAdditionHandler, chartDeletionHandler,
      chartSelectionHandler, selectedChartIndex, googleDefined,
      selectedChartChangeHandler, onHandleTestButton, parameters, savedStatus, saveInProgress} = this.props
    return (
      <div className="full-height">
        <NavHeader savedStatus={savedStatus} saveInProgress={saveInProgress}/>
        <div className="row side-menu-container">
          <div className="col-md-3 side-menu-parent">
            <SideMenu chartAdditionHandler={chartAdditionHandler} 
              charts={charts}
              selectedChartIndex={selectedChartIndex} 
              chartSelectionHandler={chartSelectionHandler}
              chartDeletionHandler={chartDeletionHandler}
              selectedChartChangeHandler={selectedChartChangeHandler}/>
          </div>
          <div className="col-md-9 api-design-container">
            {(charts.length)?
            <ApiDesignView 
              chart={charts[selectedChartIndex]}
              selectedChartChangeHandler={selectedChartChangeHandler}
              selectedChartIndex={selectedChartIndex}
              googleDefined={googleDefined}
              onHandleTestButton={onHandleTestButton}
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
