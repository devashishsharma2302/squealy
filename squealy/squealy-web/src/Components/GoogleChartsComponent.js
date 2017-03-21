import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from './../Constant'

export default class GoogleChartWrapper extends Component {

  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    const { chartData, chartType, options, id } = this.props
    let tableData = JSON.parse(JSON.stringify(chartData))
    if (chartType === 'Table' && chartData.cols) {
      tableData.cols.map((col, index) => {
        col.type = 'string'
      })
    }
    let wrapper = new google.visualization.ChartWrapper({
      chartType: (chartType) ? chartType : 'ColumnChart',
      dataTable: tableData,
      containerId: id,
      options: {
        ...options,
        'height': 'auto',
        'width': '100%'
      }
    });
    wrapper.draw();
  }

  componentDidUpdate() {
    this.renderChart()
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
