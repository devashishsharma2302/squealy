import React, {Component} from 'react'

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import EditIcon from '../../images/Edit_icon.png'

const style = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tempChartData = {
    cols: [{id: 'task', label: 'Task', type: 'string'},
           {id: 'hours', label: 'Hours', type: 'number'},
           {id: 'revenue', label: 'Amount', type: 'number'}],
    rows: [{c:[{v: 'Work'}, {v: 11}, {v: 8}]},
           {c:[{v: 'Eat'}, {v: 2}, {v: 6}]},
           {c:[{v: 'Commute'}, {v: 6}, {v: 4}]},
           {c:[{v: 'Watch TV'}, {v:8}, {v: 2}]},
           {c:[{v: 'Sleep'}, {v:7}, {v: 10}]}]
    }

export default class Widget extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: props.widgetData.width,
      height: props.widgetData.height,
      top: props.widgetData.top,
      left: props.widgetData.left
    }
  }

  // Sets the width and height of the widget and rnd component in widget's state
  widgetResizeHandler = (direction, styleSize) => {
    this.setState({
      width: styleSize.width,
      height: styleSize.height
    })
  }

  // Sets the position of the widget in its state
  widgetPositionHandler = (event, uiState) => {
    this.setState({
      top: uiState.position.top,
      left: uiState.position.left
    }, () => {
      // Update the position of the widget in the state of dashboard container
      const {selectedDashboardIndex, index} = this.props
      this.props.widgetRepositionHandler(selectedDashboardIndex, index, this.state.top, this.state.left)
    })
  }

  // Toggles the edit mode of this component
  editModeToggler = () => {
    this.setState({editMode: !this.state.editMode})
  }

  // Updates the size of the widget in the state of dashboard container
  widgetSizeUpdator = () => {
    const {selectedDashboardIndex, index} = this.props
    this.props.widgetResizeHandler(selectedDashboardIndex, index, this.state.width, this.state.height)
  }


  render() {
    const {top, left, height, width} = this.state
    const {
      modalVisibilityEnabler,
      index,
      widgetData
    } = this.props
    return(
      <Rnd
        ref={'widget'+index}
        x={left}
        y={top}
        width={width}
        height={height}
        onResize={this.widgetResizeHandler}
        onResizeStop={this.widgetSizeUpdator}
        onDragStop={this.widgetPositionHandler}
      >
        <div
          onMouseEnter={this.editModeToggler}
          onMouseLeave={this.editModeToggler}
        >
          <h3>
            {widgetData.title}
          </h3>
          {this.state.editMode?
            <img src={EditIcon}
             className='edit-icon'
             onClick={()=>modalVisibilityEnabler(index)}
            />
            :
            null
          }
        </div>
        <GoogleChartComponent config={{
            ...tempChartData,
            index: index,
            width: width,
            height: height,
            chartType: widgetData.chartType,
            chartStyles: widgetData.chartStyles
          }}
        />
      </Rnd>
    )
  }
}
