import React, {Component} from 'react'
import Select from 'react-select'
import Datetime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'
import {DATE_FORMAT, DATETIME_FORMAT, DOMAIN_NAME} from './../Constant'


export class SquealyDatePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler,
      className,
      name,
      format
    } = this.props
    return(
      <Datetime
        key={'date_picker_'+name}
        defaultValue={value}
        timeFormat={false}
        className={className}
        dateFormat={format ? format : DATE_FORMAT}
        onChange={
          (value)=>onChangeHandler(name, value.format(format ? format : DATE_FORMAT))}
      />
    )
  }
}

export class SquealyDatetimePicker extends Component {
  render() {
    const {
      value,
      onChangeHandler,
      className,
      name,
      format
    } = this.props
    return(
      <Datetime
        defaultValue={value}
        className={className}
        onChange={
          (val)=>onChangeHandler(name, val.format(DATETIME_FORMAT))}
      />
    )
  }
}

export class SquealyDropdownFilter extends Component {
  render() {
    const {
      value,
      onChangeHandler,
      filterData,
      name,
      className
    } = this.props
    return(
      <select
        className={className}
        value={value}
        onChange={(e) => onChangeHandler(name, e.target.value)}
      >
        {
          filterData.data.length ?
          filterData.data.map((option, i) => {
            return (
              <option key={'dropdown_'+i} value={option.value}>{option.label}</option>
            )
          })
          :
          null
        }
      </select>
    )
  }
}

export class SquealyInput extends Component {
  render() {
    const {value, onChangeHandler, className, name} = this.props
    return(
      <input
        defaultValue={value}
        className={className}
        type="text"
        onBlur={(e) => onChangeHandler(name, e.target.value)}
      />
    )
  }
}