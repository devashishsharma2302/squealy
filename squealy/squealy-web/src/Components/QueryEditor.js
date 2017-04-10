import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { fetchQueryParamsFromQuery, getEmptyParamDefinition, fetchSessionParamsFromQuery,
  checkObjectAlreadyExists} from './../Utils'

export default class QueryEditor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorContent: props.query ? props.query : 'SELECT ...'
    }
  }

  textChangeHandler = (text) => {
    this.setState({editorContent: text})
  }

  onBlurHandler = () => {
    const {selectedChartChangeHandler,
      selectedFilterChangeHandler} = this.props
    let {editorContent} = this.state,
      currentParams = JSON.parse(JSON.stringify(this.props.parameters)),
      paramArray = fetchQueryParamsFromQuery(editorContent),
      userParamArray = fetchSessionParamsFromQuery(editorContent),
      newParamObj = {}, objIndex

    //Generate parameters in testParameters
    paramArray.map((param) => {
      objIndex = checkObjectAlreadyExists(currentParams, 'name', param)
      if (param && (objIndex === -1 || (objIndex >= 0 && currentParams[objIndex].type !== 1))) {
        newParamObj = getEmptyParamDefinition()
        newParamObj.name = param
        newParamObj.type = 1
        currentParams.push(newParamObj)
      }
    })

    userParamArray.map((param) => {
      objIndex = checkObjectAlreadyExists(currentParams, 'name', param)
      if (param && (objIndex === -1 || (objIndex >= 0 && currentParams[objIndex].type !== 2))) {
        newParamObj = getEmptyParamDefinition()
        newParamObj.name = param
        newParamObj.type = 2
        currentParams.push(newParamObj)
      }
    })

    //Update sql query in selected chart definition
    if (this.props.chartMode) {
      selectedChartChangeHandler({
        query: editorContent,
        parameters: currentParams
      })
    } else {
      selectedFilterChangeHandler({
        query: editorContent,
        parameters: currentParams
      })
    }
    
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
        this.setState({editorContent: nextProps.query})
    }
  }

  render() {
    const {
      selectedApiIndex,
      chartMode
    } = this.props

    return (
    	<AccordionTab heading='Query'>
          <AceEditor
            mode="sql"
            theme="tomorrow"
            name={'sqlQuery' + selectedApiIndex}
            height="200px"
            width="100%"
            fontSize={15}
            maxLines={20}
            minLines={15}
            highlightActiveLine={true}
            ref={'ace' + selectedApiIndex}
            value={this.state.editorContent}
            editorProps={{$blockScrolling: true}}
            onChange={this.textChangeHandler}
            onBlur={this.onBlurHandler}
          />

    	</AccordionTab>
    )
  }
}
