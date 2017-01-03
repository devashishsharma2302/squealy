import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from './../Constant'
import equal from 'deep-equal'

export default class GoogleChartWrapper extends Component {

  componentDidMount() {
    this.renderChart(this.props.config)
  }

  renderChart = (config) => {
    let wrapper = new google.visualization.ChartWrapper({
      chartType: config.chartType,
      dataTable: config,
      containerId: 'widget' + config.index,
      options: {
        ...config.chartStyles,
        'height': config.height,
        'width': '100%',
      }
    });
    wrapper.draw();
  }

  componentDidUpdate() {
    this.renderChart(this.props.config)
  }

  render() {
    const { config } = this.props
    return(
      <div id={'widget' + config.index} />
    )
  }
}
