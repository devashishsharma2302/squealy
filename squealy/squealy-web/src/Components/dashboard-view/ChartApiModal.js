import React, {Component} from 'react'
import MainComponent from '../MainComponent'
import {getEmptyApiDefinition, getEmptyTestData, postApiRequest} from '../../Utils'
import {apiUriHostName} from '../../Containers/ApiViewContainer'
import {
  SIDE_BAR_WIDTH,
  YAML_CONTENT_TYPE,
  RESPONSE_FORMATS
} from '../../Constant'
import {
    HidashModal
} from '../HidashUtilsComponents'

export default class ChartApiModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			apiDefinition: [getEmptyApiDefinition()],	
			testData: [getEmptyTestData()],
			selectedApiIndex: 0,
		}
	}

  componentWillReceiveProps(nextProps) {
    if (this.state.props !== nextProps) {
      let testData = JSON.parse(JSON.stringify(this.state.testData))
      let apiDefinition = JSON.parse(JSON.stringify(this.state.apiDefinition))
      testData[0].selectedFormat = (nextProps.newApiType === 'filter')?'table': 'GoogleChartsFormatter'
      apiDefinition[0].format = (nextProps.newApiType === 'filter')?'table': 'GoogleChartsFormatter'
      this.setState({
        apiDefinition: apiDefinition,  
        testData: testData
      })
    }
  }

	onChangeApiDefinition = (variableName, value) => {
    let tempAPIDef = this.state.apiDefinition.slice()
    tempAPIDef[this.state.selectedApiIndex][variableName] = value
    this.setState({apiDefinition: tempAPIDef})
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
    if(format === RESPONSE_FORMATS.table.value){
      response.columns.map((column) => {
        newAPIdef[this.state.selectedApiIndex].columns[column.name] = {
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
	
	onHandleTestButton = (event) => {
    let tempParam = this.state.testData[this.state.selectedApiIndex].apiParams || {}
    let paramObj = {}
    try {
      paramObj = typeof tempParam === 'string' ? JSON.parse(tempParam) : tempParam
    } catch (e) {
      console.log(e)
      console.log('please check your object syntax. Object key and value should be wrapped up in double quotes. Expected input: {"objKey": "objVal"}')
    }
    let paramDef = this.processParamDef(this.state.apiDefinition[this.state.selectedApiIndex].paramDefinition),
    format = this.state.testData[0].selectedFormat || 'table',
    payloadObj = {
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

  onChangeTestData = (value) => {
    let tempTestData = this.state.testData.slice()
    tempTestData[this.state.selectedApiIndex].apiParams = value
    this.setState({testData: tempTestData})
  }

  dbUpdationHandler = (selectedDB) => {
    this.setState({selectedDB: selectedDB.value})
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
  
  closeModal = () => {
    this.props.closeChartApiModal(this.state.apiDefinition[0].urlName)
    this.setState({
      apiDefinition: [getEmptyApiDefinition()],  
      testData: [getEmptyTestData()]
    })
  }

	render() {
	const {showModal, closeChartApiModal, saveChartApi} = this.props
  const modalContent = 
		<div>
			<MainComponent
		    apiDefinition={this.state.apiDefinition}
		    selectedApiIndex={0}
		    testData={this.state.testData}
		    onChangeApiDefinition={this.onChangeApiDefinition}
		    onHandleTestButton={this.onHandleTestButton}
		    onChangeTestData={this.onChangeTestData}
		    dbUpdationHandler={this.dbUpdationHandler}
        showFormatSelector={false}
	    />
	  </div>
	
	return (
		<HidashModal
			dialogClassName='chart-api-modal'
			modalSize = 'large'
      modalId='chartApiModal'
      closeModal={() => closeChartApiModal('')}
      showModal={showModal}
      modalHeader='Create Chart API'
      modalContent={modalContent}
      saveChanges={()=> saveChartApi(this.state.apiDefinition[0], this.closeModal)}
    />
		)
	}

}