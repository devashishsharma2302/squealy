import React, {Component} from 'react'
import ApiTabs from '../Components/ApiTabs'
import NavHeader from '../Components/NavHeader'
import {
  SIDE_BAR_WIDTH,
  YAML_CONTENT_TYPE,
  RESPONSE_FORMATS
} from '../Constant'
import {
  postApiRequest,
  getApiRequest,
  objectToYaml,
  saveBlobToFile,
  saveYamlOnServer,
  getEmptyApiDefinition,
  exportFile,
  getDefaultApiDefinition,
  parseObjectAsYamlConfig,
  getEmptyTestData,
  setDataInLocalStorage,
  getDataFromLocalStorage,
} from '../Utils'


//API URL host name. For testing only. later user will define this in setup configuration.
export const apiUriHostName = 'http://localhost:8000'

export default class ApiViewContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiDefinition: [],
      testData: [],
      selectedApiIndex: 0,
      openAPIs: []
    }
  }

  initializeStates = () => {
    if (!this.state.apiDefinition.length) {
      let tempApiDef = [getEmptyApiDefinition()]
      let testData = [getEmptyTestData()]
      this.setState({apiDefinition: tempApiDef,testData: testData})
    }

    if (this.state.apiDefinition.length) {
      let tempTestData = []
      this.state.apiDefinition.map(()=>{
        tempTestData.push(getEmptyTestData())
      })
      this.setState({testData: tempTestData})
    }

    if (!this.state.openAPIs.length) {
      this.setState({openAPIs: [0]})
    }
    this.setState({selectedApiIndex: this.state.selectedApiIndex || 0})
  }

  componentWillMount() {
    let url = apiUriHostName + '/yaml-generator/'
    getApiRequest(url, null, this.loadInitialApis, ()=>{}, null)
  }

  loadInitialApis = (response) => {
    if (response) {
      let testData = []
      response.forEach(()=>{testData.push(getEmptyTestData())})
      this.setState({testData: testData})

      let apiDefinition = []

      response.map((data)=>{
        let apiObj = {
          apiName: data.name,
          open: true,
          columns: data.columns,
          format: data.format,
          paramDefinition: data.parameters,
          sqlQuery: data.query,
          permission_classes: data.permission_classes,
          authentication_classes: data.authentication_classes,
          transformations: data.transformations,
          selectedTransformations: data.selectedTransformations,
          validations: data.validations,
          urlName: data.url
        }
        apiDefinition.push(apiObj)
      })
      this.setState({apiDefinition:apiDefinition, selectedApiIndex:response.length-1})
    }
    else {
      this.initializeStates()
    }
  }

  setApiAccess = (key, value, classType, action) => {
    let apiDefinition = this.state.apiDefinition.slice()
    if(action==='add') {
      apiDefinition[this.state.selectedApiIndex][classType].push(value)
    } else if(action==='del') {
      apiDefinition[this.state.selectedApiIndex][classType].splice(key,1)
    } else if (action==='update') {
      apiDefinition[this.state.selectedApiIndex][classType][key] = value
    }
    this.setState({apiDefinition: apiDefinition})
  }

  onChangeApiDefinition = (variableName, value) => {
    let tempAPIDef = this.state.apiDefinition.slice()
    tempAPIDef[this.state.selectedApiIndex][variableName] = value
    this.setState({apiDefinition: tempAPIDef})
  }

  apiTabRenameHandler = (value, index) => {
    let apiDefinition = this.state.apiDefinition.slice()
    apiDefinition[index]['apiName'] = value
    if (apiDefinition[index]['urlName'] === '') {
      apiDefinition[index]['urlName'] = value.replace(/\s+/g, '-').toLowerCase()
    }
    this.setState({apiDefinition: apiDefinition})
  }

  onChangeTestData = (value) => {
    let tempTestData = this.state.testData.slice()
    tempTestData[this.state.selectedApiIndex].apiParams = value
    this.setState({testData: tempTestData})
  }

  apiCloseHandler = (index) => {
    let apiDefinition = this.state.apiDefinition.slice(),
      newOpenAPIs = this.state.openAPIs.slice()
    apiDefinition[index].open = false
    let openAPIsIndex = newOpenAPIs.indexOf(index)
    newOpenAPIs.splice(openAPIsIndex, 1)
    let selectedApiIndex

    if (newOpenAPIs.length) {
      selectedApiIndex = openAPIsIndex ? newOpenAPIs[openAPIsIndex - 1] : 0
    } else {
      selectedApiIndex = 0
    }

    this.setState({apiDefinition: apiDefinition, selectedApiIndex: selectedApiIndex, openAPIs: newOpenAPIs})
  }

  apiOpenHandler = (index) => {
    let apiDefinition = this.state.apiDefinition.slice(),
      newOpenAPIs = this.state.openAPIs.slice()
    newOpenAPIs.push(index)
    apiDefinition[index].open = true
    let selectedApiIndex = index
    this.setState({apiDefinition: apiDefinition, selectedApiIndex: selectedApiIndex, openAPIs: newOpenAPIs})
  }

  apiParamToggleHandler = () => {
    let newUiPreferences = Object.assign({}, this.state.uiPreferences)
    newUiPreferences.apiParamsVisible = !this.state.uiPreferences.apiParamsVisible
    this.setState({uiPreferences: newUiPreferences})
  }

  onSuccessTest = (response, format) => {
    let newTestData = this.state.testData.slice()
    let newAPIdef = this.state.apiDefinition.slice()
    let onSuccessTestData =  {
      apiResponse: response,
      apiSuccess: true,
      apiError: false,
      apiParams: newTestData[this.state.selectedApiIndex].apiParams,
      selectedFormat: format
    }
    newTestData[this.state.selectedApiIndex] = Object.assign(newTestData[this.state.selectedApiIndex], onSuccessTestData)
    if(format === RESPONSE_FORMATS.table.formatter){
      response.columns.map((column) => {
        newAPIdef[this.state.selectedApiIndex]['columns'][column.name] = {
          type: column.col_type || 'dimension',
          data_type: column.data_type || 'string'
        }
      })
    }
    this.setState({testData: newTestData, apiDefinition: newAPIdef},()=>{
      this.onChangeApiDefinition('format', format)
    })
  }

  onErrorTest = (error) => {
    let tempTestData = this.state.testData.slice()
    let onErrorTestData = {
      apiResponse: JSON.parse(error.responseText),
      apiSuccess: false,
      apiError: true,
      apiParams: tempTestData[this.state.selectedApiIndex].apiParams,
      selectedFormat: tempTestData[this.state.selectedApiIndex].selectedFormat
    }
    tempTestData[this.state.selectedApiIndex] = Object.assign(tempTestData[this.state.selectedApiIndex], onErrorTestData)
    this.setState({testData: tempTestData})
  }

  exportConfigAsYaml = () => {
    let apiDefinition =this.state.apiDefinition.slice()
    let fileName = 'hidash-api'
    let yamlData = exportFile(apiDefinition, YAML_CONTENT_TYPE)
    saveBlobToFile(yamlData, fileName+'.yaml')
  }

  processParamDef = (definitions) => {
    let appliedDef = {}
    if (definitions.length) {
      definitions.map((data) => {
        appliedDef[data.name] = {
          type: data.type,
          optional: data.optional,
          default_values: data.default_values,
          isParamDefCustom: data.isParamDefCustom
        }
        if (data.hasOwnProperty('kwargs')) {
          appliedDef[data.name].kwargs = data.kwargs
        }
      })
    }
    return appliedDef
  }

  onHandleTestButton = (event, format=null) => {
    let tempParam = this.state.testData[this.state.selectedApiIndex].apiParams || {}
    let paramObj = {}
    try {
      paramObj = typeof tempParam === 'string' ? JSON.parse(tempParam) : tempParam
    } catch (e) {
      console.log(e)
      console.log('please check your object syntax. Object key and value should be wrapped up in double quotes. Expected input: {"objKey": "objVal"}')
    }
    let paramDef = this.processParamDef(this.state.apiDefinition[this.state.selectedApiIndex].paramDefinition)
    format = format || 'table'
    let payloadObj = {
      config: {
        query: this.state.apiDefinition[this.state.selectedApiIndex].sqlQuery
      },
      transformations: this.state.apiDefinition[this.state.selectedApiIndex].transformations,
      format: format,
      params: paramObj.params,
      parameters: paramDef,
      user: paramObj.session,
      validations: this.state.apiDefinition[this.state.selectedApiIndex].validations,
      columns: this.state.apiDefinition[this.state.selectedApiIndex].columns,
      connection: this.state.selectedDB
    }
    postApiRequest(apiUriHostName+'/test/', payloadObj,
                   this.onSuccessTest, this.onErrorTest, format)
  }

  //Removes the API definition from the curret API list
  apiDeletionHandler = (index) => {
    if(this.state.apiDefinition.length > 1) {
      let newApiDefinitions = this.state.apiDefinition.slice(),
          newTestData = this.state.testData.slice(),
          newOpenAPIs = this.state.openAPIs.slice()
      newApiDefinitions.splice(index, 1)
      newTestData.splice(index, 1)

      let openAPIsIndex = newOpenAPIs.indexOf(index),
          newSelectedApiIndex = -1
      newOpenAPIs.splice(openAPIsIndex, 1)

      if (newOpenAPIs.length) {
        newSelectedApiIndex = openAPIsIndex ? newOpenAPIs[openAPIsIndex - 1] : 0
      } else {
        newSelectedApiIndex = 0
      }

      //Decrement the selectedApiIndex only if the selectedIndex is not zero
      let selectedApiIndex = this.state.selectedApiIndex
      selectedApiIndex = selectedApiIndex===0 ? 0 : newSelectedApiIndex

      let untitledApiIndex = 0
      newApiDefinitions.map((api) => {
        if(api.apiName.includes('Untitled API')) {
          api.apiName = 'Untitled API '+ (untitledApiIndex++)
          api.urlName = api.apiName.replace(/\s+/g, '-').toLowerCase()
        }
      })

      this.setState({
        apiDefinition: newApiDefinitions,
        testData: newTestData,
        selectedApiIndex: selectedApiIndex,
        newOpenAPIs: newOpenAPIs
      })

    } else {
      let tempApiDef = [],
          tempTestData = [],
          tempOpenApis = []
      this.setState({apiDefinition: tempApiDef, testData: tempTestData, openAPIs: tempOpenApis})
    }
  }

  //Appends an empty API definition object to current API Definitions
  apiAdditionHandler = () => {
    let newApiDefinitions = this.state.apiDefinition.slice(),
      newTestData = this.state.testData.slice(),
      selectedApiIndex = newApiDefinitions.length,
      newOpenAPIs = this.state.openAPIs.slice()
    newApiDefinitions.push(getDefaultApiDefinition(newApiDefinitions.length))
    newTestData.push(getEmptyTestData())
    newOpenAPIs.push(selectedApiIndex)
    this.setState({
      apiDefinition: newApiDefinitions,
      testData: newTestData,
      selectedApiIndex: selectedApiIndex,
      openAPIs: newOpenAPIs
    })
  }

  //Changes the selected API index to the one which was clicked from the API list
  apiSelectionHandler = (index) => {
    this.setState({selectedApiIndex: index})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== nextProps) {
      //FIXME: Need to change hardcode localstorage key name. Later we will save as project name
      return true
    }
  }

  dbUpdationHandler = (selectedDB) => {
    this.setState({selectedDB: selectedDB.value})
  }

  saveFileOnServer = () => {
    let apiDefinition =this.state.apiDefinition.slice()
    let yamlData = saveYamlOnServer(apiDefinition)
    let data = {yamlData: yamlData}
    postApiRequest(apiUriHostName+'/yaml-generator/', data, ()=>{
      document.getElementById('save-btn').classList.remove('btn-danger');
      document.getElementById('save-btn').classList.add('btn-success');
    },()=>{}, null)

  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.apiDefinition!==prevState.apiDefinition) {
      document.getElementById('save-btn').classList.add('btn-danger');
      document.getElementById('save-btn').classList.remove('btn-success');
    }
  }

  render () {
    return (
      <div>
      <NavHeader saveFileOnServer={this.saveFileOnServer} apiDefinition={this.state.apiDefinition} apiOpenHandler={this.apiOpenHandler} apiAdditionHandler={this.apiAdditionHandler} exportConfigAsYaml={this.exportConfigAsYaml}/>
      <ApiTabs
        {...this.state}
        setApiAccess={this.setApiAccess}
        apiCloseHandler={this.apiCloseHandler}
        apiTabRenameHandler={this.apiTabRenameHandler}
        onChangeApiDefinition={this.onChangeApiDefinition}
        onHandleTestButton={this.onHandleTestButton}
        apiDeletionHandler={this.apiDeletionHandler}
        apiAdditionHandler={this.apiAdditionHandler}
        apiSelectionHandler={this.apiSelectionHandler}
        apiParamToggleHandler={this.apiParamToggleHandler}
        onChangeTestData={this.onChangeTestData}
        dbUpdationHandler={this.dbUpdationHandler}
      />
      </div>
    )
  }
}
