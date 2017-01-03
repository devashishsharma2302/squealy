import React, {Component} from 'react'
import MainComponent from './MainComponent'
import { DropdownButton, MenuItem, Tab, Tabs } from 'react-bootstrap'
import {HidashModal} from './HidashUtilsComponents'


export default class ApiTabsToggle extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      showRenameModal: false
    }
  }

  currentApiIndex = 0
  
  handleSelect = (key, e) => {
    if (key === 'add_tab') {
      this.props.apiAdditionHandler()
    } 
    else if (e.target.classList.contains('api-tab')) {
      this.props.apiSelectionHandler(key)
    }
  }

  deleteTab = (index) => {
    this.props.apiDeletionHandler(index)
  }

  closeModal = () => {
    this.setState({showRenameModal: !this.state.showRenameModal})
  }

  updateApiIndex = (index) => {
    this.currentApiIndex=index
    this.closeModal()
  }

  renameTab = () => {
    this.props.apiTabRenameHandler(this.refs.apiName.value, this.currentApiIndex)
    this.closeModal()
  }

  render() {
    const {
      onHandleTestButton,
      onChangeApiDefinition,
      apiDefinition,
      selectedApiIndex,
      testData,
      setApiAccess,
      apiParamToggleHandler,
      exportConfigAsYaml,
      onChangeTestData,
      apiOpenHandler,
      apiCloseHandler,
      dbUpdationHandler
    } = this.props
    const renameTabModalContent =
      <div className='row add-modal-content'>
        <div className='col-md-12'>
          <h4 className='col-md-4'>Name: </h4>
          <input type='text' name='apiName' id='apiName' ref='apiName'/>
        </div>
      </div>
    const tabs = apiDefinition.map((tab,i) => {
      if(tab.open) {
        const tabTitle = (
          <div className='api-tab'>
            {tab.apiName} {' '}
            <DropdownButton
              bsSize="small"
              style={{
              borderColor: '#fff'
              }}
              id={'ddbtn-tab-' + i}
              title=""
            >
              <MenuItem eventKey="1" onClick={() => {this.deleteTab(i)}}>
                <i className="fa fa-trash" /> Delete API
              </MenuItem>
              <MenuItem eventKey="2"  onClick={()=>{this.updateApiIndex(i,apiDefinition[selectedApiIndex])}}>
                <i className="fa fa-i-cursor" /> Rename Tab
              </MenuItem>
              <MenuItem eventKey="3" onClick={() => {apiCloseHandler(i)}}>
                <i className="fa fa-close" /> Close Tab
              </MenuItem>
            </DropdownButton>
          </div>
        )
        return (
          <Tab
            key={i}
            title={tabTitle}
            eventKey={i}
          >
            <div className="panel panel-default">
              <div className="panel-body">
                <MainComponent
                setApiAccess={setApiAccess}
                apiDefinition={apiDefinition}
                selectedApiIndex={selectedApiIndex}
                testData={testData}
                handleEditParam={this.handleEditParam}
                onChangeApiDefinition={onChangeApiDefinition}
                onHandleTestButton={onHandleTestButton}
                apiParamToggleHandler={apiParamToggleHandler}
                onChangeTestData={onChangeTestData}
                exportConfigAsYaml={exportConfigAsYaml}
                dbUpdationHandler={dbUpdationHandler}
                showFormatSelector={true}
                />
              </div>
            </div>
           </Tab>
        )
      }
    })
    return (
      <div>
      <Tabs
        bsStyle="tabs"
        animation={true}
        activeKey={selectedApiIndex}
        onSelect={this.handleSelect}
        id='api-tabs'
      >
        {tabs}
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
        modalId='renameTabModal' modalHeader='Rename API' showModal={this.state.showRenameModal}
        modalContent={renameTabModalContent} saveChanges={this.renameTab}
        closeModal={this.closeModal}
      />
      </div>
    )
  }
}  
