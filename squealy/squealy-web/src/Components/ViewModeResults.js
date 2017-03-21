import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import GoogleChartsComponent from './GoogleChartsComponent'
import { SquealyDropdown } from './SquealyUtilsComponents'
import {
  postApiRequest,
  formatTestParameters,
  getUrlParams,
  setUrlParams
} from './../Utils'
import { DOMAIN_NAME } from './../Constant'
import {SquealyDatePicker, SquealyInput, SquealyDatetimePicker} from './Filters'

export default class ViewOnlyResults extends Component {

  constructor() {
    super()
    this.state = {
      payloadObj: {},
      chartData: {},
      errorMessage: null
    }
  }


  getInitialChart = (propsData) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))

    if (getUrlParams && getUrlParams.constructor === Object) {
      payloadObj = {params: getUrlParams()}
    } else {
      payloadObj = formatTestParameters(propsData.chart.parameters, 'name', 'default_value')
    }
    postApiRequest(DOMAIN_NAME+'squealy/'+ propsData.chart.url+'/', payloadObj,
        this.onSuccessTest, this.onErrorTest, 'table')
    this.setState({payloadObj: payloadObj}, this.updateUrl)
  }


  componentDidMount() {
    this.getInitialChart(this.props)
  }

  onSuccessTest = (response) => {
    this.setState({chartData: response, errorMessage: null})
  }

  onErrorTest = (e) => {
    this.setState({errorMessage: e.responseJSON.error})
  }


  onChangeFilter = (key, val) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    payloadObj.params[key] = val
    this.setState({payloadObj: payloadObj}, () => {
      this.updateUrl()
      postApiRequest(DOMAIN_NAME+'squealy/'+ this.props.chart.url+'/', payloadObj,
        this.onSuccessTest, this.onErrorTest, 'table')
    })
  }

  updateUrl = () => {
    const { payloadObj } = this.state
    setUrlParams(payloadObj.params)
  }

  render() {
    const {
      chart,
      googleDefined
    } = this.props
    const filterType = {
      string: SquealyInput,
      number: SquealyInput,
      date: SquealyDatePicker,
      datetime: SquealyDatetimePicker
    }
    return (
      <div>
        <div className="view-filter">
        {
          chart.parameters.map((params) => {
            if (params.type === 1) {
              const FilterReference = filterType[params.data_type] || SquealyInput
              return (
                <div className='col-md-6' key={'filter_'+params.name}>
                  <label>{params.name}</label>
                  <FilterReference
                    className='view-mode-filter'
                    name={params.name}
                    format={params.kwargs.hasOwnProperty('format') ? params.kwargs.format : false}
                    value={params.default_value}
                    onChangeHandler={this.onChangeFilter}
                  />
                </div>
              )
            }
          })
        }
        </div>
        <div className="visualchart">
          {
            this.state.errorMessage ?
            <div className='error-box'><span>{this.state.errorMessage}</span></div>
            : (googleDefined && this.state.chartData.hasOwnProperty('rows') ?
              <GoogleChartsComponent
                chartData={this.state.chartData}
                options={chart.options}
                chartType={chart.type}
                id={'visualisation_' + chart.id} />
              : null)
          }
        </div>
      </div>
    )
  }
}
