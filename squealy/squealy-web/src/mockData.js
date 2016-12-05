export let COLUMN_META_DATA = [
  {
    'name': 'Project',
    'fieldName': 'project',
    'type': 'dimension',
    'sortable': false
  }, {
    'name': 'Week',
    'type': 'dimension',
    'fieldName': 'week',
    'dataType': 'Time',
    'sortable': false
  }, {
    'name': 'Type',
    'type': 'dimension',
    'fieldName': 'type',
    'sortable': false
  }, {
    'name': 'Sum',
    'type': 'metric',
    'fieldName': 'type',
    'sortable': true
  }
]

export let MOCK_DATA = [
  {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Dev',
    'sum': 29
  }, {
    'project': 'Hidash',
    'week': '3 Nov',
    'type': 'Learning',
    'sum': 15
  }, {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Meeting',
    'sum': 6
  }, {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Dev',
    'sum': 29
  }, {
    'project': 'Hidash',
    'week': '3 Nov',
    'type': 'Learning',
    'sum': 15
  }, {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Meeting',
    'sum': 6
  }, {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Dev',
    'sum': 29
  }, {
    'project': 'Hidash',
    'week': '3 Nov',
    'type': 'Learning',
    'sum': 15
  }, {
    'project': 'Hidash',
    'week': '3 oct',
    'type': 'Meeting',
    'sum': 6
  }
]

export const chartData = {
    cols: [{id: 'task', label: 'Task', type: 'string'},
           {id: 'hours', label: 'Hours per Day', type: 'number'}],
    rows: [{c:[{v: 'Work'}, {v: 11}]},
           {c:[{v: 'Eat'}, {v: 2}]},
           {c:[{v: 'Commute'}, {v: 2}]},
           {c:[{v: 'Watch TV'}, {v:2}]},
           {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}]
    }
