export let CHART_DATA = [
  {
    'id':80,
    'name':'test-chart',
    'url':'test-chart',
    'can_edit': true,
    'query':'Select 1,2,4',
    'type':'ColumnChart',
    'options':{

    },
    'account':null,
    'transformations':[

    ],
    'validations':[

    ],
    'parameters':[
      {
        'id':57,
        'name':'start_date',
        'data_type':'date',
        'mandatory':false,
        'default_value':'2016-01-01',
        'test_value':'2016-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':80
      },
      {
        'id':58,
        'name':'end_date',
        'data_type':'date',
        'mandatory':false,
        'default_value':'2017-01-01',
        'test_value':'2017-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':80
      },
      {
        'id':59,
        'name':'project_code',
        'data_type':'string',
        'mandatory':false,
        'default_value':'',
        'test_value':'HASHEDIN',
        'type':1,
        'kwargs':{

        },
        'chart':80
      }
    ]
  },
  {
    'id':79,
    'user_permission': 'edit',
    'name':'test22',
    'url':'test22',
    'can_edit': true,
    'query':'select 2,4,5',
    'type':'LineChart',
    'options':{

    },
    'account':null,
    'transformations':[

    ],
    'validations':[

    ],
    'parameters':[
      {
        'id':54,
        'name':'start_date',
        'data_type':'date',
        'mandatory':false,
        'default_value':'2016-01-01',
        'test_value':'2016-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':79
      },
      {
        'id':55,
        'name':'end_date',
        'data_type':'date',
        'mandatory':false,
        'default_value':'2017-01-01',
        'test_value':'2017-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':79
      },
      {
        'id':56,
        'name':'project_code',
        'data_type':'string',
        'mandatory':false,
        'default_value':'TEST',
        'test_value':'HASHEDIN',
        'type':1,
        'kwargs':{

        },
        'chart':79
      }
    ]
  },
  {
    'id':78,
    'name':'test1ghs',
    'url':'test1ghs',
    'can_edit': true,
    'query':'select 1,2,4',
    'type':'AreaChart',
    'options':{
      'chartArea':{
        'width':'100%',
        'top':'10%',
        'height':'50%',
        'left':'10%'
      },
      'hAxis':{
        'gridlines':{
          'color':'#ccc',
          'count':4
        },
        'viewWindow':{
          'max':5,
          'min':0
        },
        'scaleType':'log',
        'titleTextStyle':{
          'color':'#000',
          'fontSize':17
        },
        'title':'X-Axis Data'
      },
      'title':'Chart Title',
      'tooltip':{
        'isHtml':true,
        'showColorCode':true,
        'textStyle':{
          'color':'#FF0000'
        }
      },
      'height':240,
      'width':400,
      'colors':[
        '#e0440e',
        '#e6693e',
        '#ec8f6e',
        '#f3b49f',
        '#f6c7b6'
      ],
      'animation':{
        'duration':1000,
        'easing':'out',
        'startup':true
      },
      'annotations':{
        'textStyle':{
          'opacity':0.8,
          'fontName':'Times-Roman',
          'bold':true,
          'color':'#871b47',
          'auraColor':'#d799ae',
          'fontSize':18,
          'italic':true
        },
        'highContrast':true,
        'boxStyle':{
          'stroke':'#888',
          'rx':10,
          'ry':10
        },
        'backgroundColor':'#ff0000'
      },
      'vAxis':{
        'gridlines':{
          'color':'#ccc',
          'count':4
        },
        'minValue':5,
        'titleTextStyle':{
          'color':'#000'
        },
        'maxValue':100,
        'title':'Y-Axis Data'
      },
      'legend':{
        'position':'top',
        'textStyle':{
          'color':'#0000ff',
          'fontSize':16
        }
      }
    },
    'account':null,
    'transformations':[

    ],
    'validations':[

    ],
    'parameters':[
      {
        'id':51,
        'name':'start_date',
        'data_type':'string',
        'mandatory':false,
        'default_value':'2016-01-01',
        'test_value':'2016-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':78
      },
      {
        'id':52,
        'name':'end_date',
        'data_type':'string',
        'mandatory':false,
        'default_value':'2017-01-01',
        'test_value':'2017-01-01',
        'type':1,
        'kwargs':{

        },
        'chart':78
      },
      {
        'id':53,
        'name':'project_code',
        'data_type':'string',
        'mandatory':false,
        'default_value':'HASHEDIN',
        'test_value':'HASHEDIN',
        'type':1,
        'kwargs':{

        },
        'chart':78
      }
    ]
  }
]