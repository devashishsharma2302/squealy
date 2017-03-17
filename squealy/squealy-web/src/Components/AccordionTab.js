import React, { Component } from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { SquealyModal } from './SquealyUtilsComponents'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import JinjasqlDescription from './HelpModal'


export default class AccordionTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accordionHeaderIcon: 'fa-angle-down',
      showModal: false
    }
  }

  handleAccordionFadeOut = () => {
    this.setState({
      accordionHeaderIcon: 'fa-angle-right'
    })
  }

  handleAccordionFadeIn = () => {
    this.setState({ accordionHeaderIcon: 'fa-angle-down' })
  }

  closeHelpModal = () => {
    this.setState({ showModal: false })
  }

  showModalInWindow = (event) => {
    event.stopPropagation();
    this.setState({ showModal: true })
  }


  render() {
   
    const {heading} = this.props
    const AccordionHeader = (
      <div className='accordion-header'>
        <div>
          {
            (heading === 'Query')
              ? <h2 className="param-heading">{heading}
                  <i
                    className="fa fa-question-circle-o info-icon"
                    onClick={this.showModalInWindow}
                  />
                </h2>
              : <h2 className="param-heading">{heading}</h2>

          }
          <i className={'fa fa-2x param-heading-icon ' + this.state.accordionHeaderIcon} />
          <JinjasqlDescription 
            modalHeader={"Jinjasql usage guide"}
            modalId={1}
            showModal={this.state.showModal}
            modalSize={"large"}
            closeModal={this.closeHelpModal}
            dialogClassName={"helpModal"}
          />
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
