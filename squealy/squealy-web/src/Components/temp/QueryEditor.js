import React, {Component} from 'react'
import AccordionTab from './AccordionTab'

export default class QueryEditor extends Component {
  render() {
    return (
    	<AccordionTab heading='Query'>
    	<textarea rows='10' cols='80'/>
    	</AccordionTab>
    )
  }
}
