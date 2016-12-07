import { YAML_INDENTATION, RESPONSE_FORMATS } from './Constant'
import FileSaver from 'filesaver.js-npm'
import jsyaml from 'js-yaml'
/*!*************************************************************************
[Utils.js]
*****************************************************************************/
/* global define */
/**
 * Defines all the types necessary for making api calls.
 * module src/Utils
 */

/**
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
export function postApiRequest(uri, data, onSuccessCallback,
                               onFailureCallback, callbackParmas) {
  data = jsonStringfy(data)
  postData(uri, data, 'POST', onSuccessCallback, onFailureCallback, callbackParmas)
}

/**
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
export function getApiRequest(uri, id, onSuccessCallback, onFailureCallback,
                              interval) {
  postData(uri, id, 'GET', onSuccessCallback, onFailureCallback, interval)
}

/**
 * description: converts a JavaScript value to a JSON string
 * @module Utils
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 */
function jsonStringfy(data) {
  return JSON.stringify(data)
}

/**
 * description: Ajax call for post/get api
 * Created a method to be called to get the data and
 * stop the interval once the promise is resolved and user receives the data
 * @module Utils
 * @params {String} Url - Provides the post url
 * @params {Object} data - The object that represents the contents of the
 * request being sent
 * @params {String} methodType - Defines type of request to be made
 * @params {Function} onSuccess - Success callback function
 * @params {Function} onFailure - Failure callback function
 * TODO: Need to add a callback function on success and failure
 */
function postData(uri, data, methodType, onSuccess, onFailure, callbackParmas=null) {
  const csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    }
  });
  $.ajax({
    url: uri,
    method: methodType,
    contentType: 'application/json',
    data: data,
    success: function (response) {
      if (onSuccess) {
        if(callbackParmas){
          onSuccess(response, callbackParmas)
        }else {
          onSuccess(response)
        }

      }
    },

    error: function (error) {
      if (onFailure) {
        onFailure(error)
      }
    }
  })
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


export function getEmptyApiDefinition() {
  return {
    apiName: 'Untitled API 0',
    open: true,
    urlName: '',
    sqlQuery: '',
    paramDefinition: [],
    validations: [],
    transformations: [],
    selectedTransformations: [],
    columns: {},
    selectedDB: null
  }
}

export function getDefaultApiDefinition(apiIndex) {
  return {
    apiName: `Untitled API ${apiIndex}`,
    open: true,
    urlName: '',
    sqlQuery: '',
    paramDefinition: [],
    validations: [],
    transformations: [],
    selectedTransformations: [],
    columns: {},
    selectedDB: null
  }
}

export function getEmptyTestData() {
  return {
    apiSuccess: false,
    apiError: false,
    apiResponse: [],
    apiParams: {},
    selectedFormat: RESPONSE_FORMATS.table.value
  }
}

/**
 * [objectToYaml: covert json object to yaml]
 * /
 * @param  {[object]} obj [provide api definition]
 * @return {[yaml]}     [return api definition as yaml]
 */
export function objectToYaml(obj) {
  return jsyaml.dump(obj, {indent: YAML_INDENTATION})
}

/**
 * [YamlFileToJsonObj: Read data from file and covert yaml to json object]
 * /
 * @param {[file]} fileName [provide yaml file name that we need to convert as JSON object]
 * @param {[object]}  [return file data as json object]
 */
export function YamlFileToJsonObj(fileName) {
  return jsyaml.load(fileName)
}

/**
 * [yamlObjToJson convert yaml to json objcet ]
 * @param  {yaml} yaml [yaml object that we need to convert as json object]
 * @return {object}      [return data as json object]
 */
export function yamlObjToJson(yaml) {
  return jsyaml.load(yaml)
}

/**
 * [exportFile write data in a file and save it on local disk]
 * @param  {string/object/yaml} data        [provides the data that we need to write in file]
 * @param  {[string]} contentType [data type]
 * @param  {[string]} fileName    [name of the file that we are writing]
 */
export function exportFile(data, contentType) {
  let blob = new Blob([], {type: contentType})
  for (let index in data) {
      blob = new Blob([blob,  '---\n', formatApiDataToYaml(data[index],index), '\n\n'], {type: contentType})
  }
  return blob
}

export function saveBlobToFile(data, file) {
  FileSaver.saveAs(data, file)
}

export function setDataInLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}


export function preProcessResponse(response) {
  let processedResponse = {data: [], columns: []}
  response.columns.map((column) => {
    processedResponse.columns.push({
      accessor: column.name,
      header: column.name
    })
  })
  response.data.map((row) => {
    let processedRow = {sortable: false}
    processedResponse.columns.map((column, index) => {
      processedRow[column.accessor] = row[index]
    })
    processedResponse.data.push(processedRow)
  })
  return processedResponse
}


function formatApiDataToYaml(data, index) {
  let formattedData = {
    'id': data.apiName,
    'name': data.apiName,
    'url': data.urlName,
    'parameters': data.paramDefinition,
    // 'access_control':data.access_control,
    'validations': data.validations,
    'query': data.sqlQuery,
    'transformations': data.transformations,
    'format': data.format
  }
  if(data.columns) {
    formattedData.columns = data.columns
  }
  return jsyaml.dump(formattedData, {indent: YAML_INDENTATION})
}

// The following function loads the google charts JS files
export function googleChartLoader(version, packages) {
  var options = {
    dataType: 'script',
    cache: true,
    url: 'https://www.gstatic.com/charts/loader.js',
  };
  jQuery.ajax(options).done(function(){
    google.charts.load(version || 'current', {
      packages: packages || ['corechart']
    });
  });
}


function execRegexGroupedMulValues(regex, text, result) {
  let match = regex.exec(text),
    newResult = result.slice()

  while (match !== null) {
    if (newResult.indexOf(match[1]) === -1) {
      newResult.push(match[1])
    }
    match = regex.exec(text)
  }

  return newResult
}



export function fetchApiParamsFromQuery(text) {
  let regExpForParams = /{{\s*params\.([^\s}%]+)\s*}}/g,
      regExpForExp = /{%[^(%})]*params\.([^\s}%]+)[^({%)]*%}/g,
      paramsArray = []


  paramsArray = execRegexGroupedMulValues(regExpForParams, text, paramsArray)
  paramsArray = execRegexGroupedMulValues(regExpForExp, text, paramsArray)

  return paramsArray
}

export function fetchSessionParamsFromQuery(text) {
  let regExpForParams = /{{\s*user\.([^\s}%]+)\s*}}/g,
      regExpForExp = /{%[^(%})]*user\.([^\s}%]+)[^({%)]*%}/g,
      paramsArray = []


  paramsArray = execRegexGroupedMulValues(regExpForParams, text, paramsArray)
  paramsArray = execRegexGroupedMulValues(regExpForExp, text, paramsArray)

  return paramsArray
}
