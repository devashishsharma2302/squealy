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
            "description": "This is Squealy Server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",
            "version": "1.0.0",
            "title": "Squealy API",
            "termsOfService": "http://swagger.io/terms/",
            "contact": {
                "email": "apiteam@swagger.io"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        "host": "localhost:8000",
        "basePath": "",
        "tags":[
            {
                "name": "charts",
                "description": "Everything about your Charts"
            }
        ],
        "paths": {

        },

        "definitions": {
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