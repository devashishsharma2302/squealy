PARAMETER_TYPES = [(1, 'query'), (2, 'user')]
TRANSFORMATION_TYPES = [(1, 'Transpose'), (2, 'Split'), (3, 'Merge')]
COLUMN_TYPES = [(1, 'dimension'), (2, 'metric')]
SQL_WRITE_BLACKLIST = [
    # Data Definition
    'CREATE', 'ALTER', 'RENAME', 'DROP', 'TRUNCATE',
    # Data Manipulation
    'INSERT', 'UPDATE', 'REPLACE', 'DELETE',
]

SWAGGER_JSON_TEMPLATE = {
        "swagger": "2.0",
        "info": {
            "description": "This is Squealy Server.",
            "version": "1.0.0",
            "title": "Squealy API"
        },
        "host": "",
        "basePath": "",
        "tags":[
            {
                "name": "charts",
                "description": "Everything about your Charts"
            }
        ],
        "schemes": [
            "https",
            "http"
        ],
        "paths": {

        },
        "securityDefinitions": {

        },
        "definitions" : {

        },
        "externalDocs": {
            "description": "Find out more about Swagger",
            "url": "http://swagger.io"
        }
    }

SWAGGER_DICT = {
    "string": ('string', ''),
    "number": ('integer', 'int64'),
    "date": ('string', 'date'),
    "datetime": ('string', 'date-time'),
    "dropdown": ('string', '')

}