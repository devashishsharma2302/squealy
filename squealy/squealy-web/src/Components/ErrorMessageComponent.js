import React, { Component } from 'react'
import {SquealyModal} from './SquealyUtilsComponents'

/**
 * Component to show error in a panel
 * @className: CSS class name to customize the modal
 * @errorMessage: Message to be shown
 * @imageSrc: Image source which will render just before error message
 */
export class ErrorMessagePanel extends Component {

  render() {
    const {className, errorMessage, imageSrc} = this.props

    return (
      <div className={className}>
        {imageSrc && <img src={imageSrc}/>}
        <span>{errorMessage}</span>
      </div>
    )
  }
}

/**
 * Error message to show in modal
 * @className: CSS class name to customize the modal
 * @errorMessage: Message to be shown
 * @typeOfError: Type of error for better description
 * @closeModal: Function to close modal
 * @showModal: Flag value which determines if modal is need to show or not.
 */
export class ErrorMessageModal extends Component {
  render() {
    const {className, errorMessage, typeOfError, closeModal, showModal} = this.props

    const modalBodyTemplate = 
      <div>
        {typeOfError && <span className='error-type'>{typeOfError}: </span>}
        <p>{errorMessage}</p>
      </div>
    const modalHeader = 
      <span>
        <i className='fa fa-exclamation-triangle' />
        Error
      </span>

    return (
      <SquealyModal
        modalId={'error_message_modal'}
        closeModal={closeModal}
        showModal={showModal}
        modalHeader= {modalHeader}
        modalContent={modalBodyTemplate}
        noFooter={true}
        dialogClassName='error-modal' />
    )
  }
}


/**
 * Component to show error messgae as form validation
 * @classValue: className to customize the style
 * @message: Error message to be shown
 */
export const FormErrorMessage = ({classValue, message}) => {
  return (
    <div className={classValue}>
      <p>{ message }</p>
    </div>
  )
}