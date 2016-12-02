import React, {Component} from 'react'

export default class ApiUrlInputBox extends Component {
  constructor(props) {
    super(props)
    this.state= {
      apiUrl: '',
      paramName: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    let selectedAPI = this.props.apiDefinition[this.props.selectedApiIndex]
    let nextSelectedAPI = nextProps.apiDefinition[nextProps.selectedApiIndex]
    let apiUrl 
    if (selectedAPI.urlName === '') {
      apiUrl = nextSelectedAPI.apiName.replace(/\s+/g, '-').toLowerCase()
    }
    else {
      apiUrl = nextSelectedAPI.urlName
    }
    let paramNameArray = []
    let paramDefinition = selectedAPI.paramDefinition
    for (let param in paramDefinition) {
      paramNameArray.push(paramDefinition[param].name) 
    }
    this.setState({apiUrl: apiUrl, paramName: paramNameArray.toString().replace(/,/g,'=someValue&')})
  }

  handleApiUrlOnBlur = () => {
    this.props.onChangeApiDefinition('urlName', this.state.apiUrl)
  }

  handleUrlChange = (event) => {
    this.setState({apiUrl: event.target.value})
  }

  render() {

    return (<div className="api-url">
        <h2>URL: </h2>
        <div className="input-group api-url-group">
          <span className="input-group-addon">/</span>
          <input type="text" onBlur={this.handleApiUrlOnBlur} onChange={this.handleUrlChange} value={this.state.apiUrl} className="form-control" />
          <span className="input-group-addon">{'/?'+this.state.paramName}</span>
        </div>
      </div>)
  }
}
