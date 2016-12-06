import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'

export class HidashModal extends Component {

  render () {
    const {
      modalHeader,
      modalId,
      modalContent,
      saveChanges,
      showModal,
      modalSize,
      closeModal
    } = this.props


    return (
      <Modal show={showModal} onHide={closeModal} key={modalId} bsSize={modalSize}>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={closeModal} className="btn btn-default">Close</button>
          {saveChanges ? <button onClick={saveChanges} className="btn btn-info">Save</button> : null}
        </Modal.Footer>
      </Modal>
    )
  }
}

export class HidashDropdown extends Component {

  render () {
    const {name, options, selectedValue, onChangeHandler} = this.props
    return (
      <div>
        <select value={selectedValue} id='params_type' onChange={(e) => onChangeHandler(e.target.value)}>
          {
            options.map((option, i) => {
              return ((typeof option === 'object') ? 
                <option key={'dropdown_'+i} value={option.value}>{option.label}</option>
                :
                <option key={'dropdown_'+i} value={option}>{option}</option>)
            })
          }
        </select>
      </div>
    )
  }
}

