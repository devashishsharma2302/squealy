import moment from 'moment'
import {baseUrl} from './Utils'
export const DOMAIN_NAME = baseUrl()
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
  }
]

export const AVAILABLE_TRANSFORMATIONS = [
  {
    value: 'transpose',
    label: 'Transpose'
  },
  {
    value: 'merge',
    label: 'Merge'
  },
  {
    value: 'split',
    label: 'Split'
  }
]

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
  top:false,
  right:true,
  bottom:false,
  left:true,
  topRight:false,
  bottomRight:false,
  bottomLeft:false,
  topLeft:false
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
      'min':0,
      'max':5
    },
    'scaleType': 'log'
  },
  'chartArea': {
    'height': '50%',
    'width': '50%',
    'top': '10%',
    'left': '10%'
  },
  'animation':{
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


const query1 = 'SELECT project, timesheet, hours FROM timesheet WHERE start_date = {{ params.start_date }}',
      query2 = `SELECT project, timesheet, hours FROM timesheet WHERE start_date = {{ params.start_date }}
{% if params.project_id %} 
AND project_id = {{ params.project_id }}
{% endif %}`,
      query3 = `{% macro dates(date1, date2) -%}
   between {{ date1 }} and {{ date2 }}
{%- endmacro  %}

select
{% if params.project_id == "HIN-HWAY-DEL" %}
   CONCAT(u.first_name, " ", u.last_name) as "Resource",a.name as "Type", sum(b.hrs) as "Time Spent"
   from(
       select *
       from timesheet_timesheet
       where project_code={{params.project_id}}  and day {{ dates(params.start_date, params.end_date) }}
   ) b
   join timesheet_timesheettype a on a.id=b.type_id
   join auth_user u on u.id=b.owner_id
   group by u.username,a.name
{% else %}
   5
{% endif %}`,
      descQuery1_1 = 'To pass a variable in a query , you should place a variable in {{ }}',
      descQuery1_2 = '{{ params.start_date }} is the variable that is being passed in the query . As soon as you write the query, an entry with name "start_date" is created in "parameter defination modal" . You can edit the defination of the entry and change the diffrent properties of the entry',
      descQuery2 = 'Squealy uses Jinja2 Templating Engine which allows us to use {% if %} tag and {% for %} tag',
      descQuery3 = 'Jinja2 also provides a feature of adding a macro , that can also be extensivly used .'

    
    export {query1,query2,query3,descQuery1_1,descQuery1_2,descQuery2,descQuery3}

        