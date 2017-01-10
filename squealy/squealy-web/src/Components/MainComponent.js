import React, {Component} from 'react'

import SideMenu from './SideMenu'
import { SQLEditor } from './SQLEditor'
import { MOCK_DATA, COLUMN_META_DATA } from './../mockData'
import { APIHeader } from './NavHeader'
import ApiParams from './ApiParamsComponent'
import FormatSelector from './FormatSelector'
import Transformations from './Transformations'
import UrlInputBox from './ApiUrlInputBox'
import ResponseSection from './ResponseSection'


export default class MainComponent extends Component {

  render () {
    const {
      onHandleTestButton,
      onChangeApiDefinition,
      apiDefinition,
      selectedApiIndex,
      testData,
      setApiAccess,
      apiDeletionHandler,
      apiAdditionHandler,
      apiSelectionHandler,
      exportConfigAsYaml,
      onChangeTestData,
      handleEditParam,
      dbUpdationHandler,
      showFormatSelector
    } = this.props
    let selectedAPIDefinition = apiDefinition[selectedApiIndex]
    let selectedTestData = testData[selectedApiIndex]
    return (
      <div className="row main-container">
        <div className="col-md-3">
          <SideMenu
            apiParams={selectedTestData.apiParams}
            onChangeTestData={onChangeTestData}
            setApiAccess={setApiAccess}
            selectedAPIDefinition={selectedAPIDefinition}
            dbUpdationHandler={dbUpdationHandler}
          />
        </div>
        <div className="col-md-9 editor-container">
          <UrlInputBox
              onChangeApiDefinition={onChangeApiDefinition}
              apiDefinition={apiDefinition}
              selectedApiIndex={selectedApiIndex}/>
          <ApiParams
            handleEditParam={handleEditParam}
            selectedApiDefinition={selectedAPIDefinition}
            selectedApiIndex={selectedApiIndex}
            onChangeTestData={onChangeTestData}
            onChangeApiDefinition={onChangeApiDefinition}
            apiParams={selectedTestData.apiParams}/>
          <SQLEditor
            onChangeApiDefinition={onChangeApiDefinition}
            sqlQuery={selectedAPIDefinition.sqlQuery}
            selectedApiIndex={selectedApiIndex}
            onChangeTestData={onChangeTestData}
            apiParams={selectedTestData.apiParams}/>
          <div className="api-section">
            <div className="api-btn-wrapper">
              <button onClick={(e) => onHandleTestButton(e)}
                      className="btn btn-info hidash-btn">
                Run Query
              </button>
            </div>
            <Transformations
              onChangeApiDefinition={onChangeApiDefinition}
              selectedApiDefinition={selectedAPIDefinition}
              apiResponse={selectedTestData}
            />
            {showFormatSelector?
            <div className="response-format">
              <FormatSelector
                selectedFormat={selectedTestData.selectedFormat}
                apiResponseGetter={onHandleTestButton}
                selectedApiIndex={selectedApiIndex}
                />
            </div>
            :
            null}
          </div>
          <ResponseSection
            selectedTestData={selectedTestData}
            selectedAPIDefinition={selectedAPIDefinition}
            onChangeApiDefinition={onChangeApiDefinition}
            selectedApiIndex={selectedApiIndex}/>
        </div>
      </div>
    )
  }
}
