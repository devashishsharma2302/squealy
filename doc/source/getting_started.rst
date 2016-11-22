Getting Started
=====================================================
Lets build a simple API that fetches some data from database via SQL query.

1. **Database Connection**: Squealy APIs can use any of the connections made in settings.py, via **connection_name** property which defaults to the **default** connection. For now, lets assume that the default connection is setup in settings.py.


2. **YAML file:** Create a .yml file anywhere in your project providing the API configurations. The structure of this file is defined in detail below. For now, lets start with a minimal configuration to create 2 APIs.

.. code-block:: yml
 
 ---
 id: api1
 url: api1
 query: >
    select name, sql from sqlite_master limit 5;
 ---
 id: api2
 url: api2

 query: >
    select name, sql from sqlite_master limit {{params.limit}};
 ---


3. **APIs Generation:** Use the ApiGenerator class to generate the squealy APIs inside your project's **urls.py**.

.. code-block:: python

 from squealy.apigenerator import ApiGenerator
 from os.path import dirname, abspath, join

 # Generate the file path to your *.yml file
 YAML_ROOT = join(dirname(abspath(__file__)), "yaml")
 file_path = join(YAML_ROOT, "apis.yaml")

 # Generate url objects
 squealy_urls = ApiGenerator.generate_urls_from_yaml(file_path)

 urlpatterns = [
     url(r'^squealy/', include(squealy_urls)),
 ]


4. **Test the APIs:**
   
 Run the server:

.. code-block:: console
 
    python manage.py runserver

 

|

| That's it! you can now test your APIs in your browser at the following urls:
| (assuming the server running on port 8000)


.. code-block:: url

  http://localhost:8000/squealy/api1
  http://localhost:8000/squealy/api2/?limit=10

