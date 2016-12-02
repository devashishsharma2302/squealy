import React, {Component} from 'react'
import { RESPONSE_FORMATS } from '../Constant'

export default class FormatSelector extends Component {
  render () {
    const { selectedFormat, apiResponseGetter, selectedApiIndex} = this.props
    return (
            <div>
            <form>
            {
              Object.keys(RESPONSE_FORMATS).map(function(key){
                return(
                  <label className="radio-inline" key={key}>
                    <input type="radio" 
                      name={'optradio_'+selectedApiIndex}
                      value={RESPONSE_FORMATS[key].value}
                      checked={RESPONSE_FORMATS[key].value===selectedFormat}
                      onClick={(e) =>
                      apiResponseGetter(e, RESPONSE_FORMATS[key].value)} />
                    {RESPONSE_FORMATS[key].displayName}
                  </label>
                )
              })
            }
            </form>
            </div>
    )
  }
}
