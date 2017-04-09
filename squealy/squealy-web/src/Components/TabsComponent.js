import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { SplitButton, MenuItem, Button } from 'react-bootstrap'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ParamDefinitionModal from './ParamDefinitionModal'
import ValidationsModal from './ValidationsModal'
import ShareModal from './ShareModal'
import validationIcon from './../images/validation_icon_white.png'
import exportIcon from './../images/export_icon_white.png'


export default class TabsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamDefModal: false,
      showValidationsModal: false,
      showShareModal: false,
      note: null,
      transposeEnabled: false
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
    const {chart, filters, selectedFilterIndex, chartMode} = this.props
    const params = chartMode ? chart.parameters : filters[selectedFilterIndex].parameters
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
      if (runTest && this.props.chartMode) {
        this.props.onHandleTestButton()
      } else if (runTest) {
        this.props.onHandleTestFilterButton()
      }
    })
  }

  //Generic close Function which unset modal visibility and run the query.
  closeModal = (modalName) => {
    this.setState({[modalName]: false}, () => {
      if (this.props.chartMode) {
        this.props.onHandleTestButton()
      } else {
        this.props.onHandleTestFilterButton()
      }
    })
  }

  onChangeDatabase = (dbVal) => {
    if (this.props.chartMode) {
      this.props.selectedChartChangeHandler({database: (dbVal) ? dbVal.value : null})
    } else {
      this.props.selectedFilterChangeHandler({database: (dbVal) ? dbVal.value : null})
    }
  }

  onChangeTranspose = () => {
    this.props.selectedChartChangeHandler({transpose: !this.state.transposeEnabled},
    () => {
      this.setState({transposeEnabled: !this.state.transposeEnabled})
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
      chartMode,
      filters,
      onHandleTestFilterButton,
      selectedFilterChangeHandler,
      selectedFilterIndex
    } = this.props

    const {
      showValidationsModal,
      showParamDefModal,
      showShareModal
    } = this.state

    const filter = filters[selectedFilterIndex]
    let viewButton = {
      className: '',
      title: null,
      viewText: 'View',
      icon: <i className="fa fa-pencil"/>
    }
    const widget = chartMode ? chart : filter
    if (widget.can_edit) {
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
            {
              <SplitButton className="run-btn-group" bsStyle='success' title='Run' id='run-button' 
                onClick={() => this.checkParametersHandler(true)}>
                <MenuItem
                  eventKey='1'
                  onClick={()=>this.modalVisibilityHandler('showParamDefModal')}>
                    Parameter Definitions
                </MenuItem>
              </SplitButton>
            }
            {
              chartMode && 
              <Button
                bsStyle='primary'
                onClick={this.onChangeTranspose}
                className='tab-component'>
                {this.state.transposeEnabled && <i className='fa fa-check'/>}Transpose
              </Button>
            }
            { chartMode && 
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
            }
            <div className="selected-db-wrapper">
              <Select
                value={(widget.database) ? widget.database : null}
                options={databases}
                onChange={(db) => {this.onChangeDatabase(db)}}
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
                selectedFilterChangeHandler={selectedFilterChangeHandler}
                closeModal={() => this.closeModal('showParamDefModal')}
                showModal={this.state.showParamDefModal}
                parameters={chartMode ? chart.parameters : (filter.parameters || [])}
                note={this.state.note}
                chartMode={chartMode}
                filters={filters}
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
          </span>
        }
        {
          chartMode &&
          <Button bsStyle='primary'
            className={'tab-component view-btn '+viewButton.className} 
            title={viewButton.title}
            onClick={()=>updateViewMode(currentChartMode, widget.can_edit, chartMode)}>
            {viewButton.icon}
            {viewButton.viewText}
          </Button>
        }
      </div>
    )
  }
}
