import React, {Component, PropTypes} from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';

import Transformations from './Transformations'
import DatabaseDescription from './DatabaseDescription'

export default class SideMenu extends Component {

  static propTypes = {
    apiParams: PropTypes.object.isRequired,
    onChangeTestData: PropTypes.func.isRequired
  }

  updateKey = (e, currentKey) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    if (e.target.innerText !== currentKey) {
      if (apiParams.params.hasOwnProperty(e.target.innerText)) {
        console.error('Parameter key can not be repeated', apiParams.params)
      } else {
        if (apiParams && apiParams.params.hasOwnProperty(currentKey)) {
          apiParams.params[e.target.innerText] = apiParams.params[currentKey]
          delete apiParams.params[currentKey]
          this.props.onChangeTestData(apiParams)
        } else {
          console.error('Something went wrong! Not able to find key ', currentKey, ' in apiParams')
        }
      }
    }
  }

  updateValue = (e, currentKey) => {
    let apiParams = Object.assign({}, this.props.apiParams)

    if (apiParams.params[currentKey] !== e.target.innerText) {
      if (apiParams && apiParams.params.hasOwnProperty(currentKey)) {
        apiParams.params[currentKey] = e.target.innerText
        this.props.onChangeTestData(apiParams)
      } else {
        console.error('Something went wrong! Not able to find key ', currentKey, ' in apiParams')
      }
    }
  }

  addNewParam = () => {
    let apiParams = Object.assign({}, this.props.apiParams)
    if (apiParams && !apiParams.hasOwnProperty('params')) {
      apiParams.params = {}
      apiParams.params['newKey'] = 'value'
    } else {
      apiParams.params['newKey'] = 'value'
    }
    this.props.onChangeTestData(apiParams)
  }

  removeParam = (key) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    delete apiParams.params[key]
    this.props.onChangeTestData(apiParams)
  }

  render () {
    const {
      apiParams,
      onChangeTestData,
      onChangeApiDefinition
    } = this.props

    return(
      <div className="parameters-value-wrapper">
        <h2>Test Parameter Values: </h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th onClick={this.addNewParam}><i className="fa fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            {
              apiParams.hasOwnProperty('params') ?
                Object.keys(apiParams.params).map((key) => {
                  return (
                    <tr key={key}>
                      <td contentEditable={true} onBlur={(e) => this.updateKey(e, key)}>{key}</td>
                      <td contentEditable={true} onBlur={(e) => this.updateValue(e, key)}>{apiParams.params[key]}</td>
                      <td onClick={() => this.removeParam(key)}><i className="fa fa-trash"/></td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
      </div>
    )
  }
}
