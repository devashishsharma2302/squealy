import React, {Component, PropTypes} from 'react'
import Select from 'react-select'
import {Table} from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import {getApiRequest, postApiRequest} from '../Utils'
import {apiUriHostName} from '../Containers/MainContainer'

export default class DatabaseDescription extends Component {

  constructor (props) {
    super(props)
    this.state = {
      db: null,
      selectedDB: null,
      tables: [],
      selectedTable: null,
      schema: null
    }
  }

  componentWillMount() {
    getApiRequest(apiUriHostName+'/database-details/', null,
                   this.setDatabaseState, this.onError)
  }

  dbSelectionHandler = (value) => {
    if (value) {
      this.setState({selectedDB: value},() => {
          let payloadObj = {database: this.state.selectedDB}
          postApiRequest(apiUriHostName+'/database-details/', payloadObj,
                      this.setDatabaseState, this.onError)
      })
    } else {
      this.setState({
        selectedDB: null,
        tables: [],
        selectedTable: null,
        schema: null
      })
    }
  }

  setDatabaseState = (response) => {
    if (response.database) {
      this.setState({db: response.database})
    }
    else if(response.tables) {
      this.setState({tables: response.tables})
    }
    else if(response.schema) {
      this.setState({schema: response.schema})      
    }
  }


  onError = (error) => {
    console.error(error)
  }

  tableSelectionHandler = (value) => {
    this.setState({selectedTable: value},() => {
      let payloadObj = {database: this.state.selectedDB,
        table: this.state.selectedTable}
      postApiRequest(apiUriHostName+'/database-details/', payloadObj,
                   this.setDatabaseState, this.onError)
    })
  }

  render () {
    const tableInstance = this.state.schema ? (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Column Name</th>
            <th>Data Type</th>
          </tr>
        </thead>
        <tbody>{
        this.state.schema.map((data,i)=>{
          return (<tr>
            <td>{i+1}</td>
            <td>{data.column}</td>
            <td>{data.type}</td>
          </tr>)
        })}
        </tbody>
      </Table>
    ) : null
    return(
      <div className="database-selection-wrapper">
        <h2>Database Description: </h2>
        <Select
          name="db-select"
          options={this.state.db}
          value={this.state.selectedDB}
          onChange={this.dbSelectionHandler}
          placeholder='Select Database'
        />
        <Select
          name="entity-select"
          options={this.state.tables}
          onChange={this.tableSelectionHandler}
          value={this.state.selectedTable}
          placeholder='Select Table'
        />
        {tableInstance}
      </div>
    )
  }
}
