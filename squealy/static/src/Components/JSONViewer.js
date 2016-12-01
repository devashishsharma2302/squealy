import React, { Component } from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'


export default class JSONViewer extends Component {
  render() {
    let { response } = this.props
    // We first stringify then parse and stringify again to apply
    // indentation in the json response
    response = JSON.stringify(response)
    response = JSON.stringify(JSON.parse(response), null, '\t')
    return (
      <div>
        <AceEditor
          mode="json"
          theme="tomorrow"
          name='json'
          height="200px"
          width="100%"
          readOnly={true}
          fontSize={15}
          maxLines={25}
          minLines={20}
          ref="ace-response"
          value={response}
          editorProps={{$blockScrolling: true}}
        />
      </div>
    )
  }
}
