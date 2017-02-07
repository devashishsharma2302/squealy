import React, {Component} from 'react'
import {SplitButton, MenuItem, Button} from 'react-bootstrap'

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

export default class TabsComponent extends Component {
  render() {
  	return (
    	<div>
		    <SplitButton bsStyle='success' title='Run' id='run-button'>
		      <MenuItem eventKey='1'>Edit Test Parameters</MenuItem>
		      <MenuItem divider />
		      <MenuItem eventKey='2'>Parameter Definitions</MenuItem>
	    	</SplitButton>
	    	<Button bsStyle='primary' className='tab-component'>Validations</Button>
					<Button bsStyle='primary' className='tab-component'>Transformations
						<NotificationBadge count={2} effect={Effect.SCALE} className='transformations-count-badge'/>
					</Button>
				<Button bsStyle='primary' className='tab-component'>Export</Button>
    </div>
    )
  }
}
