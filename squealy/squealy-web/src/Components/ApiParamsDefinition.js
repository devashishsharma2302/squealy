import React, {Component} from 'react'


export default class ApiParamsDefinition extends Component {
  //Reset Input field every time open modal to add new params
  resetParams = () => {
    document.getElementById('varName').value = ''
    if (document.getElementById('customParamPath')) {
      document.getElementById('customParamPath').value = ''
    }
    document.getElementById('optional').value = false
    document.getElementById('defaultValues').values = ''
    document.getElementById('params_type').selectedIndex = 0
    document.getElementById('selectedValueFormat').value = ''
  }

  //Common function to delete parameter definition and validation
  deleteEntry = (index, fieldName) => {
    let curdata = this.props.selectedApiDefinition[fieldName].slice()
    curdata.splice(index, 1)
    this.props.onChangeApiDefinition(fieldName, curdata)
  }

  render () {
    const {selectedApiDefinition, onChangeApiDefinition, handleEditParam} = this.props
    let paramDefinition = selectedApiDefinition.paramDefinition,
      validations = selectedApiDefinition.validations
    
    return (
      <div className="api-param-def-wrapper">
        <table className="table table-hover api-param-def-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Format</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              paramDefinition.length ? 
                paramDefinition.map((param, i) => {
                  return (
                    <tr key={'param_row_'+i}>
                      <td onClick={() => handleEditParam(true, i)} 
                        data-toggle="modal" data-target={'#addParamsModal'} className='param-name'>{param.name}</td>
                      <td>{param.type}</td>
                      <td><i className="fa fa-trash-o" aria-hidden="true" onClick={() =>this.deleteEntry(i, 'paramDefinition')}/></td>
                    </tr> 
                  )
                })
              : null
            }
          </tbody>
          <tfoot>
            <tr>
              <td>
                <button type="button" className="btn btn-info" data-toggle="modal" 
                data-target={'#addParamsModal'} onClick={this.resetParams}>Add</button>
              </td>
              <td>
                <button type="button" className="btn btn-default" data-toggle="modal" 
                  data-target={'#addValidationsModal'}>
                  Validations</button>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}
