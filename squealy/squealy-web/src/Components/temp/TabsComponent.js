import React, { Component } from 'react'
import { SplitButton, MenuItem, Button } from 'react-bootstrap'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ParamDefinitionModal from './ParamDefinitionModal'
import TestParametersModal from './TestParametersModal'

export default class TabsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefModal: false,
      showTestParamModal: false
    }
  }

  showParamDefinitionModal = () => {
    this.setState({showParamDefModal: true})
  }

  closeParamDefinitionModal = () => {
    this.setState({showParamDefModal: false})
  }

  showTestParamModalHandler = () => {
    this.setState({showTestParamModal: true})
  }

  closeTestParamModalHandler = () => {
    this.setState({showTestParamModal: false})
  }

  render() {
    const { transformations, onHandleTestButton, parameters, testParameters, selectedChartChangeHandler} = this.props
    return (
      <div>
        <SplitButton bsStyle='success' title='Run' id='run-button' onClick={onHandleTestButton}>
          <MenuItem eventKey='1' onClick={this.showTestParamModalHandler}>Update Test Parameters</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='2' onClick={this.showParamDefinitionModal}>Parameter Definitions</MenuItem>
        </SplitButton>
        <Button bsStyle='primary' className='tab-component'>Validations</Button>
        <Button bsStyle='primary' className='tab-component'>Transformations
          <NotificationBadge count={transformations.length} 
            effect={[null, null, null, null]} 
            className='transformations-count-badge' />
        </Button>
        <Button bsStyle='primary' className='tab-component'>Export {'</>'}</Button>
        {
          this.state.showParamDefModal && 
          <ParamDefinitionModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={this.closeParamDefinitionModal}
            showModal={this.state.showParamDefModal}
            parameters={parameters}/>
        }
        {
          this.state.showTestParamModal && 
          <TestParametersModal
            selectedChartChangeHandler={selectedChartChangeHandler}
            closeModal={this.closeTestParamModalHandler}
            showModal={this.state.showTestParamModal}
            testParameters={testParameters}/>
        }
      </div>
    )
  }
}
