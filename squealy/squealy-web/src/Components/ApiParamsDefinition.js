import React, {Component} from 'react'
import ParamDefinitionModalWrapper from './ParamDefinitionModalWrapper'


export default class ApiParamsDefinition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showParamModal: false,
      showValidationModal: false,
      editParam:false,
      paramIndex:-1,
      selectedApiParamDef: null
    }
  }

  handleEditParam = (bool, index) => {
    this.setState({editParam: bool, paramIndex:index})
    let selectedApiParamDef = this.props.selectedApiDefinition.paramDefinition
    this.setState({selectedApiParamDef: selectedApiParamDef[index]})
  }

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

  toggleParamModalState = () => {
    let bool = !this.state.showParamModal
    this.setState({showParamModal: bool})
  }

  toggleValidationModalState = () => {
    let bool = !this.state.showValidationModal
    this.setState({showValidationModal: bool})
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
                      <td onClick={() => this.handleEditParam(true, i)} 
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
                 onClick={this.toggleParamModalState}>Add</button>
              </td>
              <td>
                <button type="button" className="btn btn-default" data-toggle="modal" 
                  onClick={this.toggleValidationModalState}>
                  Validations</button>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <ParamDefinitionModalWrapper 
          editParamState={this.state}
          selectedApiDefinition={selectedApiDefinition} 
          onChangeApiDefinition= {onChangeApiDefinition}
          handleEditParam={this.handleEditParam}
          closeParamModal={this.toggleParamModalState}
          closeValidationModal={this.toggleValidationModalState}
          showValidationModal={this.state.showValidationModal}
          showParamModal={this.state.showParamModal}
        />
      </div>
    )
  }
}
