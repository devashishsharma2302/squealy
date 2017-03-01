import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { fetchQueryParamsFromQuery, getEmptyParamDefinition,
  checkObjectAlreadyExists} from './../../Utils'

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
    const {selectedChartChangeHandler} = this.props
    let {editorContent} = this.state,
      currentParams = JSON.parse(JSON.stringify(this.props.parameters)),
      testParamArray = fetchQueryParamsFromQuery(editorContent),
      newParamObj = {}


    //Generate parameters in testParameters
    testParamArray.map((param) => {
      if (param && !checkObjectAlreadyExists(currentParams, 'name', param)) {
        newParamObj = getEmptyParamDefinition()
        newParamObj.name = param
        currentParams.push(newParamObj)
      }
    })
    selectedChartChangeHandler('parameters', currentParams)

    //Update sql query in selected chart definition
    selectedChartChangeHandler('query', editorContent)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
        this.setState({editorContent: nextProps.query})
    }
  }

  render() {
    const {
      selectedApiIndex
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
