import React, {Component} from 'react'
import MainComponent from './MainComponent'
import { DropdownButton, MenuItem, Tab, Tabs } from 'react-bootstrap'
import Modal from '../Components/ParamDefinitionModalWrapper'
import {HidashModal} from './HidashUtilsComponents'


export default class ApiTabsToggle extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      editParam:false,
      paramIndex:-1,
      selectedApiParamDef: null
    }
  }

  currentApiIndex = 0
  
  handleEditParam = (bool, index) => {
    this.setState({editParam: bool, paramIndex:index})
    let selectedApiParamDef = this.props.apiDefinition[this.props.selectedApiIndex].paramDefinition
    this.setState({selectedApiParamDef: selectedApiParamDef[index]})
  }

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

  updateApiIndex = (index, selectedApi) => {
    this.refs.apiName.value = selectedApi.apiName.includes('Untitled API') ? '' : selectedApi.apiName
    this.currentApiIndex = index
  }

  renameTab = () => {
    this.props.apiTabRenameHandler(this.refs.apiName.value, this.currentApiIndex)
  }

  render() {
    const {
      onHandleTestButton,
      onChangeApiDefinition,
      apiDefinition,
      selectedApiIndex,
      testData,
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
            {tab.apiName.includes('Untitled API') ? `Untitled API ${i}` : tab.apiName} {' '}
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
              <MenuItem eventKey="2" data-toggle="modal" 
                data-target={'#renameTabModal'} onClick={()=>{this.updateApiIndex(i, apiDefinition[selectedApiIndex])}}>
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
        <Tab id='add_tab_btn'
          style={{
            borderColor: '#fff'
            }}
          title={
            <div>
              <i className="fa fa-plus tab-plus-icon" />&nbsp;
            </div>}
          eventKey="add_tab"
        />
      </Tabs>
      <Modal editParamState={this.state} handleEditParam={this.handleEditParam} selectedApiDefinition={this.props.apiDefinition[this.props.selectedApiIndex]}
        onChangeApiDefinition={this.props.onChangeApiDefinition}
      />
      <HidashModal
        modalId='renameTabModal' modalHeader='Rename API' 
        modalContent={renameTabModalContent} saveChanges={this.renameTab}
      />
      </div>
    )
  }
}  
