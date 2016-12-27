export const SIDE_BAR_WIDTH = '21%'
export const YAML_INDENTATION = 4
export const YAML_CONTENT_TYPE = 'application/yaml'
export const RESPONSE_FORMATS = {

// the formatter class is the class name that is to be exported to yaml file.
  table: {
    displayName: 'Table',
    formatter: 'table'
  },
  json: {
    displayName: 'JSON',
    formatter: 'json'
  },
  GoogleChartsFormatter: {
    displayName: 'Google Charts',
    formatter: 'GoogleChartsFormatter'
  },
  HighchartsFormatter: {
    displayName: 'Highchart',
    formatter: 'HighchartsFormatter'
  }
}

export const PARAM_FORMAT_OPTIONS = [
  {
    label: 'DateTime',
    value: 'dateTime'
  }, {
    label: 'String',
    value: 'string'
  }, {
    label: 'Date',
    value: 'date'
  }, {
    label: 'Number',
    value: 'number'
  }
]

export const AVAILABLE_TRANSFORMATIONS = ['transpose', 'merge', 'split']

export const GRID_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const GOOGLE_CHART_TYPE_OPTIONS = [
  {label: 'Table', value: 'Table'},
  {label: 'Line', value: 'LineChart'},
  {label: 'Bar', value: 'BarChart'},
  {label: 'Area', value:'AreaChart'},
  {label: 'Pie', value: 'PieChart'},
  {label: 'Scatter', value:'ScatterChart'},
  {label: 'Stepped', value:'SteppedAreaChart'},
  {label: 'Column', value: 'ColumnChart'}]


export let TEST_STATE = {
  apiDefinition: [{
    id: 1,
    name: 'Test Name',
    url: 'test-name',
    query: ''
  }],
  selectedApiIndex: 0
}

export const COLUMN_TYPE = [
  {
    label: 'Dimension',
    value: 'dimension'
  }, {
    label: 'Metric',
    value: 'metric'
  }
]

export const VISUALIZATION_MODES = {
  raw: 'Raw',
  widget: 'Widget'
}

export const INCORRECT_JSON_ERROR = 'You have not entered a valid json'

export const FILTER_TYPES = [
  {
    label: 'DateTime',
    value: 'dateTime'
  }, {
    label: 'String',
    value: 'string'
  }, {
    label: 'Date',
    value: 'date'
  }, {
    label: 'Number',
    value: 'number'
  }, {
    label: 'Dropdown',
    'value': 'dropdown'
  }
]

export const RND_FILTER_RESIZEABILITY_CONSTRAINTS = { 
  top:false,
  right:true,
  bottom:false,
  left:true,
  topRight:false,
  bottomRight:false,
  bottomLeft:false,
  topLeft:false
}

export const DEFAULT_FILTER_VALUES = {
  [FILTER_TYPES[1].value]: '',
  [FILTER_TYPES[4].value]: ''
}
