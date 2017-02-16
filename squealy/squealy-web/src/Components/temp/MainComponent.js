import React, {Component} from 'react'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'
import ApiDesignView from './ApiDesignView'
import {SquealyModal} from '../SquealyUtilsComponents'

export default class MainComponent extends Component {
  
  constructor() {
    super()
    this.state = {
      showAddChartModal: false,
      newChart: {name: '', url: ''}
    }
  }
  
  enableAddChartModal = () => {
    this.setState({showAddChartModal: true})
  }
 
  saveNewChartHandler = (name, url) => {
    const {newChart} = this.state
    this.props.chartAdditionHandler(newChart.name, newChart.url)
  }

  newChartNameChanged = (e) => {
    const newChartName = e.target.value,
      newChartUrl = newChartName.replace(' ', '-').toLowerCase()
    this.setState({newChart: {name: newChartName, url: newChartUrl}})
  }

  render() {
    //TODO: Connect this to the state and display an auto-generated url
    const addNewChartModalContent = (
      <div className="row">
          <div className="col-md-12">
            <label className='col-md-4'>Name: </label>
            <input type='text' value={this.state.newChart.name} onChange={this.newChartNameChanged} />
            <label className='col-md-4'>Url: </label>
            <input type='text' value={this.state.newChart.url} disabled/>
          </div>
      </div>
    )
  
    const {charts, chartAdditionHandler, chartDeletionHandler, chartSelectionHandler, selectedChartIndex, googleDefined, selectedChartChangeHandler} = this.props
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
            saveChanges={() => {
                chartAdditionHandler(this.state.newChart.name, this.state.newChart.url)
                this.setState({showAddChartModal: false})
              }
            }
        />
      </div>
    )
  }
}