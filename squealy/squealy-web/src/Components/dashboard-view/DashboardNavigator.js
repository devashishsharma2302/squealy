import React, {Component} from 'react'
import {Tabs, Tab, TabList, DropdownButton, MenuItem} from 'react-bootstrap'
import Dashboard from './Dashboard'
import {SquealyModal} from '../SquealyUtilsComponents'


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
      widgetDeletionHandler,
      selectedDashboardIndex,
      deleteDashboard,
      widgetResizeHandler,
      widgetRepositionHandler,
      updateDashboardDefinition,
      updateWidgetDefinition,
      filterAdditionHandler,
      filterResizeHandler,
      filterRepositionHandler,
      filterDeletionHandler,
      googleDefined,
      saveChartApi
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
    const dashboardTabs = dashboardDefinition.map((dashboard, index)=>{
      const tabTitle = (
        <div className='dashboard-tab'>
          {dashboard.apiName}
          <DropdownButton
            bsSize="small"
            style={{
            borderColor: '#fff'
            }}
            id={'ddbtn-tab-' + index}
            title=""
          >
            <MenuItem eventKey="1" onClick={() => {deleteDashboard(index)}}>
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
          key={index}
          title={selectedDashboardIndex==index?tabTitle:dashboard.apiName}
          eventKey={index}
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
                filterAdditionHandler={filterAdditionHandler}
                filterDeletionHandler={filterDeletionHandler}
                filterResizeHandler={filterResizeHandler}
                filterRepositionHandler={filterRepositionHandler}
                widgetDeletionHandler={widgetDeletionHandler}
                dashboardIndex={index}
                googleDefined={googleDefined}
                saveChartApi={saveChartApi}
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
        {dashboardTabs}
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
      <SquealyModal
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
