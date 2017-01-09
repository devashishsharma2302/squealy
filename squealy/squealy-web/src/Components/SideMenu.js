import React, {Component, PropTypes} from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';

import Transformations from './Transformations'
import DatabaseDescription from './DatabaseDescription'

export default class SideMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authentication_classes:[],
      permission_classes: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedAPIDefinition.permission_classes!=this.props.permission_classes || nextProps.selectedAPIDefinition.authentication_classes!=this.props.authentication_classes) {
      this.setState({authentication_classes: nextProps.selectedAPIDefinition.authentication_classes,
        permission_classes: nextProps.selectedAPIDefinition.permission_classes
      })
    }
  }

  updateApiAccess = (type, key, value) => {
    let stateCopy = this.state[type].slice()
    stateCopy[key] = value
    this.setState({[type] :stateCopy})
  }

  static propTypes = {
    apiParams: PropTypes.object.isRequired,
    onChangeTestData: PropTypes.func.isRequired
  }

  updateKey = (e, currentKey, type) => {
    let apiParams = Object.assign({}, this.props.apiParams)
    if (e.target.value !== currentKey) {
      if (apiParams[type].hasOwnProperty(e.target.value)) {
        console.error('Parameter key can not be repeated', apiParams[type])
      } else {
        if (apiParams && apiParams[type].hasOwnProperty(currentKey)) {
          apiParams[type][e.target.value] = apiParams[type][currentKey]
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

    if (apiParams.hasOwnProperty(type) && apiParams[type][currentKey] !== e.target.value) {
      if (apiParams[type].hasOwnProperty(currentKey)) {
        apiParams[type][currentKey] = e.target.value
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
    }
    apiParams[type][''] = ''
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
      setApiAccess,
      dbUpdationHandler,
      selectedAPIDefinition
    } = this.props
    return(
      <div className="parameters-value-wrapper">
        <DatabaseDescription dbUpdationHandler={dbUpdationHandler}/>
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
                      <td> <input defaultValue={key} onBlur={(e) => this.updateKey(e, key, 'params')} placeholder='Enter Key' /></td>
                      <td> <input defaultValue={apiParams.params[key]} onBlur={(e) => this.updateValue(e, key, 'params')} placeholder="Enter Value" /></td>
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
                      <td> <input defaultValue={key} onBlur={(e) => this.updateKey(e, key, 'session')} placeholder='Enter Key' /></td>
                      <td> <input defaultValue={apiParams.session[key]} onBlur={(e) => this.updateValue(e, key, 'session')} placeholder='Enter Value' /> </td>
                      <td onClick={() => this.removeParam(key, 'session')}><i className="fa fa-trash"/></td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
        <h2>Add Permission Classes: </h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>DRF Permission Class Name</th>
              <th onClick={() => setApiAccess(null,'','permission_classes','add')}><i className="fa fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.hasOwnProperty('permission_classes') ?
                this.state.permission_classes.map((value, key) => {
                  return (
                    <tr key={key}>
                      <td> <input value={value} onChange={(e)=>{this.updateApiAccess('permission_classes',key,e.target.value)}} onBlur={() => setApiAccess(key, this.state.permission_classes[key], 'permission_classes', 'update')} placeholder='Enter Class Name' /> </td>
                      <td onClick={() => setApiAccess(key, '', 'permission_classes', 'del')}><i className="fa fa-trash"/></td>
                    </tr>
                  )
                })
                : null
            }
          </tbody>
        </table>
        <h2>Add Authentication Classes: </h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>DRF Auth Class Name</th>
              <th onClick={() => setApiAccess(null, '', 'authentication_classes', 'add')}><i className="fa fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            { this.state.authentication_classes?
                this.state.authentication_classes.map((value, key) => {
                  return (
                    <tr key={key}>
                      <td> <input value={value} onChange={(e)=>{this.updateApiAccess('authentication_classes',key,e.target.value)}} onBlur={() => setApiAccess(key, this.state.authentication_classes[key], 'authentication_classes', 'update')} placeholder='Enter Class Name' /> </td>
                      <td onClick={() => setApiAccess(key, '', 'authentication_classes', 'del')}><i className="fa fa-trash"/></td>
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
