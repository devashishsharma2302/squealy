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

  render() {
    const {
      resultData,
      selectedChartIndex,
      googleDefined,
      options,
      viewType,
      selectedChartChangeHandler,
      errorMessage,
      chartMode,
      onResultTabChanged
    } = this.props

    const resultSectionOnSuccess =
      (googleDefined && resultData && resultData.hasOwnProperty('rows')) ?
            <Tabs defaultActiveKey={1} id="uncontrolled_tab_example" onSelect={(key) => onResultTabChanged(key)}>
              <Tab eventKey={1} title="Data">
                {errorMessage ?
                  <ErrorMessagePanel
                    className='error-box'
                    errorMessage={errorMessage} /> 
                :
                <GoogleChartsComponent chartData={resultData}
                    options={{}} chartType='Table'
                    id={'response_table_' + selectedChartIndex} />
                }
              </Tab>
              {
                chartMode &&
                <Tab eventKey={2} title="Visualisation">
                    <div className="chart-type-select">
                      <SquealyDropdown
                        name='chartType'
                        options={GOOGLE_CHART_TYPE_OPTIONS}
                        selectedValue={viewType}
                        onChangeHandler={(value)=>selectedChartChangeHandler({type: value}, () => this.props.onResultTabChanged(2))}
                      />
                      <img src={configIcon} onClick={this.modalVisibilityHandler} />
                    </div>
                    {errorMessage ?
                    <ErrorMessagePanel
                      className='error-box'
                      errorMessage={errorMessage} /> 
                    :
                    <GoogleChartsComponent chartData={resultData} options={options} chartType={viewType}
                      id={'visualisation_' + selectedChartIndex} />
                    }
                </Tab>
            }
          </Tabs> : null
    return (
      <AccordionTab heading='Results'>
        {
            resultSectionOnSuccess
            ||<div>
              {(errorMessage)?
               <ErrorMessagePanel 
                  className='error-box'
                  errorMessage={errorMessage} />: null}
                </div>
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
