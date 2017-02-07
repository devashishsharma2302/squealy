import React, {Component} from 'react'
import QueryEditor from './QueryEditor'
import ResultSection from './ResultSection'
import TabsComponent from './TabsComponent'

export default class ApiDesignView extends Component {
  render() {
    return (
      <div>
	      <div className="col-md-12 tabs-container">
	      <TabsComponent />
	      </div>
	      <div className="col-md-12">
		      <QueryEditor />
        </div>
	      <div className="col-md-12">
		      <ResultSection />
        </div>
   		</div>

    )
  }
}
