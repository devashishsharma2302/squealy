import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from './../Constant'
import equal from 'deep-equal'

export default class GoogleChartWrapper extends Component {

   static propTypes = {
    config: React.PropTypes.shape({
      grid_width: React.PropTypes.oneOf(GRID_WIDTH_OPTIONS),
      chart_data: React.PropTypes.object.isRequired,
      chart_type: React.PropTypes.oneOf(GOOGLE_CHART_TYPE_OPTIONS),
      height: React.PropTypes.string
    })
  }

  componentDidMount() {
    this.renderChart(this.props.config)
  }

  renderChart = (config) => {
    var wrapper = new google.visualization.ChartWrapper({
      chartType: config.chart_type,
      dataTable: config.chart_data,
      containerId: config.chartId
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
    const chartHeight = {height: parseInt(config.height)}

    return(
      <div id={config.chartId + "chart"} className={'col-md-'+config.grid_width+' col-xs-'+config.grid_width + ' hidash-reports-section'}>
        {config.noHeader ? null : <h3>{config.chart_id}</h3>}
          <div id={config.chartId} style={chartHeight} />
      </div>
    )
  }
}