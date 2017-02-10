import React, {Component} from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'
import {SquealyModal} from '../SquealyUtilsComponents'

export default class MainComponent extends Component {
  
  constructor() {
    super()
    this.state = {
      showAddChartModal: false
    }
  }
  
  enableAddChartModal = () => {
    this.setState({showAddChartModal: true})
  }

  render() {
    //TODO: Connect this to the state and display an auto-generated url
    const addNewChartModalContent = (
      <div className="row">
          <div className="col-md-12">
            <label className='col-md-4'>Name: </label>
            <input type='text' />
          </div>
      </div>
    )
  
    const {charts, chartAdditionHandler, chartSelectionHandler, selectedChartIndex, googleDefined, selectedChartChangeHandler} = this.props
    return (
      <div>
        <NavHeader />
        <div className="row side-menu-container">
          <div className="col-md-3 side-menu-parent">
            <SideMenu chartAdditionHandler={chartAdditionHandler} charts={charts} 
                      selectedChartIndex={selectedChartIndex} chartSelectionHandler={chartSelectionHandler}
                      enableAddChartModal={this.enableAddChartModal}/>
          </div>
          <div className="col-md-9 api-design-container">
            <ApiDesignView chart={charts[selectedChartIndex]}
                           selectedChartChangeHandler={selectedChartChangeHandler}
                           selectedChartIndex={selectedChartIndex}
                           googleDefined={googleDefined}
            />
          </div>
        </div>
        <SquealyModal
            modalId='addChartModal'
            closeModal={()=>this.setState({showAddChartModal: false})}
            showModal={this.state.showAddChartModal}
            modalHeader='Create New Chart'
            modalContent={addNewChartModalContent}
        />
      </div>
    )
  }
}