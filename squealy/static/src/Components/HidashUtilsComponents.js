import React, {Component} from 'react'

export class HidashModal extends Component {

  saveChangesHandler = () => {
    this.props.saveChanges()
  }

  render () {
    const {
      modalHeader,
      modalId,
      modalContent,
      saveChanges,
      showModal,
      modalSize
    } = this.props

    return (
      <div className="modal fade" id={modalId} role="dialog">
        <div className= {'modal-dialog '+modalSize}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h2 className="modal-title">{modalHeader}</h2>
            </div>
            <div className="modal-body">
              {modalContent}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              {
                saveChanges ? <button type="button" className="btn btn-primary" onClick={this.saveChangesHandler} data-dismiss="modal">Save</button> : null
              }
            </div>
          </div>
        </div>
      </div>
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

