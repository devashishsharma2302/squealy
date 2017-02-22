import React, { Component} from 'react'
import { SquealyModal } from './SquealyUtilsComponents'

export default class ValidationsModal extends Component {

  render () {
    const {testParameters, selectedChartChangeHandler} = this.props
    const modalContent = 
      <div>
        hello world !
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='transformationsModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Validations'
        modalContent={modalContent}
      />
    )
  }
  
}
