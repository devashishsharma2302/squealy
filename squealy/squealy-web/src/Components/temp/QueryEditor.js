import React, {Component} from 'react'
import AccordionTab from './AccordionTab'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'

export default class QueryEditor extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      editorContent: props.query?props.query:'SELECT ...'
    }
  }

  textChangeHandler = (text) => {
    this.setState({editorContent: text})
  }

   onBlur = () => {
    const {selectedChartChangeHandler} = this.props
    let {editorContent} = this.state
    //   newApiParams = Object.assign({}, apiParams),
    //   apiParamArray = fetchApiParamsFromQuery(editorContent),
    //   sessionParamArray = fetchSessionParamsFromQuery(editorContent)


    // //Update new params in Test Parameter if query has new param added
    // apiParamArray.map((param) => {
    //   if (!newApiParams.hasOwnProperty('params')) {
    //     newApiParams.params = {}
    //   }
    //   if (param && !newApiParams.params.hasOwnProperty(param)) {
    //     newApiParams.params[param] = ''
    //   }
    // })

    // sessionParamArray.map((param) => {
    //   if (!newApiParams.hasOwnProperty('session')) {
    //     newApiParams.session = {}
    //   }
    //   if (param && !newApiParams.session.hasOwnProperty(param)) {
    //     newApiParams.session[param] = ''
    //   }
    // })
    // onChangeTestData(newApiParams)
    // //Update sql query in selected api definition
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
            onBlur={this.onBlur}
          />

    	</AccordionTab>
    )
  }
}
