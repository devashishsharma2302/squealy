import React, { Component} from 'react'
import { SquealyModal, SquealyDropdown } from './SquealyUtilsComponents'

export default class TestParametersModal extends Component {
  constructor(props) {
    super(props)
  }

  addTestParam = () => {
    let currentTestParams = Object.assign({}, this.props.testParameters)
    currentTestParams[''] = ''
    this.props.selectedChartChangeHandler('testParameters', currentTestParams)
  }

  updateTestParametersKey = (event, key) => {
    let currentTestParams = Object.assign({}, this.props.testParameters)
    if (key !== event.target.value) {
      if (currentTestParams.hasOwnProperty(event.target.value)) {
        console.error('Parameter key can not be repeated', currentTestParams)
      } else {
        if (currentTestParams.hasOwnProperty(key)) {
          currentTestParams[event.target.value] = currentTestParams[key]
          delete currentTestParams[key]
          this.props.selectedChartChangeHandler('testParameters', currentTestParams)
        } else {
          console.error('Something went wrong! Not able to find key ', key, ' in testParameters')
        }
      }
    }
  }

  updateTestParametersValue = (event, key) => {
    let currentTestParams = Object.assign({}, this.props.testParameters)

    if (currentTestParams[key] !== event.target.value) {
      if (currentTestParams.hasOwnProperty(key)) {
        currentTestParams[key] = event.target.value
        this.props.selectedChartChangeHandler('testParameters', currentTestParams)
      } else {
        console.error('Something went wrong! Not able to find key ', key, ' in testParameters')
      }
    }
  }

  removeTestParameters = (key) => {
    let currentTestParams = Object.assign({}, this.props.testParameters)
    delete currentTestParams[key]
    this.props.selectedChartChangeHandler('testParameters', currentTestParams)
  }

  render () {
    const {testParameters, selectedChartChangeHandler} = this.props
    const testParametersHTML = 
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Parameters</th>
            <th>Value</th>
            <th onClick={this.addTestParam}>
              <i className="fa fa-plus"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(testParameters).map((key) => {
              return (
                <tr key={key}>
                  <td>
                    <input defaultValue={key} onBlur={(e) => this.updateTestParametersKey(e, key)}
                      placeholder='Enter Key' />
                  </td>
                  <td>
                    <input defaultValue={testParameters[key]} placeholder='Enter Value'
                      onBlur={(e) => this.updateTestParametersValue(e, key)} />
                  </td>
                  <td onClick={() => this.removeTestParameters(key)}>
                    <i className="fa fa-trash"/>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='addTestParametersModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Test Parameters'
        modalContent={testParametersHTML} />
    )
  }
  
}