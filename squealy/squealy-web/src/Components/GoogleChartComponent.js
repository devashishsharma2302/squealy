import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from './../Constant'
import equal from 'deep-equal'

export default class GoogleChartWrapper extends Component {

  componentDidMount() {
    this.renderChart(this.props.config)
  }

  renderChart = (config) => {
    var wrapper = new google.visualization.ChartWrapper({
      chartType: 'ColumnChart',
      dataTable: config,
      containerId: 'widget' + config.index,
      options: {
        'height': config.height,
        'width': config.width,
        'legend': {'position': 'bottom'}
      }
    });
    wrapper.draw();
  }

  componentDidUpdate(nextProps) {
    this.renderChart(this.props.config)
  }

  render() {
    const { config } = this.props
    return(
      <div id={'widget' + config.index} />
    )
  }
}
