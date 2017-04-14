import React, { Component } from 'react'

import { postApiRequest } from './../Utils'
import { DOMAIN_NAME } from './../Constant'
import { SquealyModal, ErrorMessage } from './SquealyUtilsComponents'

export default class AddDatabaseModal extends Component {

  constructor() {
    super()
    this.state = {
      displayName: '',
      djUrl: '',
      errorMessage: null
    }
  }

  // A generic function to change the state
  handleOnChange = (key, value) => {
    this.setState({[key]: value})
  }

  // Makes a post api call to save the db configurations
  saveDatabaseConfig = () => {
    const { displayName, djUrl } = this.state
    const { closeModal } = this.props
    const payLoad = {
      DISPLAY_NAME: displayName,
      dj_url: djUrl
    }

    postApiRequest(DOMAIN_NAME+'databases/', payLoad, closeModal,
      (error)=> {
        this.setState({errorMessage: error.responseJSON})
      }, null)
  }

  render () {

    const { displayName, djUrl, errorMessage } = this.state
    const { showModal, closeModal } = this.props

    const modalContent =
      <div className='app-modal-content'>
        <span className='db-config-error'> {errorMessage} </span>
        <div className="row">
          <label className='col-md-4'>Name: </label>
          <div className='col-md-8'>
            <input
              value={displayName}
              onChange={(e) => this.handleOnChange('displayName', e.target.value)}
              type='text'/>
          </div>
        </div>
        <div className='row'>
          <label className='col-md-4'>Dj Url: </label>
          <div className='col-md-8'>
            <input
              type='text'
              value={djUrl}
              onChange={(e) => this.handleOnChange('djUrl', e.target.value)}
            />
          </div>
        </div>
        <div className='modal-save'>
          <button
            className="btn btn-primary"
            onClick={this.saveDatabaseConfig}
          >
            Save
          </button>
        </div>
      </div>

    return (
        <SquealyModal
          modalId='chartConfigModal'
          closeModal={closeModal}
          showModal={showModal}
          modalHeader='Add a new database'
          helpText={null}
          modalContent={modalContent}
          noFooter={true}
        />
    )
  }
}
