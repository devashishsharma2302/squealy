import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from '../../Constant'

export default class GoogleChartWrapper extends Component {

  componentDidMount() {
    if (JSON.stringify(this.props.chartData) !== '{}') {
      if (this.props.chartData) {
        this.renderChart()
      }
    }
  }

  renderChart = () => {
    const { chartData, chartType, options, id } = this.props
    if (chartData.chartType === 'Table' && chartData.cols) {
      chartData.cols.map((col, index) => {
        col.type = 'string'
      })
    }
    let wrapper = new google.visualization.ChartWrapper({
      chartType: (chartType) ? chartType : 'ColumnChart',
      dataTable: chartData,
      containerId: id,
      options: {
        ...options,
        'height': 350,
        'width': '100%',
      }
    });
    wrapper.draw();
  }

  componentDidUpdate() {
    if (this.props.chartData) {
      this.renderChart()
    }
  }

  render() {
    const { id, chartData } = this.props
    return(
      (JSON.stringify(chartData) !== '{}')?
      <div id={id} />
      : null
      )
  
  }
}
