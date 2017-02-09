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
      </div>
    )
  }
}
