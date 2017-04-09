import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import GoogleChartsComponent from './GoogleChartsComponent'
import { SquealyDropdown } from './SquealyUtilsComponents'
import { GOOGLE_CHART_TYPE_OPTIONS } from './../Constant'
import configIcon from './../images/settings_icon.png'
import ChartConfigModal from './ChartConfigModal'
import {ErrorMessagePanel} from './ErrorMessageComponent'

export default class ResultSection extends Component {

  constructor() {
    super()
    this.state = {
      showModal: false
    }
  }

  modalVisibilityHandler = () => {
    this.setState({showModal: !this.state.showModal})
  }

  onVisualizationMode = (key) => {
    //Make the API call if Visualisation tab is selected.
    if (key === 2) {
      this.props.onHandleVisualizationTab()
    }
  }

  render() {
    const {
      resultData,
      selectedChartIndex,
      googleDefined,
      options,
      viewType,
      selectedChartChangeHandler,
      errorMessage,
      chartMode
    } = this.props
    const resultSectionOnSuccess =
      (googleDefined && resultData && resultData.hasOwnProperty('rows')) ?
          <Tabs defaultActiveKey={1} id="uncontrolled_tab_example" onSelect={this.onVisualizationMode}>
            <Tab eventKey={1} title="Data">
              <GoogleChartsComponent chartData={resultData}
                options={{}} chartType='Table'
                id={'response_table_' + selectedChartIndex} />
            </Tab>
            {
              chartMode &&
                <Tab eventKey={2} title="Visualisation">
                  <div className="chart-type-select">
                    <SquealyDropdown
                      name='chartType'
                      options={GOOGLE_CHART_TYPE_OPTIONS}
                      selectedValue={viewType}
                      onChangeHandler={(value)=>selectedChartChangeHandler({type: value})}
                    />
                    <img src={configIcon} onClick={this.modalVisibilityHandler} />
                  </div>
                  <GoogleChartsComponent chartData={resultData} options={options} chartType={viewType}
                    id={'visualisation_' + selectedChartIndex} />
                </Tab>
            }
          </Tabs> : null
    return (
      <AccordionTab heading='Results'>
        {
          errorMessage ?
            <ErrorMessagePanel
              className='error-box'
              errorMessage={errorMessage} /> :
            resultSectionOnSuccess
        }
        <ChartConfigModal
          chartConfiguration={options}
          showModal={this.state.showModal}
          closeModal={this.modalVisibilityHandler}
          selectedChartChangeHandler={selectedChartChangeHandler}
        />
      </AccordionTab>
    )
  }
}
