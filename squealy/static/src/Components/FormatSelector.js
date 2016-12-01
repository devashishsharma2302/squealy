import React, {Component} from 'react'
import { RESPONSE_FORMATS } from '../Constant'

export default class FormatSelector extends Component {
  render () {
    const { selectedFormat, apiResponseGetter } = this.props
    return (
            <div>
            {
              Object.keys(RESPONSE_FORMATS).map(function(key){
                return(
                  <label className="radio-inline" key={key}>
                    <input type="radio" name="optradio"
                      checked={(selectedFormat===RESPONSE_FORMATS[key].value)}
                      onClick={(e) =>
                      apiResponseGetter(e, RESPONSE_FORMATS[key].value)} />
                    {RESPONSE_FORMATS[key].displayName}
                  </label>
                )
              })
            }
            </div>
    )
  }
}
