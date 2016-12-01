import React, {Component} from 'react'

import SideMenu from './SideMenu'
import { SQLEditor } from './SQLEditor'
import { QueryResponseTable } from './ResponseTable'
import { MOCK_DATA, COLUMN_META_DATA } from './../mockData'
import { APIHeader } from './NavHeader'
import ApiParams from './ApiParamsComponent'
import FormatSelector from './FormatSelector'
import JSONViewer from './JSONViewer'
import Transformations from './Transformations'
import UrlInputBox from './ApiUrlInputBox'

const responseElementReferenceMap = {
  'JSON':  JSONViewer,
  'table': QueryResponseTable,
  'GoogleChartsFormatter': JSONViewer,
  'HighchartsFormatter': JSONViewer
}

export default class MainComponent extends Component {


  render () {
    const {
      onHandleTestButton,
      onChangeApiDefinition,
      apiDefinition,
      selectedApiIndex,
      testData,
      apiDeletionHandler,
      apiAdditionHandler,
      apiSelectionHandler,
      exportConfigAsYaml,
      onChangeTestData,
      handleEditParam
    } = this.props
    let selectedAPIDefinition = apiDefinition[selectedApiIndex]

    let selectedTestData = testData[selectedApiIndex], responseElem

    //if data is not present, don't show response section. show sql editor full page.
    if (selectedTestData.apiSuccess) {
      //Gets the reference of the response element to be rendered
      const ReponseElementReference = responseElementReferenceMap[selectedTestData.selectedFormat]
      responseElem =
            <div>
              <h2>Results: </h2>
              <ReponseElementReference
                response={selectedTestData.apiResponse}
                columnDefinition={selectedAPIDefinition.columns}
                onChangeApiDefinition={onChangeApiDefinition}
              />
            </div>
    } else if (selectedTestData.apiError) {
      responseElem =
      <div className="alert alert-danger query-error-section">
        <h2>Results: </h2>
        <strong>Error Occured!</strong>
        {selectedTestData.apiResponse.error}
      </div>
    }
    return (
      <div className="row main-container">
        <div className="col-md-3">
          <SideMenu
            apiParams={selectedTestData.apiParams}
            onChangeTestData={onChangeTestData}
            selectedApiDefinition={selectedAPIDefinition}
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
            />
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
            <div className="response-format">
              <FormatSelector selectedFormat={selectedTestData.selectedFormat}
                apiResponseGetter={onHandleTestButton} />
            </div>
          </div>
          <div className="response-section">
            {responseElem}
          </div>
        </div>
      </div>
    )
  }
}
