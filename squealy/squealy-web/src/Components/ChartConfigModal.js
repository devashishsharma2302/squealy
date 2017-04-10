import React, { Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { CHART_CONFIG_EXAMPLE, GOOGLE_CHART_DOC } from './../Constant'
import { SquealyModal } from './SquealyUtilsComponents'
import { FormErrorMessage } from './ErrorMessageComponent'

export default class ChartConfigModal extends Component {

  constructor() {
    super()
    this.state = {
      config: '',
      errorMessage: null
    }
  }

  copyExampleConfig = () => {
    this.setState({config: JSON.stringify(CHART_CONFIG_EXAMPLE, null, '\t')})
  }

  onChangeHandler = (config) => {
    this.setState({config: config})
  }

  handleSaveClick = () => {
    const { config } = this.state

    try {
      let newConfig = (config) ? JSON.parse(config) : {}
      this.props.selectedChartChangeHandler({options: newConfig})
      this.setState({errorMessage: null}, () => {
        this.props.closeModal()
      })
    } 
    catch(error) {
      this.setState({errorMessage: error.message})
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({config: JSON.stringify(nextProps.chartConfiguration, null, '\t')})
  }

  render () {
    const { config, configExample, chartConfiguration } = this.state
    const modalContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-6'>
            <div className="validation-query">
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="200px"
                width="100%"
                fontSize={15}
                maxLines={20}
                minLines={20}
                highlightActiveLine={true}
                onChange={this.onChangeHandler}
                value={config}
                editorProps={{$blockScrolling: true}}
              />
            </div>
          </div>
          <button className="col-md-1 copy btn btn-success" onClick={this.copyExampleConfig}>
            <i className="fa fa-angle-double-left"/>
            Copy
          </button>
          <div className='col-md-5'>
            <div className="validation-query-example">
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="200px"
                width="100%"
                fontSize={15}
                maxLines={20}
                minLines={20}
                highlightActiveLine={false}
                value={JSON.stringify(CHART_CONFIG_EXAMPLE, null, '\t')}
                editorProps={{$blockScrolling: true}}
                readOnly={true}
              />
            </div>
          </div>
          {this.state.errorMessage && <FormErrorMessage classValue={'error validation-error'} message={'Syntax Error: ' + this.state.errorMessage}/>}
          <div className='param-form-footer'>
            <button className="btn btn-primary" onClick={this.handleSaveClick}>Save</button>
          </div>
        </div>
        <a href={GOOGLE_CHART_DOC} className='note-text' target="_blank"><strong>NOTE: </strong> GoogleCharts supports a lot of configuration that can be added here. Click here to refer the docs.</a>
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='chartConfigModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Chart Configurations'
        helpText='Customize the look and feel of this chart here. Any configuration provided by Google Charts can be applied here'
        modalContent={modalContent}
        dialogClassName='chart-config-modal'
        noFooter={true}
      />
    )
  }

}
