import React, { Component } from 'react'
import Select from 'react-select'
import { SplitButton, MenuItem, Button } from 'react-bootstrap'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'

import ParamDefinitionModal from './ParamDefinitionModal'
import ValidationsModal from './ValidationsModal'
import TransformationsModal from './TransformationsModal'
import ShareModal from './ShareModal'
import transformationIcon from './../images/transformations_icon_white.png'
import validationIcon from './../images/validation_icon_white.png'
import exportIcon from './../images/export_icon_white.png'


export default class TabsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefModal: false,
      showValidationsModal: false,
      showTransformationsModal: false,
      showShareModal: false,
      note: null
    }
  }

  // A generic method which handles just the visibility of modals
  modalVisibilityHandler = (modalName) => {
    this.setState({[modalName]: !this.state[modalName]})
  }

  /**
   * Funtion to check parameter test_value or default_value. While clicking on Run button, it
   * checks the test_value or default_value of parameters. If none of them is present,
   *  open modal to add values.
   */
  checkParametersHandler = (runTest) => {
    const params = this.props.chart.parameters
    let i = 0

    for (i = 0; i < params.length; i++) {
      if (!params[i].test_value && !params[i].default_value) {
        this.setState({
          showParamDefModal: true,
          note: 'Please update the Test Data OR Default Value for parameters'
        })
        return
      }
    }
    this.setState({
      note: null
    }, () => {
      runTest ? this.props.onHandleTestButton() : null
    })
  }

  //Generic close Function which unset modal visibility and run the query.
  closeModal = (modalName) => {
    this.setState({[modalName]: false}, () => {
      this.props.onHandleTestButton()
    })
  }


  render() {
    const {
      chart,
      onHandleTestButton,
      selectedChartChangeHandler,
      updateViewMode,
      currentChartMode,
      databases,
    } = this.props

    const {
      showValidationsModal,
      showParamDefModal,
      showTransformationsModal,
      showShareModal
    } = this.state

    let viewButton = {
      className: '',
      title: null,
      viewText: 'View',
      icon: <i className="fa fa-pencil"/>
    }

    if (chart.can_edit) {
      viewButton.className = ''
      viewButton.title = null
      if (currentChartMode) {
        viewButton.viewText = 'View'
        viewButton.icon =  <i className="fa fa-eye"/>
      } else {
        viewButton.viewText = 'Edit'
        viewButton.icon =  <i className="fa fa-pencil"/>
      }
    } else {
      viewButton.viewText = 'Edit'
      viewButton.icon =  <i className="fa fa-pencil"/>
      viewButton.className = 'disabled'
      viewButton.title = 'Please contact to Admin for write access'
    }

    return (
      <div>
        { currentChartMode &&
          <span>
            <SplitButton className="run-btn-group" bsStyle='success' title='Run' id='run-button' onClick={() => this.checkParametersHandler(true)}>
              <MenuItem
                eventKey='1'
                onClick={()=>this.modalVisibilityHandler('showParamDefModal')}>
                  Parameter Definitions
              </MenuItem>
            </SplitButton>
            <Button
              bsStyle='primary'
              className='tab-component'
              onClick={() => this.modalVisibilityHandler('showValidationsModal')}>
              <img src={validationIcon} alt="squealyValidation"/>
                Validations
                <NotificationBadge
                  count={chart.validations.length}
                  effect={[null, null, null, null]}
                  className='transformations-count-badge'
                />
            </Button>
            <Button
              bsStyle='primary'
              className='tab-component'
              onClick={()=>this.modalVisibilityHandler('showTransformationsModal')}
            >
              <img src={transformationIcon} alt="transformationIcon"/>Transformations
              <NotificationBadge count={chart.transformations.length}
                effect={[null, null, null, null]}
                className='transformations-count-badge' />
            </Button>
            <div className="selected-db-wrapper">
              <Select
                value={(chart.database)?chart.database:null}
                options={databases}
                onChange={(db) => {selectedChartChangeHandler('database', (db)?db.value:null)}}
                placeholder={'Select Database'}
              />
            </div>
            <Button bsStyle='primary' className='tab-component'
              onClick={()=>this.modalVisibilityHandler('showShareModal')}>
              <i className="fa fa-share-alt"/>
              Share</Button>
            {
              showParamDefModal &&
              <ParamDefinitionModal
                selectedChartChangeHandler={selectedChartChangeHandler}
                closeModal={() => this.closeModal('showParamDefModal')}
                showModal={this.state.showParamDefModal}
                parameters={chart.parameters}
                note={this.state.note}
                updateNoteHandler={this.checkParametersHandler}/>
            }
            {
              showValidationsModal &&
              <ValidationsModal
                selectedChartChangeHandler={selectedChartChangeHandler}
                closeModal={() => this.closeModal('showValidationsModal')}
                showModal={showValidationsModal}
                validations={chart.validations}/>
            }
            {
              showShareModal &&
              <ShareModal
                selectedChartChangeHandler={selectedChartChangeHandler}
                closeModal={()=>this.modalVisibilityHandler('showShareModal')}
                showModal={showShareModal}
                chartUrl={chart.name}/>
            }
            {
              showTransformationsModal &&
              <TransformationsModal
                selectedChartChangeHandler={selectedChartChangeHandler}
                closeModal={() => this.closeModal('showTransformationsModal')}
                showModal={showTransformationsModal}
                chart={chart}
              />
            }
          </span>
        }
        <Button bsStyle='primary'
          className={'tab-component view-btn '+viewButton.className} 
          title={viewButton.title}
          onClick={()=>updateViewMode(currentChartMode, chart.can_edit)}>
          {viewButton.icon}
          {viewButton.viewText}
        </Button>
      </div>
    )
  }
}
