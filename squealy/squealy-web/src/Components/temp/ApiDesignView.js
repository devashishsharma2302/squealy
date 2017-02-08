import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'

export default class ApiDesignView extends Component {
  render() {
    const { chart, selectedChartChangeHandler } = this.props
    console.log(chart.name)
    return (
      <div>
	      <div className="col-md-12 tabs-container">
	      <TabsComponent transformations={chart.transformations}/>
	      </div>
	      <div className="col-md-12">
		      <QueryEditor query={chart.query} selectedChartChangeHandler={selectedChartChangeHandler} />
        </div>
	      <div className="col-md-12">
		      <ResultSection />
        </div>
   		</div>

    )
  }
}
