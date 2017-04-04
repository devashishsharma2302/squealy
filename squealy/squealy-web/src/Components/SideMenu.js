import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import chartIcon from './../images/charts_icon.png'
import filterIcon from './../images/filter_icon.png'
import dashboardIcon from './../images/dashboard_icon.png'
import AddWidgetModal from './AddWidgetModal'

export default class SideMenu extends Component {
  constructor() {
    super()
    this.state = {
      showLeftNavContextMenu: false,
      clickedChartIndex: null,
      clickedFilterIndex: null,
      showAddChartModal: false,
      showAddFilterModal: false,
      chartEditMode: false,
      addChartModalHeading:'Add new chart',
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

  hideLeftMenu = (e) => {
    this.setState({
      clickedFilterIndex: null,
      clickedChartIndex: null,
      showLeftNavContextMenu: false,
      showLeftNavFilterContextMenu: false
    })
  }

  toggleLeftMenu = (e, index, contextMenuStateKey, clickedIndexStateKey) => {
    e.preventDefault()
    //e.pageY calculating height from ul.
    //FIXME: Hardcoded 10px to show menu at accurate position. Need to check why do we need to add it?
    let leftMenuPosition = {
      top: e.pageY - (this.refs.chartListUl ? this.refs.chartListUl.offsetTop : 0) - 10,
      left: e.pageX
    },
    flag = (index !== this.state[clickedIndexStateKey]) || !this.state[contextMenuStateKey]

    this.setState({
      [clickedIndexStateKey]: flag ? index : null,
      [contextMenuStateKey]: flag,
      leftMenuPosition: leftMenuPosition
    })
  }

  showChartDetailsModal = (action, showModalState) => {
    this.setState({ 
      [showModalState]: true,
      showLeftNavContextMenu: false,
      showLeftNavFilterContextMenu: false,
      chartEditMode: action === 'EDIT' ? true : false
    })
  }

  selectChartHandler = (index, action) => {
    this.setState({showLeftNavContextMenu: false, clickedChartIndex: null})
    this.props.chartSelectionHandler(index)
  }

  selectFilterHandler = (index, action) => {
    this.setState({showLeftNavContextMenu: false, clickedChartIndex: null})
    this.props.filterSelectionHandler(index)
  }

  closeModal = () => {
    this.setState({
      showAddChartModal: false,
      clickedChartIndex: null,
      showAddFilterModal: false
    })
  }

  render() {
    const {
      clickedChartIndex,
      showLeftNavContextMenu,
      leftMenuPosition,
      showAddChartModal,
      showAddFilterModal,
      chartEditMode,
      clickedFilterIndex,
      showLeftNavFilterContextMenu
    } = this.state

    const {
      charts,
      chartAdditionHandler,
      filterAdditionHandler,
      selectedChartIndex,
      selectedFilterIndex,
      chartSelectionHandler,
      chartDeletionHandler,
      selectedChartChangeHandler,
      filterDeletionHandler,
      selectedFilterChangeHandler,
      filterSelectionHandler,
      userInfo,
      databases,
      filters
    } = this.props

    let listClassName = ''
    
    return (
      <div className="full-height">
        <div className="chart-list">
          <div className="side-menu-heading">
            <img src={chartIcon} alt="chart-icon"/>
            <span>Charts</span>
            {
              (userInfo.can_add_chart) ?
                <i onClick={() => this.showChartDetailsModal('ADD', 'showAddChartModal')} className="fa fa-plus-circle add-new" aria-hidden="true"></i>
                : null
            }
          </div>
          <ul ref="chartListUl">
            {
              charts.map((chart, index) => {
                listClassName = (index === selectedChartIndex) ? 'selected-chart' : ''
                listClassName += (clickedChartIndex === index) ? ' right-button-clicked' : ''
                return (
                  <li onClick={() => this.selectChartHandler(index)} key={index}
                    className={listClassName}
                    onContextMenu={(e) => this.toggleLeftMenu(e, index, 'showLeftNavContextMenu', 'clickedChartIndex')}>
                    <span title={chart.name}>{chart.name}</span>
                  </li>)
              })
            }
            {
              showLeftNavContextMenu && this.props.charts.length > clickedChartIndex && this.props.charts[clickedChartIndex].can_edit && 
                <ul className="left-nav-menu" style={leftMenuPosition} 
                  onContextMenu={(e)=> {e.preventDefault()}}>
                  <li onClick={() => this.showChartDetailsModal('EDIT', 'showAddChartModal')}>Rename Chart 
                    <i className="fa fa-pencil"/></li>
                  {
                    (userInfo.can_delete_chart) && <li className='delete-chart' onClick={() => 
                      this.props.chartDeletionHandler(clickedChartIndex, this.hideLeftMenu)}>
                    Delete Chart<i className="fa fa-trash-o"/></li>
                  }
                  <li className="close-option" onClick={this.hideLeftMenu}>Close</li>
                </ul>
            }
          </ul>
        </div>
        <div className="chart-list">
          <div className="side-menu-heading">
            <img src={filterIcon} alt="filter-icon"/>
            <span>Dropdown Filters</span>
            {
              (userInfo.can_add_chart) ?
                <i onClick={() => this.showChartDetailsModal('ADD', 'showAddFilterModal')} className="fa fa-plus-circle add-new" aria-hidden="true"></i>
                : null
            }
          </div>
          <ul ref="filterListUl">
            {
              filters.map((filter, index) => {
                listClassName = (index === selectedFilterIndex) ? 'selected-chart' : ''
                listClassName += (clickedFilterIndex === index) ? ' right-button-clicked' : ''
                return (
                  filter.can_edit &&
                  <li onClick={() => this.selectFilterHandler(index)} key={index}
                    className={listClassName}
                    onContextMenu={(e) => this.toggleLeftMenu(e, index, 
                      'showLeftNavFilterContextMenu',
                      'clickedFilterIndex')}>
                    <span title={filter.name}>{filter.name}</span>
                  </li>)
              })
            }
          </ul>
        </div>
        {
          showLeftNavFilterContextMenu && this.props.filters.length > clickedFilterIndex && this.props.filters[clickedFilterIndex].can_edit && 
            <ul className="left-nav-menu" style={leftMenuPosition} 
              onContextMenu={(e)=> {e.preventDefault()}}>
              <li onClick={() => this.showChartDetailsModal('EDIT', 'showAddFilterModal')}>Rename Filter 
                <i className="fa fa-pencil"/></li>
              {
                (userInfo.can_delete_chart) &&
                <li className='delete-chart' onClick={() => 
                  this.props.filterDeletionHandler(clickedFilterIndex, this.hideLeftMenu)}>
                  Delete Filter<i className="fa fa-trash-o"/>
                </li>
              }
              <li className="close-option" onClick={this.hideLeftMenu}>Close</li>
            </ul>
        }
        <AddWidgetModal
          helpText=''
          widgetData={charts}
          modalId={'add-new-chart'}
          modalHeading={chartEditMode ? 'Edit Chart' : 'Add Chart'}
          showModal={showAddChartModal}
          closeModal={this.closeModal}
          selectedWidgetHandler={selectedChartChangeHandler}
          widgetAdditionHandler={chartAdditionHandler}
          editMode={chartEditMode}
          selectedWidgetIndex={clickedChartIndex}
          databases={databases}
        />
        <AddWidgetModal
          helpText=''
          widgetData={filters}
          modalId={'add-new-filter'}
          modalHeading={chartEditMode ? 'Edit Filter' : 'Add Filter'}
          showModal={showAddFilterModal}
          closeModal={this.closeModal}
          selectedWidgetHandler={selectedFilterChangeHandler}
          widgetAdditionHandler={filterAdditionHandler}
          editMode={chartEditMode}
          selectedWidgetIndex={clickedFilterIndex}
          databases={databases}
        />
      </div>
    )
  }
}
