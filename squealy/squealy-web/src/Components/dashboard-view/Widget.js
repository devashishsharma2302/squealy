import React, {Component} from 'react'

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import EditIcon from '../../images/Edit_icon.png'
import DeleteIcon from '../../images/Delete_icon.png'
import {getApiRequest} from '../../Utils'
import {GRID_WIDTH, GRID_HEIGHT, GRID_PADDING, GRID_WIDTH_OPTIONS}from '../../Constant'

const style = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


export default class Widget extends Component {

  constructor(props) {
    super(props)
    this.widgetIndex = this.props.dashboardIndex + '' + this.props.index
    this.state = {
      headerHeight: 50
    }
  }
  
  componentWillMount() {
    this.refreshChartData({})
  }

  refreshChartData = (filterValues) => {
    if (this.props.widgetData) {
      //TODO: remove localhost
      const url = 'http://localhost:8000/squealy-apis/'+this.props.widgetData.api_url
      const params = {...filterValues, ...this.props.widgetData.apiParams}
      getApiRequest(url, params, (data)=> this.setState({chartData: data}), ()=>{}, null)
    }
  }

  // Sets the width and height of the widget and rnd component in widget's state
  widgetResizeHandler = (direction, styleSize) => {
    const {dashboardIndex, index} = this.props
    const newWidth = styleSize.width/GRID_WIDTH
    const newHeight = styleSize.height/GRID_HEIGHT
    this.props.widgetResizeHandler(dashboardIndex, index, newWidth, newHeight)

  }

  // Sets the position of the widget in its state
  widgetPositionHandler = (event, uiState) => {
    // Update the position of the widget in the state of dashboard container
    const {dashboardIndex, index} = this.props
    const newTop = uiState.position.top/GRID_HEIGHT
    const newLeft = uiState.position.left/GRID_WIDTH
    this.props.widgetRepositionHandler(dashboardIndex, index, newTop, newLeft)
  }

  //Check for filter changes
  componentWillReceiveProps(nextProps) {
    if (nextProps.filterValues !== this.props.filterValues) {
      this.refreshChartData(nextProps.filterValues)
    }
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
      googleDefined,
      filterValues
    } = this.props
    return(
      (widgetData && googleDefined)?
          <Rnd
            x={widgetData.left*GRID_WIDTH}
            y={widgetData.top*GRID_HEIGHT}
            width={widgetData.width*GRID_WIDTH}
            height={widgetData.height*GRID_HEIGHT}
            resizeGrid={[GRID_WIDTH, GRID_HEIGHT]}
            moveGrid={[GRID_WIDTH, GRID_HEIGHT]}
            onResize={this.widgetResizeHandler}
            onDragStop={this.widgetPositionHandler}
            bounds={{
              left: 0,
              right: 830
            }}
          >
            <div
              onMouseEnter={() => this.setState({editMode: true})}
              onMouseLeave={() => this.setState({editMode: false})}
              style={{
                paddingLeft: GRID_PADDING,
                paddingRight: GRID_PADDING,
              }}
            >
              <h3 ref='header'>
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
            <GoogleChartComponent config={{
                ...chartData,
                index: this.widgetIndex,
                width: widgetData.width*GRID_WIDTH,
                height: widgetData.height*GRID_HEIGHT - this.state.headerHeight,
                chartType: widgetData.chartType,
                chartStyles: widgetData.chartStyles
              }}
            />
            </div>
          </Rnd>
        :
          null
    )
  }
}
