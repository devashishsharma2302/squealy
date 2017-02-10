import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import {Tab, Tabs} from 'react-bootstrap'
import ResponseTable from './ResponseTable'
import mockResponse from './mockResponse'


export default class ResultSection extends Component {
  render() {
    return (
    	<AccordionTab heading='Results'>
			  <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
			    <Tab eventKey={1} title="Data"> <ResponseTable response={mockResponse} /> </Tab>
			    <Tab eventKey={2} title="Visualisation">Visualisation</Tab>
			  </Tabs>
    	</AccordionTab>
    )
  }
}
