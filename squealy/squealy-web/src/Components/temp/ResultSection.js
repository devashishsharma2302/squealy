import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import mockResponse from './mockResponse'
import GoogleChartsComponent from './GoogleChartsComponent'

export default class ResultSection extends Component {

  render() {
    const { chartData, selectedChartIndex, googleDefined, options, chartType } = this.props
    return (
      <AccordionTab heading='Results'>
        {(googleDefined && (chartData !== {})) ?
          <Tabs defaultActiveKey={1} id="uncontrolled_tab_example">
            <Tab eventKey={1} title="Data">
              <GoogleChartsComponent chartData={chartData}
                options={{}} chartType='Table'
                id={'response_table_' + selectedChartIndex} />
            </Tab>
            <Tab eventKey={2} title="Visualisation">
              <GoogleChartsComponent chartData={chartData} options={options} chartType={chartType}
                id={'visualisation_' + selectedChartIndex} />
            </Tab>
          </Tabs>
          : null}
      </AccordionTab>
    )
  }
}
