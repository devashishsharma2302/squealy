import React, { Component } from 'react'
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
      showShareModal: false
    }
  }

  // A generic method which handles just the visibility of modals
  modalVisibilityHandler = (modalName) => {
    this.setState({[modalName]: !this.state[modalName]})
  }

  render() {
    const {
      transformations,
      onHandleTestButton,
      parameters,
      testParameters,
      selectedChartChangeHandler,
      validations,
      chartColumns,
      pivotColumn,
      metric,
      columnsToMerge,
      newColumnName,
      chartUrl
    } = this.props
    const {
      showValidationsModal,
      showParamDefModal,
      showTransformationsModal,
      showShareModal
    } = this.state
    return (
      <div>
        <SplitButton className="run-btn-group" bsStyle='success' title='Run' id='run-button' onClick={onHandleTestButton}>
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
              count={validations.length}
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
          <NotificationBadge count={transformations.length}
            effect={[null, null, null, null]}
            className='transformations-count-badge' />
        </Button>
        <Button bsStyle='primary' className='tab-component'
          onClick={()=>this.modalVisibilityHandler('showShareModal')}>
          <i className="fa fa-share-alt"/>
          Share</Button>
        {
          showParamDefModal &&
          <ParamDefinitionModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={()=>this.modalVisibilityHandler('showParamDefModal')}
            showModal={this.state.showParamDefModal}
            parameters={parameters}/>
        }
        {
          showValidationsModal &&
          <ValidationsModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={()=>this.modalVisibilityHandler('showValidationsModal')}
            showModal={showValidationsModal}
            validations={validations}/>
        }
        {
          showShareModal &&
          <ShareModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={()=>this.modalVisibilityHandler('showShareModal')}
            showModal={showShareModal}
            chartUrl={chartUrl}/>
        }
        {
          showTransformationsModal &&
          <TransformationsModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={()=>this.modalVisibilityHandler('showTransformationsModal')}
            showModal={showTransformationsModal}
            transformations={transformations}
            chartColumns={chartColumns}
            pivotColumn={pivotColumn}
            metric={metric}
            columnsToMerge={columnsToMerge}
            newColumnName={newColumnName}
          />
        }
      </div>
    )
  }
}
