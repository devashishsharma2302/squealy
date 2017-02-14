let charts = [
{
    name: 'Chart1',
    url: 'chart1',
    query: 'select 1,2,3',
    parameters: [],
    testParameters: {},
    validations: [],
    transformations: [{}],
    options: {},
    chartType: 'ColumnChart',
    chartData: {
    cols: [{id: 'task', label: 'Task', type: 'string'},
           {id: 'hours', label: 'Hours per Day', type: 'number'}],
    rows: [{c:[{v: 'Work'}, {v: 11}]},
           {c:[{v: 'Eat'}, {v: 2}]},
           {c:[{v: 'Commute'}, {v: 2}]},
           {c:[{v: 'Watch TV'}, {v:2}]},
           {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}]
    }
  },
  {
    name: 'Chart2',
    url: 'chart2',
    query: 'select 2,3',
    parameters: [],
    testParameters: {},
    validations: [],
    transformations: [],
    options: {},
    chartType: 'ColumnChart',
    chartData: {}
  },
  {
    name: 'Chart3',
    url: 'chart3',
    query: '',
    parameters: [],
    testParameters: {},
    validations: [],
    transformations: [{}, {}, {}],
    chartType: 'ColumnChart',
    options: {},
    chartData: {}
  }

]
export default charts