import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import GoogleChartsComponent from './GoogleChartsComponent'
import { SquealyDropdown } from './SquealyUtilsComponents'
import {
  postApiRequest,
  formatTestParameters,
  getUrlParams,
  setUrlParams,
  getApiRequest,
  formatForDropdown
} from './../Utils'
import { DOMAIN_NAME, GOOGLE_CHART_TYPE_OPTIONS } from './../Constant'
import { SquealyDatePicker, SquealyInput, SquealyDatetimePicker, SquealyDropdownFilter } from './Filters'

export default class ViewOnlyResults extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payloadObj: {},
      chartData: {},
      errorMessage: null,
      filterData: {}
    }
  }


  getInitialChart = (propsData) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj)),
      urlParams = getUrlParams(), finalPayloadObj = {}
    const parameters = propsData.chart.parameters

    payloadObj = formatTestParameters(parameters, 'name', 'default_value')
    
    if (payloadObj.hasOwnProperty('params') && payloadObj.params) {
      payloadObj.params.chartType = propsData.chart.type
    }
    
    if (urlParams) {
      Object.keys(urlParams).map((key) => {
        payloadObj.params[key] = urlParams[key]
      })
    }

    parameters.map((param) => {
      if (param.data_type === 'dropdown')  {
        getApiRequest(DOMAIN_NAME + 'filter/' + param.dropdown_api + '/', {payload: {format: 'json'}},
            (response) => this.onSuccessFilterGet(response, {'name': param.name, 'url': param.dropdown_api}),
            this.onErrorTest, null)
      }
    })

    postApiRequest(DOMAIN_NAME + 'squealy/' + propsData.chart.url + '/', payloadObj,
      this.onSuccessTest, this.onErrorTest, null)

    this.setState({ payloadObj: payloadObj}, this.updateUrl)
  }


  componentDidMount() {
    this.getInitialChart(this.props)
  }

  onSuccessTest = (response) => {
    this.setState({ chartData: response, errorMessage: null })
  }

  onSuccessFilterGet = (response, obj) => {
    let filterData = JSON.parse(JSON.stringify(this.state.filterData))
    filterData[obj.name] = {
      dropdown_api: obj.url,
      data: formatForDropdown(response.data)
    }
    this.setState({filterData: filterData})
  }

  onErrorTest = (e) => {
    this.setState({ errorMessage: e.responseJSON.error })
  }

  onChangeFilter = (key, val) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    payloadObj.params[key] = val
    this.setState({ payloadObj: payloadObj }, () => {
      this.updateUrl()
      postApiRequest(DOMAIN_NAME + 'squealy/' + this.props.chart.url + '/', payloadObj,
        this.onSuccessTest, this.onErrorTest, 'table')
    })
  }

  updateUrl = () => {
    const { payloadObj } = this.state
    setUrlParams(payloadObj.params)
  }

  //Update the type of chart selected
  updateChartType = (value) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    payloadObj.params['chartType'] = value
    this.setState({
      payloadObj: payloadObj }, this.updateUrl)
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
      datetime: SquealyDatetimePicker,
      dropdown: SquealyDropdownFilter
    }
    if (this.state.payloadObj.hasOwnProperty('params')) {
      return (
        <div>
          <div className="view-filter">
            {
              chart.parameters.map((params) => {
                if (params.type === 1) {
                  const FilterReference = filterType[params.data_type] || SquealyInput
                  return (
                    <div className='col-md-6' key={'filter_' + params.name}>
                      <label>{params.name}</label>
                      <FilterReference
                        className='view-mode-filter'
                        name={params.name}
                        format={params.kwargs.hasOwnProperty('format') ? params.kwargs.format : false}
                        filterData={this.state.filterData.hasOwnProperty(params.name) ? this.state.filterData[params.name]: {data: []}}
                        value={this.state.payloadObj.params[params.name] ||params.default_value}
                        onChangeHandler={this.onChangeFilter}
                        />
                    </div>
                  )
                }
              })
            }

          </div>
          <div className="chart-type-select">
            {this.state.payloadObj.params &&
              <SquealyDropdown
                name='chartType'
                options={GOOGLE_CHART_TYPE_OPTIONS}
                selectedValue={this.state.payloadObj.params['chartType']}
                onChangeHandler={(value) => this.updateChartType(value)} />
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
                    chartType={this.state.payloadObj.params['chartType']}
                    id={'visualisation_' + chart.id} />
                  : null)
            }
          </div>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
    
  }
}
