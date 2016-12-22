import React, {Component} from 'react'
import {Tabs, Tab, TabList, DropdownButton, MenuItem} from 'react-bootstrap'
import Dashboard from './Dashboard'
import {HidashModal} from '../HidashUtilsComponents'


export default class DashboardNavigator extends Component {
  constructor() {
    super()
    this.state = {
      showRenameModal: false,
      currentName: ''
    }
  }

  handleSelect = (key, e) => {
    if (key === 'add_tab') {
      this.props.dashboardAdditionHandler()
    }
    else {
      this.props.selectDashboard(key)
    }
  }

  render() {
    const {
      saveDashboard,
      dashboardDefinition,
      widgetAdditionHandler,
      selectedDashboardIndex,
      deleteDashboard,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      updateWidgetDefinition
    } = this.props
    const RenameModalContent =  <div className="row">
         <div className="col-md-12">
           <label className='col-md-4'>Dashboard Name: </label>
           <input
             type='text'
             ref='dashboardRenameModal'
             value={this.state.currentName}
             onChange={()=>{this.setState({currentName: this.refs.dashboardRenameModal.value})}}
           />
         </div>
       </div>
    const dashboard_tabs = dashboardDefinition.map((dashboard, i)=>{
      const tabTitle = (
        <div className='dashboard-tab'>
          {dashboard.apiName}
          <DropdownButton
            bsSize="small"
            style={{
            borderColor: '#fff'
            }}
            id={'ddbtn-tab-' + i}
            title=""
          >
            <MenuItem eventKey="1" onClick={() => {deleteDashboard(i)}}>
              <i className="fa fa-trash" /> Delete Dashboard
            </MenuItem>
            <MenuItem eventKey="2"  onClick={()=>{this.setState({showRenameModal: true})}}>
              <i className="fa fa-i-cursor" /> Rename Dashboard
            </MenuItem>
            <MenuItem eventKey="3" onClick={() => {}}>
              <i className="fa fa-close" /> Close Dashboard
            </MenuItem>
          </DropdownButton>
        </div>
      )
      return (
        <Tab
          key={i}
          title={selectedDashboardIndex==i?tabTitle:dashboard.apiName}
          eventKey={i}
        >
          <div className="panel panel-default">
            <div className="panel-body">
              <Dashboard
                dashboardDefinition={dashboard}
                widgetAdditionHandler={widgetAdditionHandler}
                widgetRepositionHandler={widgetRepositionHandler}
                widgetResizeHandler={widgetResizeHandler}
                updateWidgetDefinition={updateWidgetDefinition}
                updateDashboardDefinition={updateDashboardDefinition}
                selectedDashboardIndex={selectedDashboardIndex}
              />
            </div>
          </div>
        </Tab>
      )
    })
    return(<div>
        <Tabs
        bsStyle="tabs"
        animation={true}
        activeKey={selectedDashboardIndex}
        onSelect={this.handleSelect}
        id='dashboard-tabs'
         >
        {dashboard_tabs}
        <Tab
          style={{
            borderColor: '#fff'
            }}
          title={
            <div id="tabPlusIconWrapper">
              <i className="fa fa-plus tab-plus-icon" />&nbsp;
            </div>}
          eventKey="add_tab"
        />
      </Tabs>
      <HidashModal
        modalId='RenameDashboardModal'
        closeModal={()=>this.setState({showRenameModal: false})}
        showModal={this.state.showRenameModal}
        modalHeader='Rename Dashboard'
        modalContent={RenameModalContent}
        saveChanges={()=>{updateDashboardDefinition(selectedDashboardIndex,'apiName',this.state.currentName);
          this.setState({showRenameModal: false})}}
      />
      </div>
    )
  }
}
