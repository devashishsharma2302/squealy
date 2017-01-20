import React, {Component} from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import Select from 'react-select'

import { COLUMN_TYPE, PARAM_FORMAT_OPTIONS } from '../Constant'

export default class ApiParams extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDataType: 'string',
      selectedColumnType: 'dimension',
      showModal: false,
      accordionHeaderIcon: 'fa-caret-right'
    }
  }

  // Sets the class of header icon
  handleAccordionFadeIn = () => {
    this.setState({accordionHeaderIcon: 'fa-caret-down'})
  }

  // Sets the class of header icon
  handleAccordionFadeOut = () => {
    this.setState({
      accordionHeaderIcon: 'fa-caret-right'
    })
  }

  // Sets the value of column's data type (String or Number)
  selectedColumnDataTypeChangeHandler = (selectedClmDataType) => {
    this.setState({selectedClmDataType: selectedClmDataType.value})
  }

  // Sets the value of column's data type (Dimension or Metric)
  selectedColumnTypeChangeHandler = (selectedColumnType) => {
    this.setState({selectedColumnType: selectedColumnType.value})
  }

  render () {

    const AccordionHeader = (
      <div className='accordion-header'>
        <div>
          <h2 className="param-heading">Column Definitions: </h2>
            <i className={'fa fa-2x param-heading-icon ' + this.state.accordionHeaderIcon}>
            </i>
          </div>
        </div>
      )
    return (
      <div className="column-definition-section">
        <Accordion>
          <Panel 
            bsClass="param-def-panel"
            onEnter={this.handleAccordionFadeIn}
            onExit={this.handleAccordionFadeOut}
            header={AccordionHeader}
            eventKey="1"
          >
            <div id="column_definition_wrapper">
              <div className="column-definition">
                <label>Column Name:</label>
                <input type="text" placeholder="Enter the column name"/>
              </div>
              <div className="column-definition">
                <label>Column Type:</label>
                <Select
                  name="col-type"
                  options={COLUMN_TYPE}
                  value={this.state.selectedColumnType}
                  placeholder='Select Column Type'
                  clearableValue={false}
                  onChange={this.selectedColumnTypeChangeHandler}
                  className="asdas"
                />
              </div>
              <div className="column-definition">
                <label>Date Type:</label>
                <Select
                  name="col-type"
                  options={PARAM_FORMAT_OPTIONS}
                  value={this.state.selectedDataType}
                  placeholder='Select Column Type'
                  clearableValue={false}
                  onChange={this.selectedColumnDataTypeChangeHandler}
                />
              </div>
            </div>
         </Panel>
        </Accordion>
      </div>
    )
  }
}
