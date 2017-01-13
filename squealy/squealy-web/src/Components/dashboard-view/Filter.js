import React, {Component} from 'react'
import Select from 'react-select'
import Rnd from 'react-resizable-and-movable'
import Datetime from 'react-datetime'
import moment from 'moment'

import {RND_FILTER_RESIZEABILITY_CONSTRAINTS, FILTER_TYPES} from '../../Constant'
import {getApiRequest} from '../../Utils'
import {DATE_FORMAT, DATETIME_FORMAT, DOMAIN_NAME} from '../../Constant'
import EditIcon from '../../images/Edit_icon.png'
import DeleteIcon from '../../images/Delete_icon.png'
import 'react-datetime/css/react-datetime.css'
import {GRID_WIDTH, GRID_PADDING, GRID_HEIGHT}from '../../Constant'


class SquealyDatePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler
    } = this.props
    return(
      <Datetime
        defaultValue={value}
        className="rnd-filter"
        timeFormat={false}
        onChange={
          (value)=>onChangeHandler(value.format(DATE_FORMAT))}
      />
    )
  }
}

class SquealyDatetimePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler
    } = this.props
    return(
      <Datetime
        defaultValue={value}
        className="rnd-filter"
        onChange={
          (val)=>onChangeHandler(val.format(DATETIME_FORMAT))}
      />
    )
  }
}

class SquealyDropdown extends Component {
  render() {
    const {
      value,
      onChangeHandler,
      dragEnableHandler,
      dragDisableHandler,
      filterData
    } = this.props
    return(
      <select
        value={value}
        onFocus={dragDisableHandler}
        onBlur={dragEnableHandler }
        onChange={(e) => onChangeHandler(e.target.value)}
        className="rnd-filter"
      >
        {filterData?
          filterData.data.map((option, i) => {
            return (
              <option key={'dropdown_'+i} value={option[0]}>{option[0]}</option>
            )
          })
          :
          null
        }
      </select>
    )
  }
}

class SquealyInput extends Component {


  render() {
    const {value, onChangeHandler} = this.props
    return(
      <input
        defaultValue={value}
        className="rnd-filter"
        type="text"
        onBlur={(e) => onChangeHandler(e.target.value)}
      />
    )
  }
}

const filterTypes = {
  'dropdown': SquealyDropdown,
  'input': SquealyInput,
  'dateTime': SquealyDatetimePicker,
  'date': SquealyDatePicker
}


export default class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: props.filterDefinition.width,
      top: props.filterDefinition.top,
      left: props.filterDefinition.left,
      draggable: true
    }
  }

  componentWillMount() {
    this.refreshFilterData(this.props.filterValues)
  }

  refreshFilterData = (filterValues) => {
    const {filterDefinition, updateFilterValues} = this.props
    if(filterDefinition.apiUrl) {
      const url = DOMAIN_NAME + 'squealy-apis/' + filterDefinition.apiUrl
      getApiRequest(url, filterValues, (data)=> { 
                                          this.setState({filterData: data})
                                          if (! (filterDefinition.label in this.props.filterValues)) {
                                            updateFilterValues(filterDefinition.label, data.data[0][0])
                                          }
                                        }, ()=>{}, null)
    }
  }

  
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.filterValues) !== JSON.stringify(nextProps.filterValues) && this.props.filterDefinition.isParameterized){
      this.refreshFilterData(nextProps.filterValues)
    }
  } 
   
  disableDragging = () => {
    this.setState({draggable: false})
  }

  enableDragging = () => {
    this.setState({draggable: true})
  }

  // Sets the width and height of the widget and rnd component in filter's state
  filterResizeHandler = (direction, styleSize) => {
    this.setState({
      width: styleSize.width/GRID_WIDTH,
    })
  }

  // Sets the position of the filter in its state
  filterPositionHandler = (event, uiState) => {
    if (event.target.tagName !== 'SPAN') {
      let leftPosition = Math.round(uiState.node.getBoundingClientRect().left)
      this.setState({
        left: Math.round(leftPosition/GRID_WIDTH)
      }, () => {
        // Update the position of the widget in the state of dashboard container
        const {selectedDashboardIndex, index} = this.props
        this.props.filterRepositionHandler(selectedDashboardIndex, index, this.state.left)
      })
    }
  }

  updateFilterSize = () => {
    const {selectedDashboardIndex, index} = this.props
    this.props.filterResizeHandler(selectedDashboardIndex, index, this.state.width)
  }

  resizeStartHandler = (direction, styleSize, clientSize, e) => {
     e.preventDefault();
  }

  dragStartHandler = (e) => {
    if (!['INPUT', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
    }
  }

  render() {
    const {top, left, width, height, draggable, filterData} = this.state
    const {
      index,
      filterDefinition,
      updateFilterValues,
      filterDeletionHandler,
      selectedDashboardIndex,
      modalVisibilityEnabler,
      value
    } = this.props
    let filterToBeRendered = null
    if(filterDefinition.type) {
      const FilterReference = filterTypes[filterDefinition.type]
      filterToBeRendered =
        <FilterReference
          value={value}
          onChangeHandler={(newValue)=>updateFilterValues(filterDefinition.label, newValue)}
          dragDisableHandler={this.disableDragging}
          dragEnableHandler={this.enableDragging}
          filterData={filterData}
        />
    }
    return(
      <Rnd
        ref={'filter'+index}
        x={left*GRID_WIDTH}
        y={top*GRID_HEIGHT}
        zIndex={500}
        width={width*GRID_WIDTH}
        onResize={this.filterResizeHandler}
        onResizeStop={this.updateFilterSize}
        onResize={this.widgetResizeHandler}
        onResizeStart={this.resizeStartHandler}
        onDragStart={this.dragStartHandler}
        onDragStop={this.filterPositionHandler}
        resizeGrid={[GRID_WIDTH, GRID_HEIGHT]}
        moveGrid={[GRID_WIDTH, GRID_HEIGHT]}
        isResizable={RND_FILTER_RESIZEABILITY_CONSTRAINTS}
        bounds={'parent'}
        moveAxis={draggable?'x':'none'}
      >
      <div
        className="rnd-filter-wrapper"
        style={{
          paddingLeft: GRID_PADDING,
          paddingRight: GRID_PADDING
        }}
      >
        <label
          className="rnd-filter-label">
          {filterDefinition.label}
        </label>
        {filterToBeRendered?
          filterToBeRendered
        :
          <span>Filter type not selected</span>
        }
        <img  
          src={EditIcon}
          className='filter-edit-icon'
          onClick={()=>modalVisibilityEnabler(index)}
        />
        <img 
          src={DeleteIcon}
          className='filter-delete-icon'
          onClick={()=>filterDeletionHandler(selectedDashboardIndex, index)}
        />
      </div>
      </Rnd>
    )
  }
}

