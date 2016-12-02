import React, {Component, PropTypes} from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';

import Transformations from './Transformations'
import DatabaseDescription from './DatabaseDescription'

export default class SideMenu extends Component {

  static propTypes = {
    apiParams: PropTypes.string.isRequired,
    onChangeTestData: PropTypes.func.isRequired
  }

  render () {
    const {
      apiParams,
      onChangeTestData,
      onChangeApiDefinition,
      selectedApiDefinition
    } = this.props
    return(
      <div>
        <DatabaseDescription />
        <div className="parameters-value-wrapper">
          <h2>Test Parameter Values: </h2>
          <AceEditor
            mode="json"
            theme="tomorrow"
            name="code"
            height="200px"
            width="100%"
            fontSize={15}
            maxLines={15}
            minLines={15}
            ref="ace"
            editorProps={{$blockScrolling: true}}
            onChange={onChangeTestData}
            value={apiParams}
          />
        </div>
      </div>
    )
  }
}
