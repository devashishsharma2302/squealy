import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import GoogleChartsComponent from './GoogleChartsComponent'
import { SquealyDropdown } from './SquealyUtilsComponents'
import { postApiRequest } from './../Utils'
import { DOMAIN_NAME } from './../Constant'
import {SquealyDatePicker, SquealyInput, SquealyDatetimePicker} from './Filters'

export default class ViewOnlyResults extends Component {

  constructor() {
    super()
    this.state = {
      payloadObj: {},
      chartData: {}
    }
  }


  getInitialChart = (propsData) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    propsData.chart.parameters.map((params) => {
      payloadObj[params.name] = params.default_value
    })
    postApiRequest(DOMAIN_NAME+'squealy/'+ propsData.chart.url+'/', {params: payloadObj},
        this.onSuccessTest, this.onErrorTest, 'table')
    this.setState({payloadObj: payloadObj})
  }


  componentDidMount() {
    this.getInitialChart(this.props)
  }


  componentWillReceiveProps(nextprops) {
    this.getInitialChart(nextprops)
  }

  onSuccessTest = (response) => {
    this.setState({chartData: response})
  }

  onErrorTest = (e) => {
    console.log('error', e)
  }


  onChangeFilter = (key, val) => {
    let payloadObj = JSON.parse(JSON.stringify(this.state.payloadObj))
    payloadObj[key] = val
    this.setState({payloadObj: payloadObj}, () => {
      postApiRequest(DOMAIN_NAME+'squealy/'+ this.props.chart.url+'/', {params: payloadObj},
        this.onSuccessTest, this.onErrorTest, 'table')
    })
  }

  render() {
    const {
      chart,
      googleDefined
    } = this.props
    const filterType = {
      string: SquealyInput,
      date: SquealyDatePicker,
      datetime: SquealyDatetimePicker
    }
    
    return (
      <div>
        <div className="view-filter">
        {
          chart.parameters.map((params) => {
            const FilterReference = filterType[params.data_type]
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
          })
        }
        </div>
        <div className="visualchart">
          {
            googleDefined && this.state.chartData.hasOwnProperty('rows') ?
              <GoogleChartsComponent
                chartData={this.state.chartData}
                options={chart.options}
                chartType={chart.type}
                id={'visualisation_' + chart.id} />
              : null
          }
        </div>
      </div>
    )
  }
}
