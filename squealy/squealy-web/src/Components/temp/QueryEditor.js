import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { fetchQueryParamsFromQuery } from './../../Utils'

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
      currentTestParams = Object.assign({}, this.props.testParameters),
      testParamArray = fetchQueryParamsFromQuery(editorContent)


    //Generate parameters in testParameters
    testParamArray.map((param) => {
      if (param && !currentTestParams.hasOwnProperty(param)) {
        currentTestParams[param] = ''
      }
    })
    selectedChartChangeHandler('testParameters', currentTestParams)
    
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
