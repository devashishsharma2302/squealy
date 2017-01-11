# Squealy

Squealy is a django tool for auto-generating reporting APIs and Dynamic dashboards within minutes. Just write queries and generate customizable dashboard APIs within your project. 

Squealy supports sql templates based on [Jinjasql](https://github.com/hashedin/jinjasql/) which uses Jinja2 under the hood, hence, complex parameterized sql queries can be written.

All squealy-generated APIs are based on Django Rest Framework. All APIs can be configured to use the authentication and permission classes provided by django rest framework.

Squealy supports parameter level and API level validation/authorization as well.

Squealy provides an authoring interface where you can connect to your local database, write/debug/validate your queries, create multiple APIs.

![Cannot load image](./Readme-mediafiles/auth.png?raw=true "API Design Page")

Squealy gives you a dashboard design page where you can add charts and connected filters to the dashboard. Drag, Drop and resize the charts and filters the way you want and hit save to create a dashboard rendering API within your project without writing any additional code. 

![Cannot load image](./Readme-mediafiles/mydash.png?raw=true "Dashboard Design Page")

The generated dashboard can also be rendered from a custom (project specific) template easily.

![Cannot load image](./Readme-mediafiles/customdash.png?raw=true "Customized Templates")

Squealy APIs are highly customizable and SqlInjection safe.

## Installation Instructions
### Install from pip (Recommended):

```
pip install squealy
```
### Install from source: 
Clone this repo and execute the following command:
```
python setup.py install
```

## Usage Instructions
- Add 'squealy' to INSTALLED_APPS inside your settings file.
- Add the following url in 'urls.py'.
    ```
    url(r'^', include('squealy.urls')),    
    ```
- Hit the following url to see the API design page:
    ```
    http://<your hostname>/squealy-authoring-interface
    ```
    to hit the created APIs, 
    ```
    http://<your hostname>/squealy-apis/<url-name>
    ```
-  Click on the **Dashboard** button to see the dashboard design page
-  Once you have saved your dashboard, hit the following API to see the      dashboard (the dashboard url is just the dashboard name in lowercase replacing spaces by hyphens(-), for example, a dashboard named 'My Dashboard' will have a url 'my-dashboard' ):
    ```
    http://<your hostname>/squealy-dashboard/<dashboard-url>
    ```

# Development
## Backend setup
Activate a virtual environment
```
virtualenv venv
source venv/bin/activate
```

Installing dependencies
```
pip install -r requirements.txt
```

Running the server
```
cd example/
python manage.py runserver
```

Running test cases
```
python manage.py test tests
```

## Frontend setup

Installing dependencies
```
cd squealy/squealy-web
npm install
```

Running the development server
```
npm start
```

Running test suites
```
npm test
```

Getting production build
```
npm run build
```
