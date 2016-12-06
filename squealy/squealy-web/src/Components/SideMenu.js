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

  updateKey = (e, currentKey, type) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    if (e.target.innerText !== currentKey) {
      if (apiParams[type].hasOwnProperty(e.target.innerText)) {
        console.error('Parameter key can not be repeated', apiParams[type])
      } else {
        if (apiParams && apiParams[type].hasOwnProperty(currentKey)) {
          apiParams[type][e.target.innerText] = apiParams[type][currentKey]
          delete apiParams[type][currentKey]
          this.props.onChangeTestData(apiParams)
        } else {
          console.error('Something went wrong! Not able to find key ', currentKey, ' in apiParams')
        }
      }
    }
  }

  updateValue = (e, currentKey, type) => {
    let apiParams = Object.assign({}, this.props.apiParams)

    if (apiParams.hasOwnProperty(type) && apiParams[type][currentKey] !== e.target.innerText) {
      if (apiParams[type].hasOwnProperty(currentKey)) {
        apiParams[type][currentKey] = e.target.innerText
        this.props.onChangeTestData(apiParams)
      } else {
        console.error('Something went wrong! Not able to find key ', currentKey, ' in apiParams')
      }
    }
  }

  addNewParam = (type) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    if (apiParams && !apiParams.hasOwnProperty(type)) {
      apiParams[type] = {}
      apiParams[type]['newKey'] = 'value'
    } else {
      apiParams[type]['newKey'] = 'value'
    }
    this.props.onChangeTestData(apiParams)
  }

  removeParam = (key, type) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    delete apiParams[type][key]
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
        <DatabaseDescription />
        <h2>Test API Parameters: </h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th onClick={() => this.addNewParam('params')}><i className="fa fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            {
              apiParams.hasOwnProperty('params') ?
                Object.keys(apiParams.params).map((key) => {
                  return (
                    <tr key={key}>
                      <td contentEditable={true} onBlur={(e) => this.updateKey(e, key, 'params')}>{key}</td>
                      <td contentEditable={true} onBlur={(e) => this.updateValue(e, key, 'params')}>{apiParams.params[key]}</td>
                      <td onClick={() => this.removeParam(key, 'params')}><i className="fa fa-trash"/></td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
        <h2>Test User Parameters: </h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th onClick={() => this.addNewParam('session')}><i className="fa fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            {
              apiParams.hasOwnProperty('session') ?
                Object.keys(apiParams.session).map((key) => {
                  return (
                    <tr key={key}>
                      <td contentEditable={true} onBlur={(e) => this.updateKey(e, key, 'session')}>{key}</td>
                      <td contentEditable={true} onBlur={(e) => this.updateValue(e, key, 'session')}>{apiParams.session[key]}</td>
                      <td onClick={() => this.removeParam(key, 'session')}><i className="fa fa-trash"/></td>
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
