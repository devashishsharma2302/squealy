import React, {Component} from 'react'

export default class ResponseTable extends Component {
  render() {
  	const {response} = this.props
  	const rows = response.data.map((row, index) =>
      <tr key={index}>
        {row.map((entry, index) => 
          <td key={index}>{entry}</td>
        )}
      </tr>
    )

    return (
    	<div className='response-section'>
        <div id="response-table">
          <table className="table">
            <thead>
              <tr>
                {response.columns.map((column, index)=>
                  <th key={index}>{column.name}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(response.data.length !== 0)?
                rows
              :
                <tr>
                  <th
                    style={{textAlign: 'center'}}
                    colSpan="4"
                  >
                    No Results
                  </th>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
