import React, {Component} from 'react'
import {Accordion, Panel} from 'react-bootstrap'

export default class AccordionTab extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      accordionHeaderIcon: 'fa-angle-down'
    }
  }

  handleAccordionFadeOut = () => {
    this.setState({
      accordionHeaderIcon: 'fa-angle-right'
    })
  }

  handleAccordionFadeIn = () => {
    this.setState({accordionHeaderIcon: 'fa-angle-down'})
  }

  render() {
    const {heading} = this.props

  	const AccordionHeader = (
      <div className='accordion-header'>
        <div>
          <h2 className="param-heading">{heading}</h2>
            <i className={'fa fa-2x param-heading-icon ' + this.state.accordionHeaderIcon} />
        </div>
      </div>)
    return (
      <Accordion>
          <Panel 
            bsClass="param-def-panel"
            header={AccordionHeader}
            defaultExpanded={true}
            onEnter={this.handleAccordionFadeIn}
            onExit={this.handleAccordionFadeOut}
            >
            <div>{this.props.children}</div>
         </Panel>
      </Accordion>
    )
  }
}
