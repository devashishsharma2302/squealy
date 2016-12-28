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

  componentDidMount() {
    if(this.refs.header && this.refs.header.offsetHeight) {
      this.setHeaderHeight()
    } else {
      // FIXME: Find a work around to avoid timeout
      setTimeout(this.setHeaderHeight, 2000)
    }
  }

  setHeaderHeight = () => {
    this.setState({headerHeight: this.refs.header.offsetHeight})
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
          </div>
          <GoogleChartComponent config={{
              ...chartData,
              index: this.widgetIndex,
              width: widgetData.width,
              height: widgetData.height - this.state.headerHeight,
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
