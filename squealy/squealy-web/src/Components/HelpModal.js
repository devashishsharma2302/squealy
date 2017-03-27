import React,{Component} from 'react'
import { SquealyModal } from './SquealyUtilsComponents'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import {
  helpText,
  JINJASQL_DOC_URL
} from './../Constant'

export default class JinjasqlDescription extends Component {

    render() {
    
    const helpContent = (
      <div className="help-container">
        <h5>Writing parameterized query</h5>
        <div className="code-description-container">
          <div className="code-description">
            <p>{helpText.descQuery1}</p>
          </div>
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={helpText.query1}
            wrapEnabled={true}
            width="50%"
            height="auto"
            fontSize={15}
            readOnly={true}
            />
        </div>
        <br />
        <h5>Conditional statements in the query</h5>
        <div className="code-description-container">
          <div className="code-description">
            <p> {helpText.descQuery2}</p>
          </div>
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={helpText.query2}
            wrapEnabled={true}
            fontSize={15}
            width="50%"
            height="100px"
            readOnly={true}
          />
        </div>
        <br />
        <h5>Using macros</h5>
        <div className="code-description-container">
          <div className="code-description">
            <p>{helpText.descQuery3}</p>
          </div>
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={helpText.query3}
            wrapEnabled={true}
            width="50%"
            fontSize={15}
            height="270px"
            readOnly={true}
            />
        </div>
        <br />
        <h5>
          Click
          <a href={JINJASQL_DOC_URL} target="_blank">
            here
          </a>
          to read more about Jinjasql
        </h5>
      </div>
    )

        const {modalHeader,modalId,showModal,modalSize,closeModal,dialogClassName} = this.props
        return (
        <SquealyModal 
            modalHeader={modalHeader}
            modalId={modalId}
            modalContent={helpContent}
            showModal={showModal}
            modalSize={modalSize}
            closeModal={closeModal}
            dialogClassName={dialogClassName}
            noFooter={null}
            />
        )
    }
}