import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import chartIcon from './../images/charts_icon.png'
import dashboardIcon from './../images/dashboard_icon.png'
import { SquealyModal } from './SquealyUtilsComponents'

export default class SideMenu extends Component {
  constructor() {
    super()
    this.state = {
      showLeftNavContextMenu: false,
      leftMenuChartIndex: null,
      showAddChartModal: false,
      chartName: '',
      database: null,
      chartEditMode: false,
      leftMenuPosition: {
        top: 0,
        left: 0
      }
    }
  }

/*
  //FIXME: Commenting this code as facing some bubbling issues. Need to fix it. 
  componentDidMount () {
    document.body.addEventListener('click', this.hideLeftMenu);
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.hideLeftMenu);
  }
*/
  newChartNameChanged = (e) => {
    this.setState({chartName: e.target.value})
  }

  hideLeftMenu = (e) => {
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
      top: e.pageY - (this.refs.chartListUl ? this.refs.chartListUl.offsetTop : 0) - 10,
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
      selectedChartName = (action === 'EDIT') ? charts[this.state.leftMenuChartIndex].name : '',
      database = (action === 'EDIT') ? charts[this.state.leftMenuChartIndex].database : null

    this.setState({ 
      showAddChartModal: true,
      chartName: selectedChartName,
      database: database,
      showLeftNavContextMenu: false,
      chartEditMode: action === 'EDIT' ? true : false
    })
  }

  selectChartHandler = (index, action) => {
    this.setState({showLeftNavContextMenu: false, leftMenuChartIndex: null})
    this.props.chartSelectionHandler(index)
  }

  chartAdditionModalSave = (e) => {
    const {leftMenuChartIndex, chartName, database, chartEditMode} = this.state
    if (chartEditMode) {
      this.props.selectedChartChangeHandler(
        'name', chartName, null, leftMenuChartIndex)
    } else {
      this.props.chartAdditionHandler(chartName, database)
    }
    this.setState({ showAddChartModal: false, leftMenuChartIndex: null })
  }

  onChangeDatabase = (db) => {
    let dbVal = db ? db.value : null
    this.setState({database: dbVal}, () => {
      this.state.chartEditMode ? 
        this.props.selectedChartChangeHandler('database', dbVal, null, this.state.leftMenuChartIndex) : null
    })
  }

  render() {
    const {
      leftMenuChartIndex,
      chartName,
      showLeftNavContextMenu,
      leftMenuPosition,
      showAddChartModal,
      chartEditMode,
      database
    } = this.state

    const {
      charts,
      chartAdditionHandler,
      selectedChartIndex,
      chartSelectionHandler,
      chartDeletionHandler,
      selectedChartChangeHandler,
      userInfo,
      databases
    } = this.props

    const addNewChartModalContent = (
      <div className='app-modal-content'>
        <div className="row">
          <label className='col-md-4'>Name: </label>
          <input className='chart-name-input' type='text' value={chartName} onChange={this.newChartNameChanged} />
        </div>
        <div className='row'>
          <label className='col-md-4'>Databse: </label>
          <div className='col-md-8 chart-modal-db'>
            <Select
              value={(database) ? database : null}
              options={databases}
              onChange={this.onChangeDatabase}
              placeholder={'Select Database'}
            />
          </div>
        </div>
      </div>
    )

    let listClassName = ''
    
    return (
      <div className="full-height">
        <div className="chart-list">
          <div className="side-menu-heading">
            <img src={chartIcon} alt="chart-icon"/>
            <span>Charts</span>
            {
              (userInfo.can_add_chart) ?
                <i onClick={() => this.showChartDetailsModal('ADD')} className="fa fa-plus-circle add-new" aria-hidden="true"></i>
                : null
            }
          </div>
          <ul ref="chartListUl">
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
              showLeftNavContextMenu && this.props.charts[leftMenuChartIndex].can_edit && 
                <ul className="left-nav-menu" style={leftMenuPosition} 
                  onContextMenu={(e)=> {e.preventDefault()}}>
                  <li onClick={() => this.showChartDetailsModal('EDIT')}>Rename Chart 
                    <i className="fa fa-pencil"/></li>
                  {
                    (userInfo.can_delete_chart) && <li className='delete-chart' onClick={() => 
                      this.props.chartDeletionHandler(leftMenuChartIndex, this.hideLeftMenu)}>
                    Delete Chart<i className="fa fa-trash-o"/></li>
                  }
                  <li className="close-option" onClick={this.hideLeftMenu}>Close</li>
                </ul>
            }
          </ul>
        </div>
        <SquealyModal
          modalId='addChartModal'
          closeModal={() => this.setState({ showAddChartModal: false })}
          showModal={showAddChartModal}
          modalHeader= {chartEditMode ? 'Rename Chart' : 'Create New Chart'}
          modalContent={addNewChartModalContent}
          helpText=''
          saveChanges={this.chartAdditionModalSave} />
      </div>
    )
  }
}
