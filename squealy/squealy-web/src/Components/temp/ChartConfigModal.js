import React, { Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'

import { SquealyModal } from './SquealyUtilsComponents'

export default class ChartConfigModal extends Component {

  constructor() {
    super()
    this.state = {
      selectedValidation: undefined,
      showForm: false,
      validationName: '',
      validationQuery: ''
    }
  }

  render () {
    const { selectedChartChangeHandler } = this.props
    const {
      selectedValidation,
      showForm,
      validationName,
      validationQuery
    } = this.state
    const modalContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-12'>
            <label htmlFor='validationQuery' className='col-md-2'>
              Configurations:
            </label>
            <div className="col-md-10 validation-query">
              <AceEditor
                mode="sql"
                theme="tomorrow"
                name={'validationQuery'}
                height="200px"
                width="100%"
                fontSize={15}
                maxLines={20}
                minLines={12}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: true}}
                onChange={(value)=>this.onChangeHandler('validationQuery', value)}
                value={validationQuery}
              />
            </div>
          </div>
          <div className='col-md-12 param-form-footer'>
            <button className="btn btn-default" onClick={this.formVisibilityHandler}>Cancel</button>
            <button className="btn btn-primary" onClick={this.onClickSave}>Save</button>
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
