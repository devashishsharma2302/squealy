import React, { Component, PropTypes } from 'react'
import chartIcon from '../../images/charts_icon.png'
import dashboardIcon from '../../images/dashboard_icon.png'
import { SquealyModal } from './SquealyUtilsComponents'

export default class SideMenu extends Component {
  constructor() {
    super()
    this.state = {
      showLeftNavContextMenu: false,
      leftMenuChartIndex: null,
      showAddChartModal: false,
      chartName: '',
      chartEditMode: false,
      leftMenuPosition: {
        top: 0,
        left: 0
      }
    }
  }

  componentDidMount () {
    document.body.addEventListener('click', this.hideLeftMenu);
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.hideLeftMenu);
  }

  newChartNameChanged = (e) => {
    this.setState({chartName: e.target.value})
  }

  hideLeftMenu = () => {
    this.setState({
      leftMenuChartIndex: null,
      showLeftNavContextMenu: false
    })
  }

  toggleLeftMenu = (e, index) => {
    e.preventDefault()
    //e.pageY calculating height from ul.
    //FIXME: Hardcoded 10px to show menu at accurate position. Need to check why do we need to add it?
    let leftMenuPosition = {
      top: e.pageY - document.getElementById('chart_list_ul').offsetTop - 10,
      left: e.pageX
    },
    flag = (index !== this.state.leftMenuChartIndex) || !this.state.showLeftNavContextMenu

    this.setState({
      leftMenuChartIndex: flag ? index : null,
      showLeftNavContextMenu: flag,
      leftMenuPosition: leftMenuPosition
    })
  }

  showChartDetailsModal = (action) => {
    let charts = JSON.parse(JSON.stringify(this.props.charts)),
      selectedChartName = (action === 'EDIT') ? charts[this.state.leftMenuChartIndex].name : '' 

    this.setState({ 
      showAddChartModal: true,
      chartName: selectedChartName,
      showLeftNavContextMenu: false,
      chartEditMode: action === 'EDIT' ? true : false
    })
  }

  selectChartHandler = (index, action) => {
    this.setState({showLeftNavContextMenu: false, leftMenuChartIndex: null})
    this.props.chartSelectionHandler(index)
  }

  chartAdditionModalSave = (e) => {
    if (this.state.chartEditMode) {
      this.props.selectedChartChangeHandler(
        'name', this.state.chartName, null, this.state.leftMenuChartIndex)
    } else {
      this.props.chartAdditionHandler(this.state.chartName)
    }
    this.setState({ showAddChartModal: false, leftMenuChartIndex: null })
  }


  render() {
    const addNewChartModalContent = (
      <div className="row">
        <div className="col-md-12">
          <label className='col-md-4'>Name: </label>
          <input type='text' value={this.state.chartName} onChange={this.newChartNameChanged} />
        </div>
      </div>
    )

    const {
      leftMenuChartIndex
    } = this.state

    let listClassName = ''
    const {
      charts,
      chartAdditionHandler,
      selectedChartIndex,
      chartSelectionHandler,
      chartDeletionHandler,
      selectedChartChangeHandler} = this.props
    
    return (
      <div className="full-height">
        <div className="chart-list">
          <div className="side-menu-heading">
            <img src={chartIcon} alt="chart-icon"/>
            <span>Charts</span>
            <i onClick={() => this.showChartDetailsModal('ADD')} className="fa fa-plus-circle add-new" aria-hidden="true"></i>
          </div>
          <ul id="chart_list_ul">
            {
              charts.map((chart, index) => {
                listClassName = (index === selectedChartIndex) ? 'selected-chart' : ''
                listClassName += (leftMenuChartIndex === index) ? ' right-button-clicked' : ''
                return (
                  <li onClick={() => this.selectChartHandler(index)} key={index}
                    className={listClassName}
                    onContextMenu={(e) => this.toggleLeftMenu(e, index)}>
                    <span title={chart.name}>{chart.name}</span>
                  </li>)
              })
            }
            {
              this.state.showLeftNavContextMenu && 
                <ul className="left-nav-menu" style={this.state.leftMenuPosition} 
                  onContextMenu={(e)=> {e.preventDefault()}}>
                  <li onClick={() => this.showChartDetailsModal('EDIT')}>Rename Chart 
                    <i className="fa fa-pencil"/></li>
                  <li onClick={() => 
                      this.props.chartDeletionHandler(this.state.leftMenuChartIndex, this.hideLeftMenu)}>
                    Delete Chart<i className="fa fa-trash-o"/></li>
                  <li className="close-option" onClick={this.hideLeftMenu}>Close</li>
                </ul>
            }
          </ul>
        </div>
        <SquealyModal
          modalId='addChartModal'
          closeModal={() => this.setState({ showAddChartModal: false })}
          showModal={this.state.showAddChartModal}
          modalHeader= {this.state.chartEditMode ? 'Rename Chart' : 'Create New Chart'}
          modalContent={addNewChartModalContent}
          saveChanges={this.chartAdditionModalSave} />
      </div>
    )
  }
}