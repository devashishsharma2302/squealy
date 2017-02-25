import React, { Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'

import { SquealyModal } from './SquealyUtilsComponents'

export default class ChartConfigModal extends Component {

  constructor() {
    super()
    this.state = {
      config: ''
    }
  }

  onChangeHandler = (config) => {
    this.setState({config: config})
  }

  handleSaveClick = () => {
    const { config } = this.state
    let newConfig = (config)?JSON.parse(config):{}
    this.props.selectedChartChangeHandler('options', newConfig)
  }

  render () {
    const { config } = this.state
    const modalContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-12'>
            <div className="col-md-12 validation-query">
              <AceEditor
                mode="sql"
                theme="tomorrow"
                height="200px"
                width="100%"
                fontSize={15}
                maxLine s={20}
                minLines={12}
                highlightActiveLine={true}
                onChange={this.onChangeHandler}
                value={config}
                editorProps={{$blockScrolling: true}}
              />
            </div>
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-primary" onClick={this.handleSaveClick}>Save</button>
          </div>
        </div>
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='chartConfigModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Chart Configurations'
        modalContent={modalContent}
        dialogClassName='chart-config-modal'
        noFooter={true}
      />
    )
  }
  
}
