import React, {Component} from 'react'
import Select from 'react-select'
import {Modal} from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import {HidashModal} from './HidashUtilsComponents'
import { AVAILABLE_TRANSFORMATIONS } from '../Constant'
import { WithContext as ReactTags } from './ReactTags/ReactTags'

export default class Transformations extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedMergedCol: null,
      selectedSplitCol: null,
      showMergeModal: false,
      showSplitModal: false
    }
  }

  selectedColumnChangeHandler = (value, type) => {
    if (type === 'split') {
      this.setState({selectedSplitCol: value})
    } else if (type === 'merge') {
      this.setState({selectedMergedCol: value})
    }
  }

  handleAddition = (value) => {
    let transformationsLen = this.props.selectedApiDefinition.selectedTransformations.length,
        transformationTags = this.props.selectedApiDefinition.selectedTransformations.slice(),
        transformations = this.props.selectedApiDefinition.transformations.slice()

    if (value === 'merge') {
      this.setState({showMergeModal: true})
    }
    else if (value === 'split') {
      this.setState({showSplitModal: true})
    }
    else {
      transformations.push({name: value})
      transformationTags.push({
      id: transformationsLen + 1,
      text: value
      })
      this.props.onChangeApiDefinition('selectedTransformations', transformationTags)
      this.props.onChangeApiDefinition('transformations', transformations)
    }
    this.setState({selectedMergedCol: null, selectedSplitCol: null})
    
  }

  handleDelete = (index) => {
    let transformationTags = this.props.selectedApiDefinition.selectedTransformations.slice(),
        transformations = this.props.selectedApiDefinition.transformations.slice()
    
    transformationTags.splice(index, 1)
    transformations.splice(index, 1)
    this.props.onChangeApiDefinition('selectedTransformations', transformationTags)
    this.props.onChangeApiDefinition('transformations', transformations)
  }

  handleDrag = (val, curPos, newPos) => {
    if (curPos !== newPos) {
      let transformationTags = this.props.selectedApiDefinition.selectedTransformations.slice(),
          transformations = this.props.selectedApiDefinition.transformations.slice(),
          draggableTransformation = transformations[curPos]

      transformationTags.splice(curPos, 1);
      transformationTags.splice(newPos, 0, val);

      transformations.splice(curPos, 1);
      transformations.splice(newPos, 0, draggableTransformation)

      this.props.onChangeApiDefinition('selectedTransformations', transformationTags)
      this.props.onChangeApiDefinition('transformations', transformations)
    }
  }

  closeSplitModal = () => {
    this.setState({ showSplitModal: false })
  }

  closeMergeModal = () => {
    this.setState({ showMergeModal: false })
  }

  saveSplitColumnHandler = () => {
    let splitTransformationObj = {
          name: 'split',
          kwargs: {
            pivot_column: this.state.selectedSplitCol.value
          }
        },
        curTransformations = this.props.selectedApiDefinition.transformations.slice(),
        transformationsLen = this.props.selectedApiDefinition.selectedTransformations.length,
        transformationTags = this.props.selectedApiDefinition.selectedTransformations.slice()
    
    curTransformations.push(splitTransformationObj)
    transformationTags.push({
      id: transformationsLen + 1,
      text: 'split ('+this.state.selectedSplitCol.value+')'
    })
    this.props.onChangeApiDefinition('selectedTransformations', transformationTags)
    this.props.onChangeApiDefinition('transformations', curTransformations)
    this.setState({showSplitModal: false})
    }

  saveMergeColumnHandler = () => {
    let mergeTransformationObj = {
          name: 'merge',
          kwargs: {
            columns_to_merge: [],
            new_column_name: this.refs.mergedColumnName.value
          }
        },
        tempMergedColumnArr = this.state.selectedMergedCol,
    
    newMergedColumnArr = []

    tempMergedColumnArr.map((data) => {
      newMergedColumnArr.push(data.value)
    })
    mergeTransformationObj.kwargs.columns_to_merge = newMergedColumnArr
    
    let transformations = this.props.selectedApiDefinition.transformations.slice(),
        transformationsLen = this.props.selectedApiDefinition.selectedTransformations.length,
        transformationTags = this.props.selectedApiDefinition.selectedTransformations.slice()
    
    transformations.push(mergeTransformationObj)
    
    transformationTags.push({
      id: transformationsLen + 1,
      text: 'merge ('+newMergedColumnArr+')'
    })
    this.props.onChangeApiDefinition('selectedTransformations', transformationTags)
    this.props.onChangeApiDefinition('transformations', transformations)
    this.setState({showMergeModal: false})
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
            onChange={(value) => this.selectedColumnChangeHandler(value, 'split')}
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
              onChange={(value) => this.selectedColumnChangeHandler(value, 'merge')}
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
              autocomplete={true}
              minQueryLength={0}
              suggestions={AVAILABLE_TRANSFORMATIONS}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              placeholder='Type transformation names' />
          </div>
        </div>
        <Modal show={this.state.showMergeModal} onHide={this.closeMergeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Merge Column</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {mergeColumnModal}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.closeMergeModal} className="btn btn-default">Close</button>
              <button onClick={this.saveMergeColumnHandler} className="btn btn-info">Save</button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.showSplitModal} onHide={this.closeSplitModal}>
            <Modal.Header closeButton>
              <Modal.Title>Split Column</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {splitColumnModal}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.closeSplitModal} className="btn btn-default">Close</button>
              <button onClick={this.saveSplitColumnHandler} className="btn btn-info">Save</button>
            </Modal.Footer>
          </Modal>
      </div>
    )
  }
}
