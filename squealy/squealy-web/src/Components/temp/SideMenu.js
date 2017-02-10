import React, {Component, PropTypes} from 'react'

export default class SideMenu extends Component {

  render () {
  	const { charts, chartAdditionHandler, selectedChartIndex, chartSelectionHandler, enableAddChartModal } = this.props
  	return(
      <div className="side-menu">
				<div className="side-menu-heading"><i className="fa fa-pie-chart chart-icon" aria-hidden="true"></i><span>Charts</span>
	      	<i  onClick={enableAddChartModal} className="fa fa-plus add-new" aria-hidden="true"></i>
	      </div>
	      <div className="chart-list">
		      <ul>
			      {
			      	charts.map( (chart, index) => {
			      		return (<li onClick={() => chartSelectionHandler(index)} key={index}
			      							  className={(index===selectedChartIndex)?'selected-chart': ''}>
			      							  <span>{chart.name}</span>
	      							  </li>)
			      	})
			      }
			    </ul>
	      </div>
	      <div className="dashboard-list">
	      <div className="side-menu-heading"><i className="fa fa-pie-chart chart-icon" aria-hidden="true"></i><span>Dashboards</span>
	      	<i className="fa fa-plus add-new" aria-hidden="true"></i>
	      </div>
	      <div className="chart-list">
		      <ul>
			      <li> dash-01 </li>
			      <li> dash-02 </li>
			      <li> dash-03 </li>
			      <li> dash-04 </li>
			      <li> dash-05 </li>
		      </ul>
	      </div>
	      </div>
      </div>
  )}
}
