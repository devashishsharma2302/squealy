import React, { Component } from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { SquealyModal } from './SquealyUtilsComponents'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'


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


  showHelpModalOnClick = () => {
    this.setState({ showHelpModal: true })
  }

  close = () => {
    this.setState({ showModal: false })
  }
  showModalInWindow = (event) => {
    console.log(event)
    let e = event
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation()
    console.log('hey guys')
    this.setState({ showModal: true })
  }

  testFunction = () => {
    console.log('hello')
  }

  render() {

    const codeLine1 = 'SELECT project, timesheet, hours FROM timesheet WHERE start_date = {{ params.start_date }}'
    const codeLine2 = 'SELECT project, timesheet, hours FROM timesheet WHERE start_date = {{ params.start_date }} \n {% if params.project_id %} \n AND project_id = {{ params.project_id }} \n {% endif %}'
    const codeLine3 = `{% macro dates(date1, date2) -%}
   between {{ date1 }} and {{ date2 }}
{%- endmacro  %}

select
{% if params.project_id == "HIN-HWAY-DEL" %}
   CONCAT(u.first_name, " ", u.last_name) as "Resource",a.name as "Type", sum(b.hrs) as "Time Spent"
   from(
       select *
       from timesheet_timesheet
       where project_code={{params.project_id}}  and day {{ dates(params.start_date, params.end_date) }}
   ) b
   join timesheet_timesheettype a on a.id=b.type_id
   join auth_user u on u.id=b.owner_id
   group by u.username,a.name
{% else %}
   5
{% endif %}`

    const desciptionCodeLine1 = 'These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted These are the things that have to be adjusted '
    const line2 = '{{ params.start_date }} is the variable that is being passed in the query . As soon as you write the query, an entry with name "start_date" is created in "parameter defination modal" . You can edit the defination of the entry and change the diffrent properties of the entry'
    const line1 = 'To pass a variable in a query , you should place a variable in {{ }}'
    const line3 = 'Squealy uses Jinja2 Templating Engine which allows us to use {% if %} tag and {% for %} tag'
    const line4 = 'Jinja2 also provides a feature of adding a macro , that can also be extensivly used .'
    const helpContent = (
      <div className="helpContainer">
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={codeLine1}
            wrapEnabled={true}
            width="50%"
            height="auto"
            fontSize={15}
            readOnly={true}
            />
          <div className="helpDescrition">
            <ul>
              <li><p>{line1}</p></li>
              <li><p>{line2}</p></li>
            </ul>
          </div>
        </div>
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={codeLine2}
            wrapEnabled={true}
            fontSize={15}
            width="50%"
            height="auto"
            readOnly={true}
            />
          <div className="helpDescrition">
            <ul>
              <li><p> {line3}</p></li>
            </ul>

          </div>
        </div>
        <div className="codeDescriptionContainer">
          <AceEditor
            mode="sql"
            theme="tomorrow"
            onChange={this.testFunction}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={codeLine3}
            wrapEnabled={true}
            width="50%"
            fontSize={15}
            height="auto"
            readOnly={true}
            />
          <div className="helpDescrition">
            <ul>
              <li><p>{line4}</p></li>
            </ul>
          </div>
        </div>
      </div>
    )
    const {heading} = this.props

    const newColor = 'red'
    const AccordionHeader = (
      <div className='accordion-header'>
        <div>
          {
            (heading === 'Query')
              ? <h2 className="param-heading">{heading}<a><i className="fa fa-question-circle" onClick={this.showModalInWindow}></i></a></h2>
              : <h2 className="param-heading">{heading}</h2>

          }
          <i className={'fa fa-2x param-heading-icon ' + this.state.accordionHeaderIcon} />

          <SquealyModal modalHeader={"This is help text"}
            modalId={1}
            modalContent={helpContent}
            showModal={this.state.showModal}
            modalSize={"large"}
            closeModal={this.close}
            dialogClassName={"helpModal"}
            noFooter={null}
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
