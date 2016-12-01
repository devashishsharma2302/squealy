import React, {Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {HidashModal} from './HidashUtilsComponents'
import { AVAILABLE_TRANSFORMATIONS } from '../Constant'
import { WithContext as ReactTags } from 'react-tag-input'
import $ from 'jquery'

export default class Transformations extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedMergedCol: null,
      selectedSplitCol: null
    }
  }

  selectedColumnChangeHandler = (value) => {
    if (value.length) {
      this.setState({selectedMergedCol: value})
    } else {
      this.setState({selectedSplitCol: value})
    }
  }


  handleAddition = (value) => {
    let transformationsLen = this.props.selectedApiDefinition.selectedTransformations.length,
      transformations = this.props.selectedApiDefinition.selectedTransformations.slice()
    let curTransformations = this.props.selectedApiDefinition.transformations.slice()

    if (value === 'merge') {
      $('#addMergedColumnModal').modal()
    } else if (value === 'split') {
      $('#addSplitColumnModal').modal()
    } else {
      curTransformations.push({name: 'transpose'})
    }

    transformations.push({
      id: transformationsLen + 1,
      text: value
    })
    this.setState({selectedMergedCol: null, selectedSplitCol: null})
    this.props.onChangeApiDefinition('selectedTransformations', transformations)
    this.props.onChangeApiDefinition('transformations', curTransformations)
  }

  handleDelete = (index) => {
    let transformations = this.props.selectedApiDefinition.selectedTransformations.slice()
    let curTransformations = this.props.selectedApiDefinition.transformations.slice()
    transformations.splice(index, 1)
    curTransformations.splice(index, 1)
    this.props.onChangeApiDefinition('selectedTransformations', transformations)
    this.props.onChangeApiDefinition('transformations', curTransformations)
  }

  handleDrag = (val, curPos, newPos) => {
    if (curPos !== newPos) {
      let transformations = this.props.selectedApiDefinition.selectedTransformations.slice()

      let curTransformations = this.props.selectedApiDefinition.transformations.slice(),
        draggableTransformation = curTransformations[curPos]

      transformations.splice(curPos, 1);
      transformations.splice(newPos, 0, val);

      curTransformations.splice(curPos, 1);
      curTransformations.splice(newPos, 0, draggableTransformation)

      this.props.onChangeApiDefinition('selectedTransformations', transformations)
      this.props.onChangeApiDefinition('transformations', curTransformations)
    }
  }

  saveSplitColumnHandler = () => {
    let splitTransformationObj = {
        name: 'split',
        kwargs: {
          pivot_column: this.state.selectedSplitCol.value
        }
      }
    let curTransformations = this.props.selectedApiDefinition.transformations.slice()
    curTransformations.push(splitTransformationObj)
    this.props.onChangeApiDefinition('transformations', curTransformations)
  }

  saveMergeColumnHandler = () => {
    let mergeTransformationObj = {
        name: 'merge',
        kwargs: {
          columns_to_merge: [],
          new_column_name: this.refs.mergedColumnName.value
        }
      }

    let tempMergedColumnArr = this.state.selectedMergedCol,
      newMergedColumnArr = []

    tempMergedColumnArr.map((data) => {
      newMergedColumnArr.push(data.value)
    })
    mergeTransformationObj.kwargs.columns_to_merge = newMergedColumnArr
    let curTransformations = this.props.selectedApiDefinition.transformations.slice()
    curTransformations.push(mergeTransformationObj)
    this.props.onChangeApiDefinition('transformations', curTransformations)
  }


  render () {
    const {selectedApiDefinition, apiResponse} = this.props

    let columnOptions = []

    if (apiResponse.hasOwnProperty('apiResponse') && apiResponse.apiResponse.columns) {
      let columnData = apiResponse.apiResponse.columns
      columnData.map((column) => {
        columnOptions.push({label: column.name, value: column.name})
      })
    }


    let splitColumnModal =
      <div className="row">
        <label className="col-md-3">Pivot Column</label>
        <div className="col-md-7">
          <Select
            name="form-column-split"
            options={columnOptions}
            value={this.state.selectedSplitCol}
            placeholder='Select Column name to Split'
            onChange={this.selectedColumnChangeHandler}
          />
        </div>
      </div>

    let mergeColumnModal =
      <div className="merged-column-content">
        <div className="row">
          <label className="col-md-3">Column to Merge</label>
          <div className="col-md-7">
            <Select
              name="form-column-merge"
              options={columnOptions}
              multi={true}
              value={this.state.selectedMergedCol}
              placeholder='Select Column name to Merge'
              onChange={this.selectedColumnChangeHandler}
            /></div>
        </div>
        <div className="row">
          <label className="col-md-3">Merged Column Name</label>
          <input
            type="text"
            name="mergedColumnName"
            ref="mergedColumnName"
            className="col-md-7 merged-column"/>
        </div>
      </div>

    return(
      <div>
        <div className='transformations-wrapper'>
          <div className='transformations-select'>
            <ReactTags
              tags={selectedApiDefinition.selectedTransformations}
              suggestions={AVAILABLE_TRANSFORMATIONS}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              placeholder='Type transformation names' />
            <p className="help-text">
              <span>Transformation Options: </span>transpose/ merge/ split</p>
          </div>
        </div>
        <HidashModal
          modalId='addMergedColumnModal'
          modalHeader='Merge Column'
          modalContent={mergeColumnModal}
          saveChanges={this.saveMergeColumnHandler}/>

        <HidashModal
          modalId='addSplitColumnModal'
          modalHeader='Split Column'
          modalContent={splitColumnModal}
          saveChanges={this.saveSplitColumnHandler}/>

      </div>
    )
  }
}
