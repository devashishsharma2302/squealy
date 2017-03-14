import React,{Component} from 'react'
import { SquealyModal } from './SquealyUtilsComponents'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { query1,query2,query3,descQuery1_1,descQuery1_2,descQuery2,descQuery3 } from './../Constant'

export default class JinjasqlDescription extends Component {

    render() {
    
    const helpContent = (
      <div className="helpContainer">
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={query1}
            wrapEnabled={true}
            width="50%"
            height="auto"
            fontSize={15}
            readOnly={true}
            />
          <div className="codeDescription">
            <ul>
              <li><p>{descQuery1_1}</p></li>
              <li><p>{descQuery1_2}</p></li>
            </ul>
          </div>
        </div>
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={query2}
            wrapEnabled={true}
            fontSize={15}
            width="50%"
            height="auto"
            readOnly={true}
            />
          <div className="codeDescription">
            <ul>
              <li><p> {descQuery2}</p></li>
            </ul>

          </div>
        </div>
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={query3}
            wrapEnabled={true}
            width="50%"
            fontSize={15}
            height="auto"
            readOnly={true}
            maxLines="20"
            />
          <div className="codeDescription">
            <ul>
              <li><p>{descQuery3}</p></li>
            </ul>
          </div>
        </div>
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