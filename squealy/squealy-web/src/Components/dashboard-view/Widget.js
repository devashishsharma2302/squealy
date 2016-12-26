import React, {Component} from 'react'

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import EditIcon from '../../images/Edit_icon.png'
import DeleteIcon from '../../images/Delete_icon.png'
import {getApiRequest} from '../../Utils'

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
    this.widgetIndex = this.props.dashboardIndex + '' + this.props.index
    this.state = {}
  }
  
  componentWillMount() {
    const url = 'http://localhost:8000/squealy-apis/'+this.props.widgetData.api_url
    getApiRequest(url, null, (data)=> this.setState({chartData: data}), ()=>{}, null)
  }
  // Sets the width and height of the widget and rnd component in widget's state
  widgetResizeHandler = (direction, styleSize) => {
    const {dashboardIndex, index} = this.props
    this.props.widgetResizeHandler(dashboardIndex, index, styleSize.width, styleSize.height)

  }
  
  // Sets the position of the widget in its state
  widgetPositionHandler = (event, uiState) => {
    // Update the position of the widget in the state of dashboard container
    const {dashboardIndex, index} = this.props
    this.props.widgetRepositionHandler(dashboardIndex, index, uiState.position.top, uiState.position.left)
  }

  render() {
    const {chartData} = this.state
    const {
      modalVisibilityEnabler,
      index,
      widgetData,
      deleteWidget,
      widgetDeletionHandler,
      dashboardIndex,
    } = this.props
    return(
      (widgetData)?
        <Rnd
          x={widgetData.left}
          y={widgetData.top}
          width={widgetData.width}
          height={widgetData.height}
          onResize={this.widgetResizeHandler}
          onDragStop={this.widgetPositionHandler}
        >
          <div
            onMouseEnter={() => this.setState({editMode: true})}
            onMouseLeave={() => this.setState({editMode: false})}
          >
            <h3>
              {widgetData.title}
            </h3>
            <img src={EditIcon}
                    className='edit-icon'
                   onClick={()=>modalVisibilityEnabler(index)}
                  />
            <img src={DeleteIcon}
                 className='delete-icon'
                 onClick={()=>widgetDeletionHandler(dashboardIndex, index)}
            />
          </div>
          <GoogleChartComponent config={{
              ...chartData,
              index: this.widgetIndex,
              width: widgetData.width,
              height: widgetData.height,
              chartType: widgetData.chartType,
              chartStyles: widgetData.chartStyles
            }}
          />
        </Rnd>
        :
          null
    )
  }
}
