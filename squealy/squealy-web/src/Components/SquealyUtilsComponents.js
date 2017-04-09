import React, {Component} from 'react'
import {Modal, OverlayTrigger, Tooltip} from 'react-bootstrap'

export class SquealyModal extends Component {

  render () {
    const {
      modalHeader,
      modalId,
      modalContent,
      saveChanges,
      showModal,
      modalSize,
      closeModal,
      dialogClassName,
      noFooter,
      helpText
    } = this.props

    const tooltip = 
      <Tooltip id={'tooltip' + modalId}>
        {helpText}
      </Tooltip>

    return (
      <Modal dialogClassName={dialogClassName} show={showModal} onHide={closeModal} key={modalId} bsSize={modalSize}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalHeader}
            {helpText?
              <OverlayTrigger placement="right" overlay={tooltip}>
                <i className="fa fa-question-circle-o info-icon" aria-hidden="true"></i>
              </OverlayTrigger>
            :
              null
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent}
        </Modal.Body>
        {
          noFooter ? null :
            <Modal.Footer>
              <button onClick={closeModal} className="btn btn-default">Close</button>
              {
                saveChanges ? 
                  <button onClick={saveChanges} className="btn btn-primary">Save</button>
                : null}
            </Modal.Footer>
        }
      </Modal>
    )
  }
}

export class SquealyDropdown extends Component {

  render () {
    const {name, options, selectedValue, onChangeHandler} = this.props
    return (
        <select value={selectedValue} id='params_type' onChange={(e) => onChangeHandler(e.target.value)}>
        {
          options.map((option, i) => {
            return ((option.constructor === Object) ? 
              <option key={'dropdown_'+i} value={option.value}>{option.label}</option>
              :
              <option key={'dropdown_'+i} value={option}>{option}</option>)
          })
        }
      </select>
    )
  }
}