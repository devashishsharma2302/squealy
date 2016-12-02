import React, {Component} from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import ApiParamsDefinition from './ApiParamsDefinition'

export default class ApiParams extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiParamString: '',
      accordionHeaderIcon: 'fa-caret-right'
    }
  }

  handleAccordionFadeIn = () => {
    this.setState({apiParamString: '', accordionHeaderIcon: 'fa-caret-down'})
  }

  componentWillMount () {
    let paramString = ''
    let paramLengthIndex = this.props.selectedApiDefinition.paramDefinition.length-1
    this.props.selectedApiDefinition.paramDefinition.map((params, index) => {
      paramString += params.name
      index != paramLengthIndex ? paramString += ',' : null
    })
    this.setState({apiParamString: paramString})
  }

  handleAccordionFadeOut = () => {
    let paramNameArray = []
    let paramDefinition = this.props.selectedApiDefinition.paramDefinition.slice()
    for (let param in paramDefinition) {
      paramNameArray.push(paramDefinition[param].name)
    }
    this.setState({
      apiParamString: paramNameArray.toString(),
      accordionHeaderIcon: 'fa-caret-right'
    })
  }

  render () {
    const {
      selectedApiIndex,
      onChangeApiDefinition,
      selectedApiDefinition,
      handleEditParam
    } = this.props

    const AccordionHeader = (
      <div className='accordion-header'>
        <div>
          <h2 className="param-heading">Parameters: </h2>
          <span>{this.state.apiParamString}</span>
            <i className={'fa fa-2x param-heading-icon ' + this.state.accordionHeaderIcon}>
            </i>
          </div>
        </div>
      )
    return (
      <div className="param-definition-section">
        <Accordion>
          <Panel 
            bsClass="param-def-panel"
            onEnter={this.handleAccordionFadeIn}
            onExit={this.handleAccordionFadeOut}
            header={AccordionHeader} eventKey="1">
            <ApiParamsDefinition
              handleEditParam={handleEditParam}
              selectedApiDefinition={selectedApiDefinition}
              onChangeApiDefinition={onChangeApiDefinition}
            />
         </Panel>
        </Accordion>
      </div>
    )
  }
}
