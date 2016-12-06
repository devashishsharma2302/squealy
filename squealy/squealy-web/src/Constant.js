export const SIDE_BAR_WIDTH = '21%'
export const YAML_INDENTATION = 4
export const YAML_CONTENT_TYPE = 'application/yaml'
export const RESPONSE_FORMATS = {
  table: {
    displayName: 'Table',
    value: 'table'
  },
  json: {
    displayName: 'JSON',
    value: 'JSON'
  },
  googleCharts: {
    displayName: 'Google Charts',
    value: 'GoogleChartsFormatter'
  },
  highchart: {
    displayName: 'Highchart',
    value: 'HighchartsFormatter'
  }
}

export const PARAM_FORMAT_OPTIONS = [
  {
    label: 'DateTime',
    value: 'DateTime'
  }, {
    label: 'String',
    value: 'String'
  }, {
    label: 'Date',
    value: 'Date'
  }, {
    label: 'Number',
    value: 'Number'
  }
]

export const AVAILABLE_TRANSFORMATIONS = ['transpose', 'merge', 'split']

export const GRID_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const GOOGLE_CHART_TYPE_OPTIONS = ['Table', 'LineChart', 'BarChart', 'AreaChart', 'PieChart',
'ScatterChart', 'SteppedAreaChart', 'ComboChart', 'ColumnChart']


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
    value: 'Dimension'
  }, {
    label: 'Metric',
    value: 'Metric'
  }
]

export const VISUALIZATION_MODES = {
  raw: 'Raw',
  widget: 'Widget'
}
