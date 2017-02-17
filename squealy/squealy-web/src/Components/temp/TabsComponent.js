import React, { Component } from 'react'
import { SplitButton, MenuItem, Button } from 'react-bootstrap'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ParamDefinitionModalWrapper from './ParamDefinitionModalWrapper'

export default class TabsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefModal: false
    }
  }

  showParamDefinitionModal = () => {
    this.setState({showParamDefModal: true})
  }

  closeParamDefinitionModal = () => {
    this.setState({showParamDefModal: false})
  }

  render() {
    const { transformations, onHandleTestButton, parameters } = this.props
    return (
      <div>
        <SplitButton bsStyle='success' title='Run' id='run-button' onClick={onHandleTestButton}>
          <MenuItem eventKey='1'>Update Test Parameters</MenuItem>
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
          <ParamDefinitionModalWrapper
            closeModal={this.closeParamDefinitionModal}
            showModal={this.state.showParamDefModal}
            parameters={parameters}/>
        }
      </div>
    )
  }
}
