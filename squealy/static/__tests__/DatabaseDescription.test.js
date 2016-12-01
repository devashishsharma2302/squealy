import React from 'react'
import { mount, shallow } from 'enzyme'
global.$ = require('jquery');


import DatabaseDescription from '../src/Components/DatabaseDescription'

describe('Tests the DatabaseDescription component', () => {
  const component = shallow(
        <DatabaseDescription/>
        )
  let db = [{value: 'db1', label: 'db1'}]
  let table = [{value: 'table1', label: 'table1'},{value: 'table2', label: 'table2'}]
  let colMetadata = [{column:'id', type: 'int'},{column:'name', type: 'string'}]
  
  it('Tests the database selection and reset', () => {
    //Check if database is selected
    component.setState({db: db})
    component.find('Select').first().simulate('change',db[0])
    expect(component.state('selectedDB').label).toBe('db1')

    //Check if selected database is reset
    component.find('Select').first().simulate('change',null)
    expect(component.state('selectedDB')).toBe(null)
    })
  
  it('Tests the Table options selection and reset', () => {
    //Check if table is selected
    component.setState({tables: table})
    component.find('Select').at(1).simulate('change', table[0])
    expect(component.state('selectedTable')).toBe(table[0])
    
    //reset selected table
    component.find('Select').at(1).simulate('change', null)
    expect(component.state('selectedTable')).toBe(null)
    })

   it('Test if schema table is rendered on state change', () => {
    //Check if schema table visible 
    expect(component.find('Table').length).toBe(0)
    component.setState({schema: colMetadata})
    //check if table rendered after setting state 
    expect(component.find('Table').length).toBe(1)

    
    })

})
