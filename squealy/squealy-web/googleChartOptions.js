{
  "width": 400,
  "height": 240,
  "title": "Chart Title",
  "colors": ["#e0440e", "#e6693e", "#ec8f6e", "#f3b49f", "#f6c7b6"],
  "vAxis": {
    "title": "Y-Axis Data",
    "titleTextStyle": {
      "color": "#000"
    },
    "gridlines": {
      "count": 4,
      "color": "#ccc"
    },
    "minValue": 5,
    "maxValue": 100
  },
  "hAxis": {
    "title": "X-Axis Data",
    "titleTextStyle": {
      "color": "#000",
      "fontSize": 17
    },
    "gridlines": {
      "count": 4,
      "color": "#ccc"
    },
    "viewWindow": {
      "min":0,
      "max":5
    },
    "scaleType": "log"
  },
  "chartArea": {
    "height": "50%",
    "width": "50%",
    "top": "10%",
    "left": "10%"
  },
  "animation":{
    "duration": 1000,
    "easing": "out",
    "startup": true
  },
  "annotations": {
    "boxStyle": {
      "stroke": "#888",
      "rx": 10,
      "ry": 10
    },
    "highContrast": true,
    "textStyle": {
      "fontName": "Times-Roman",
      "fontSize": 18,
      "bold": true,
      "italic": true,
      "color": '#871b47',
      "auraColor": '#d799ae',
      "opacity": 0.8
    },
    "backgroundColor": "#ff0000",

  },
  "legend": {
    "position": "top"
    "textStyle": {
      "color": "#0000ff",
      "fontSize": 16
    }
  },
  "tooltip": {
    "textStyle": {
      "color": "#FF0000"
    },
    "showColorCode": true,
    "isHtml": true
  }
}
