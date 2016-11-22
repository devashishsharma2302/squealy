Yaml Configuration
=====================================================
The .yml file serves as the sole input for all sorts of API configurations.
The .yml file can have multiple docs (or, APIs) separated by three dashes (---). 

Following are the supported arguments in detail.
The mandatory arguments are appended with an asterisk(*) sign.

- |id|
.. |id| raw:: html

   <b>id<sup>*</sup>:</b> This is a unique id given to each API. It is used internally by squealy for creating ApiView classes.

- |url|
.. |url| raw:: html

   <b>url<sup>*</sup>:</b> This is the url endpoint to the API. <b> Do not prepend the url with a '/'.</b>

- |query|
.. |query| raw:: html

   <b>query<sup>*</sup>:</b> This is the SQL query, or, more precisely, a <a href='https://github.com/hashedin/jinjasql'>JinjaSql</a> template with parameters bind in the query. The parameters can be extracted from the session or the GET request. The parameters are explained in detail later below.

- **parameters:** This is a dictionary with parameter names as keys and value is further a dictionary with parameter config. The different parameter configurations are listed below.

.. code-block:: yaml

 parameters:
            param1:
                 type: string
                 default_value: somestring
                 optional: True [False by default]
            param2:
                 type: date
                 format: "DD/MM/YYYY"
            param3:
                 type: datetime
                 format: "DD/MM/YYYY HH:mm:ss"

- **validations:** This is a very important and useful feature for API authorization. This is a list of validations which would run with every API call. If anyone of these validations return False, the API would return an error code and the request will be unauthorized.

 The **validation_function** attribute is a path to the function that is to be used     to run the validation. This can be a user defined function or one of the function  defined in the **'squealy.validators'** module.

 The validation_function must of the following signature:
  Boolean foo(api, params, user, ...any_other_args):

 The **api** is the complete ApiView object, **params** contains the parameter values passes through the url, **user** is the request.user object which can be used to extract session data.

 There is a pre-defined function 'squealy.validators.run_query' which takes a sql query and if that query retutrns any rows, then the validation is passed.

.. code-block:: yaml

   validations:
    -
        error_message: "Invalid parameter: name"
        error_code: 403
        validation_function:
                            name: 'squealy.validators.run_query'
                            kwargs:
                                   query: >
                                            select name from sqlite_master where {{params.name}} in ("django_migrations");
    -
        error_message: "Custom Validation Failed"
        error_code: 403
        validation_function:
                            name: 'exampleapp.custom_validators.validate_user_id'

- **authentication_classes:** This is a list of django rest framework `authentication classes <http://www.django-rest-framework.org/api-guide/authentication/>`_ which would be applied to the generated APIs.

.. code-block:: yaml

   authentication_classes:
     - SessionAuthentication
     - BasicAuthentication
     - TokenAuthentication

- **permission_classes:** This is a list of django rest framework permission classes which would be applied to the generated APIs.

.. code-block:: yaml

   permission_classes:
     - IsAuthenticated

- **transformations:** Squealy supports some transformations which can be very helpful to transform the response data. Below are the supported transformations:

 - **transpose**: This transposes the output table.
 - **merge**: merge two columns into a new column.
 - **split**: pivot the table at a column and re-arrange the metric column accordingly.

  For split transform, it is mandatory to define the columns as well.

.. code-block:: yaml

 columns:
        name:
            type: "dimension"
        sql:
            type: "dimension"
        num:
            type: "metric"

 transformations:
          -
            name: "transpose"
          -
            name: "split"
            kwargs:
                   pivot_column: "name"
          -
            name: "merge"
            kwargs: 
                   columns_to_merge:
                                    - "sql"
                                    - "num"
                   new_column_name: "merged_column"

- **format**: The default format is 'table', which returns the data in json as a 2-D array. Other supporter formats are:

  - 'gc' : for google charts
  - 'hc': for HighCharts
  - 'json': same as table

