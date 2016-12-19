import React, {Component} from 'react'

import Widget from './Widget'
import {HidashModal} from '../HidashUtilsComponents'


export default class Dashboard extends Component {

  constructor() {
    super()
    this.state = {
      showEditWidgetModal: false
    }
  }

  modalVisibilityEnabler = () => {
    this.setState({showEditWidgetModal: true})
  }

  render() {
    const {dashboardDefinition, widgetAdditionHandler} = this.props

    const modalContent = 
      <div>Yo</div>

    return(
      <div id="dashboardAreaWrapper">
        <button className="btn btn-info" onClick={() => widgetAdditionHandler(0)}>
          Add a new widget
        </button>
        <div id="dashboardArea">
          {
            dashboardDefinition.widgets.map((widget, index) =>
              <Widget
                key={index}
                index={index}
                modalVisibilityEnabler={this.modalVisibilityEnabler}/>
            )
          }
          <HidashModal
            modalId='EditWidgetModal'
            closeModal={()=>this.setState({showEditWidgetModal: false})}
            showModal={this.state.showEditWidgetModal}
            modalHeader='Edit Widget Definition' 
            modalContent={modalContent}
            saveChanges={()=>console.log('"save called"')}
          />
        </div>
      </div>
    )
  }
}
