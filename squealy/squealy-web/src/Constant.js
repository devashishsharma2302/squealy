import moment from 'moment'
import { baseUrl } from './Utils'

export const DOMAIN_NAME = baseUrl()
export const SIDE_BAR_WIDTH = '21%'
export const RESPONSE_FORMATS = {
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
    value: 'datetime'
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
    value: 'dropdown'
  }
]

export const PARAM_FORMAT_MAP = {
  datetime: 'DateTime',
  string: 'String',
  date: 'Date',
  number: 'Number',
  dropdown: 'Dropdown'
}

export const PARAM_TYPE_OPTIONS = [
  {
    label: 'User',
    value: 'user'
  }, {
    label: 'Query',
    value: 'query'
  }
]

export const AVAILABLE_TRANSFORMATIONS = [
  {
    value: 'transpose',
    label: 'Transpose'
  },
  {
    value: 'split',
    label: 'Split'
  },
  {
    value: 'merge',
    label: 'Merge'
  }
]

export const GOOGLE_CHART_TYPE_OPTIONS = [
  { label: 'Table', value: 'Table' },
  { label: 'Line', value: 'LineChart' },
  { label: 'Bar', value: 'BarChart' },
  { label: 'Area', value: 'AreaChart' },
  { label: 'Pie', value: 'PieChart' },
  { label: 'Scatter', value: 'ScatterChart' },
  { label: 'Stepped', value: 'SteppedAreaChart' },
  { label: 'Column', value: 'ColumnChart' }]


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
    value: 'datetime'
  }, {
    label: 'Input',
    value: 'input'
  }, {
    label: 'Date',
    value: 'date'
  }, {
    label: 'Dropdown',
    'value': 'dropdown'
  }
]

export const RND_FILTER_RESIZEABILITY_CONSTRAINTS = {
  top: false,
  right: true,
  bottom: false,
  left: true,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
}

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD, hh:mm:ss'

export const DEFAULT_FILTER_VALUES = {
  [FILTER_TYPES[0].value]: new Date(),
  [FILTER_TYPES[1].value]: '',
  [FILTER_TYPES[2].value]: moment(new Date().toISOString()).format(DATE_FORMAT),
  [FILTER_TYPES[3].value]: ''
}

export const GRID_WIDTH = 104
export const GRID_PADDING = 15
export const GRID_HEIGHT = 20

export const GRID_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const PARAM_TYPE_MAP = { 1: 'query', 2: 'user' }

export const CHART_CONFIG_EXAMPLE = {
  'width': 400,
  'height': 240,
  'title': 'Chart Title',
  'colors': ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
  'vAxis': {
    'title': 'Y-Axis Data',
    'titleTextStyle': {
      'color': '#000'
    },
    'gridlines': {
      'count': 4,
      'color': '#ccc'
    },
    'minValue': 5,
    'maxValue': 100
  },
  'hAxis': {
    'title': 'X-Axis Data',
    'titleTextStyle': {
      'color': '#000',
      'fontSize': 17
    },
    'gridlines': {
      'count': 4,
      'color': '#ccc'
    },
    'viewWindow': {
      'min': 0,
      'max': 5
    },
    'scaleType': 'log'
  },
  'chartArea': {
    'height': '50%',
    'width': '50%',
    'top': '10%',
    'left': '10%'
  },
  'animation': {
    'duration': 1000,
    'easing': 'out',
    'startup': true
  },
  'annotations': {
    'boxStyle': {
      'stroke': '#888',
      'rx': 10,
      'ry': 10
    },
    'highContrast': true,
    'textStyle': {
      'fontName': 'Times-Roman',
      'fontSize': 18,
      'bold': true,
      'italic': true,
      'color': '#871b47',
      'auraColor': '#d799ae',
      'opacity': 0.8
    },
    'backgroundColor': '#ff0000',

  },
  'legend': {
    'position': 'top',
    'textStyle': {
      'color': '#0000ff',
      'fontSize': 16
    }
  },
  'tooltip': {
    'textStyle': {
      'color': '#FF0000'
    },
    'showColorCode': true,
    'isHtml': true
  }
}

export const GOOGLE_CHART_DOC = 'https://developers.google.com/chart/interactive/docs/gallery/areachart#configuration-options'


const helpText = {
  query1: `SELECT project, timesheet, hours
FROM timesheet 
WHERE start_date = {{ params.start_date }}`,
  query2: `SELECT project, timesheet, hours
FROM timesheet
{% if params.project_id %} 
  WHERE project_id = {{ params.project_id }}
{% endif %}`,
  query3: `{% macro dates(date1, date2) -%}
  BETWEEN {{ date1 }} AND {{ date2 }}
{%- endmacro  %}

SELECT CONCAT(u.first_name, " ", u.last_name) as "Resource",a.name as "Type", sum(b.hrs) as "Time Spent"
FROM(
  SELECT *
  FROM timesheet_timesheet
  WHERE project_code={{params.project_id}} AND day {{ dates(params.start_date, params.end_date) }}
) b
JOIN timesheet_timesheettype a ON a.id=b.type_id
JOIN auth_user u ON u.id=b.owner_id
GROUP BY u.username, a.name`,
  descQuery1: 'To write a parameterized query, place the parameter in {{ }}. In this example, {{ params.start_date }} is a parameter that is being passed in the query . As soon as you write the query, an entry with name "start_date" is created in "parameter defination modal" where you can edit the definition of this parameter',
  descQuery2: 'Behind the scene Jinjasql uses Jinja2 Templating Engine which provides {% if %}, {% elif %} and {% else %} tags to implement conditional statements. These tags can be used anywhere in the query as shown in this example. ',
  descQuery3: 'You can even use macros for doing complex calculation in your query. One usecase could be writing a macro to calculate number of weekend between two given dates. In this example we create a macro for MYSQL\'s between caluse.'
}
export { helpText }
export const DOCUMENT_URL = 'https://github.com/hashedin/squealy/#squealy'
export const JINJASQL_DOC_URL = 'https://github.com/hashedin/jinjasql#generate-sql-queries-using-a-jinja-template-without-worrying-about-sql-injection'
