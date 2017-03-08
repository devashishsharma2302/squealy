import React, { Component} from 'react'
import AceEditor from 'react-ace'
import { baseUrl } from './../Utils'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import CopyToClipboard from 'react-copy-to-clipboard'

import { SquealyModal } from './SquealyUtilsComponents'

export default class ValidationsModal extends Component {
  constructor() {
    super()
    this.state = {
      copied: false
    }
  }

  render () {
    const { selectedChartChangeHandler, chartUrl } = this.props,
      url = baseUrl() + chartUrl+'/view'

    const modalContent =
    <div className="share-modal">
      <div className="row">
        <label className="col-md-2">URL</label>
        <div className="col-md-10 copy-url">
          <input value={url} type="text" disabled/>
          <CopyToClipboard text={url} onCopy={() => {this.setState({copied: true})}}>
            <button className='btn'>Copy</button>
          </CopyToClipboard>
        </div>
      </div>
      {this.state.copied ? <div className='note-text'>Copied..</div> : ''}
    </div>

    return (
      <SquealyModal
        modalId='shareModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Share Your Chart'
        helpText='Generate a url for this chart which can be shared with other users'
        modalContent={modalContent}
      />
    )
  }

}
