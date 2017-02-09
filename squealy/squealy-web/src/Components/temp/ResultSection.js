import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import {Tab, Tabs} from 'react-bootstrap'
import mockResponse from './mockResponse'
import GoogleChartsComponent from './GoogleChartsComponent'

export default class ResultSection extends Component {
  render() {
    const { chartData, selectedChartIndex, googleDefined, options, chartType } = this.props
    return (
    	<AccordionTab heading='Results'>
			  {(googleDefined && (chartData !== {} ))?
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
    		    <Tab eventKey={1} title="Data">
             <GoogleChartsComponent chartData={chartData} options={{}} chartType='Table'
                                    id={'response-table-'+ selectedChartIndex} />
            </Tab>
  			    <Tab eventKey={2} title="Visualisation">
              <GoogleChartsComponent chartData={chartData} options={options} chartType={chartType}
                                     id={'visualisation-'+ selectedChartIndex} />
            </Tab>
  			  </Tabs>
        : null}
    	</AccordionTab>
    )
  }
}
