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
                      value={key}
                      checked={key===selectedFormat}
                      onClick={(e) =>
                      apiResponseGetter(e, key)} />
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
