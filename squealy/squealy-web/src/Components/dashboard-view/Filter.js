import React, {Component} from 'react'
import Select from 'react-select'
import Rnd from 'react-resizable-and-movable'
import Datetime from 'react-datetime'
import moment from 'moment'

import {apiUriHostName} from '../../Containers/ApiViewContainer'
import {RND_FILTER_RESIZEABILITY_CONSTRAINTS, FILTER_TYPES} from '../../Constant'
import {getApiRequest} from '../../Utils'
import {DATE_FORMAT, DATETIME_FORMAT} from '../../Constant'
import EditIcon from '../../images/Edit_icon.png'
import 'react-datetime/css/react-datetime.css'
import {GRID_WIDTH, GRID_PADDING, GRID_HEIGHT}from '../../Constant'


class HidashDatePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler
    } = this.props
    return(
      <Datetime
        value={value}
        onChange={
          (value)=>onChangeHandler(moment(value).format(DATE_FORMAT))}
      />
    )
  }
}

class HidashDatetimePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler
    } = this.props
    return(
      <Datetime
        value={value}
        onChange={
          (value)=>onChangeHandler(moment(value).format(DATETIME_FORMAT))}
      />
    )
  }
}

class HidashDropdown extends Component {
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

class HidashInput extends Component {


  render() {
    const {value, onChangeHandler} = this.props
    return(
      <input
        className="rnd-filter"
        type="text"
        onBlur={(e) => onChangeHandler(e.target.value)}
      />
    )
  }
}

const filterTypes = {
  'dropdown': HidashDropdown,
  'input': HidashInput,
  'dateTime': HidashDatetimePicker,
  'date': HidashDatePicker
}


export default class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: props.filterDefinition.height,
      width: props.filterDefinition.width,
      top: props.filterDefinition.top,
      left: props.filterDefinition.left,
      draggable: true
    }
  }

  componentWillMount() {
    const {filterDefinition} = this.props
    if(filterDefinition.apiUrl) {
      const url = apiUriHostName + '/squealy-apis/' + filterDefinition.apiUrl
      getApiRequest(url, null, (data)=>this.setState({filterData: data}), ()=>{}, null)
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
      width: styleSize.width,
      height: styleSize.height
    })
  }

  // Sets the position of the filter in its state
  filterPositionHandler = (event, uiState) => {
    this.setState({
      top: uiState.position.top,
      left: uiState.position.left
    }, () => {
      // Update the position of the widget in the state of dashboard container
      const {selectedDashboardIndex, index} = this.props
      this.props.filterRepositionHandler(selectedDashboardIndex, index, this.state.top, this.state.left)
    })
  }

  render() {
    const {top, left, width, height, draggable, filterData} = this.state
    const {
      index,
      filterDefinition,
      updateFilterValues,
      deleteFilter,
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
        width={width*GRID_WIDTH}
        onResize={this.widgetResizeHandler}
        onDragStop={this.filterPositionHandler}
        resizeGrid={[92, 10]}
        moveGrid={[92, 10]}
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
          className="rnd-filter-label"
          onClick={()=>deleteFilter(selectedDashboardIndex, index)}>
          {filterDefinition.label}
        </label>
        {filterToBeRendered?
          filterToBeRendered
        :
          <span>Filter type not selected</span>
        }
        <img src={EditIcon}
          onClick={()=>modalVisibilityEnabler(index)}
        />
      </div>
      </Rnd>
    )
  }
}

