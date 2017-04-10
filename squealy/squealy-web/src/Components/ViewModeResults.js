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
import {ErrorMessagePanel} from './ErrorMessageComponent'

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

  componentDidMount() {
    this.getInitialChart(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.getInitialChart(this.props)
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.payloadObj) !== JSON.stringify(this.state.payloadObj)) {
      let key
      if (prevState.payloadObj.hasOwnProperty('params')) {
        for (key in this.state.payloadObj.params) {
          if (this.state.payloadObj.params[key] && this.state.payloadObj.params[key] !== prevState.payloadObj.params[key]) {
            this.updateParamterizedFilterOpts(key)
            break
          }
        }
      }
    }
  }

  //To get initial data
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

    postApiRequest(DOMAIN_NAME + 'squealy/' + propsData.chart.url + '/', payloadObj,
      this.onSuccessTest, this.onErrorTest, null)
    
    this.setState({ payloadObj: payloadObj}, () => {
      this.updateUrl()
      //Get dropdown option data 
      parameters.map((param) => {
        if (param.data_type === 'dropdown' && !param.is_parameterized)  {
          getApiRequest(DOMAIN_NAME + 'filter/' + param.dropdown_api + '/', {format: 'json'},
              (response) => this.onSuccessFilterGet(response, {'name': param.name, 'url': param.dropdown_api}),
              this.onErrorTest, null)
        } else if (param.data_type === 'dropdown' && param.is_parameterized) {
          //Passing parameter values 
          finalPayloadObj = this.getPayloadObject(param.dropdown_api, payloadObj)
          finalPayloadObj['format'] = 'json'
          getApiRequest(DOMAIN_NAME + 'filter/' + param.dropdown_api + '/', finalPayloadObj,
              (response) => this.onSuccessFilterGet(response, {'name': param.name, 'url': param.dropdown_api}),
              this.onErrorTest, null)
        }
      })
    })
  }

  //Process the param data and create payload object for parameterized filter api
  getPayloadObject = (dropdownApi, filterDefaultValue) => {
    let i, selectedIndex,
      payloadObj = {params: {}},
      paramName
    const {filters} = this.props
    let filterParameter = []

    for (i = 0; i < filters.length; i++) {
      if (dropdownApi === filters[i].url) {
        selectedIndex = i
        break
      }
    }
    if (filters.length) {
      filterParameter = JSON.parse(JSON.stringify(filters[selectedIndex].parameters))
      filterParameter.map((obj) => {
        payloadObj.params[obj.name] = filterDefaultValue.params[obj.name]
      })
    }
    return payloadObj
  }

  //Function to refresh all the parameterized dropdown data if any filter is updated
  /**
   * FIXME: Does not work for more than 2 filter long chain
   * Issue: If more than 2 filters are chained, need response of first api to send it as api payload
   * */
  updateParamterizedFilterOpts = (updatedKey) => {
    const parameters = this.props.chart.parameters
    let finalPayloadObj = {}, flag = false, updatedKeyIndex = -1,
    updatedPayloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    parameters.map((param, i) => {
      //Do not make api request if it's the same key or not parameterized
      updatedKeyIndex = updatedKey === param.name ? i : updatedKeyIndex
      if (updatedKeyIndex !== -1 && updatedKeyIndex < i && param.data_type === 'dropdown' && param.is_parameterized) {
        flag = true
        finalPayloadObj = this.getPayloadObject(param.dropdown_api, updatedPayloadObj)
        finalPayloadObj['format'] = 'json'
        getApiRequest(DOMAIN_NAME + 'filter/' + param.dropdown_api + '/', finalPayloadObj,
            (response) => this.onSuccessFilterGet(response, {'name': param.name, 'url': param.dropdown_api}, true),
            this.onErrorTest, null)
      }
    })
    //If none param is parameterized, update the payload and chart data
    if (!flag) {
      this.updateUrl()
      postApiRequest(DOMAIN_NAME + 'squealy/' + this.props.chart.url + '/', this.state.payloadObj,
        this.onSuccessTest, this.onErrorTest, 'table')
    }
  }

  //Capture filter changes
  onChangeFilter = (key, val) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    payloadObj.params[key] = val
    this.setState({
      payloadObj: payloadObj
    }, () => {
      this.updateParamterizedFilterOpts(key)
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

  onSuccessTest = (response) => {
    this.setState({ chartData: response, errorMessage: null })
  }

  //Function to update the dropdown option data
  onSuccessFilterGet = (response, obj, shouldUpdateChart) => {
    let filterData = JSON.parse(JSON.stringify(this.state.filterData)), payloadObj = {}
    filterData[obj.name] = {
      dropdown_api: obj.url,
      data: formatForDropdown(response.data)
    }
    //Update the parameterized filter option data and chart data if any other filter value has changed
    if (shouldUpdateChart) {
      payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
      payloadObj.params[obj.name] = response.data[0][0]  
      this.setState({ payloadObj: payloadObj }, () => {
        this.updateUrl()
        postApiRequest(DOMAIN_NAME + 'squealy/' + this.props.chart.url + '/', payloadObj,
          this.onSuccessTest, this.onErrorTest, 'table')
      })
    }
    this.setState({filterData: filterData})
  }

  onErrorTest = (e) => {
    this.setState({ errorMessage: e.responseJSON.error })
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
                    <div className='filter-component' key={'filter_' + params.name}>
                      <label>{params.name}</label>
                      <FilterReference
                        className='view-mode-filter'
                        name={params.name}
                        format={params.kwargs.hasOwnProperty('format') ? params.kwargs.format : false}
                        filterData={this.state.filterData.hasOwnProperty(params.name) ? this.state.filterData[params.name]: {data: []}}
                        value={this.state.payloadObj.params[params.name] || params.default_value}
                        onChangeHandler={this.onChangeFilter}
                        />
                    </div>
                  )
                }
              })
            }

          </div>
          <div className='view-mode-visualchart'>
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
                  <ErrorMessagePanel
                    className='error-box'
                    errorMessage={this.state.errorMessage} /> : 
                  (googleDefined && this.state.chartData.hasOwnProperty('rows') ?
                  <GoogleChartsComponent
                    chartData={this.state.chartData}
                    options={chart.options}
                    chartType={this.state.payloadObj.params['chartType']}
                    id={'visualisation_' + chart.id} /> : null)
              }
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
    
  }
}
