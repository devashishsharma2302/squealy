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
      containerId: 'widget',
      options: {
        'height': '400',
        'width': '100%',
        'backgroundColor': '#ffffff',
        'chartArea': {'width': '100%', 'height': '80%'}
      }
    });
    wrapper.draw();
  }

  componentDidUpdate(nextProps) {
    this.renderChart(this.props.config)
  }


  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps)
  }

  render() {
    const { config } = this.props
    return( 
      <div>
        <div id="widget" />
      </div>
    )
  }
}
