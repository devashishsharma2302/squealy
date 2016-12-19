import React, {Component} from 'react'
import Select from 'react-select';

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import {GOOGLE_CHART_TYPE_OPTIONS} from '../../Constant'
import EditIcon from '../../images/Edit_icon.png'

const style = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tempChartData = {
    cols: [{id: 'task', label: 'Task', type: 'string'},
           {id: 'hours', label: 'Hours per Day', type: 'number'}],
    rows: [{c:[{v: 'Work'}, {v: 11}]},
           {c:[{v: 'Eat'}, {v: 2}]},
           {c:[{v: 'Commute'}, {v: 2}]},
           {c:[{v: 'Watch TV'}, {v:2}]},
           {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}]
    }

export default class Widget extends Component {

  constructor() {
    super()
    this.state = {
      width: 434,
      height: 384,
      top:20,
      left: 20,
      title: 'Chart Title',
      editMode: false,
      chartType: GOOGLE_CHART_TYPE_OPTIONS[7].value
    }
  }

  // Sets the width and height of the widget and rnd component
  widgetResizeHandler = (direction, styleSize) => {
    this.setState({
      width: styleSize.width,
      height: styleSize.height
    })
  }

  // Sets the position of the widget
  widgetPositionHandler = (event, position) => {
    this.setState({
      top: position.top,
      left: position.left
    })
  }

  // Toggles the edit mode of this component
  editModeToggler = () => {
    this.setState({editMode: !this.state.editMode})
  }

  render() {
    const {top, left, height, width, title, chartType} = this.state
    const {modalVisibilityEnabler, index} = this.props
    return(
      <Rnd
        ref={'widget'+this.props.index}
        x={20}
        y={20}
        width={width}
        height={height}
        onResize={this.widgetResizeHandler}
        onDragStop={this.widgetPositionHandler}
      >
        <div
          onMouseOver={this.editModeToggler}
          onMouseOut={this.editModeToggler}
          onClick={modalVisibilityEnabler}
        >
          <h3>
            {title}
          </h3>
          {this.state.editMode?
            <img src={EditIcon}
              className='edit-icon'
              onClick={()=>console.log('"called"')}
            />
            :
            null}
        </div>
        <GoogleChartComponent config={{
            ...tempChartData,
            index: index,
            width: width,
            height: height
          }}
        />
      </Rnd>
    )
  }
}
