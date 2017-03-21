# Squealy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Generate charts and reports, just by writing SQL queries.

Welcome to SQueaLy's documentation. SQueaLy is an open-source, self-deployable application that runs on Django. It gives you the power to analyze and visualize your organizational data in an environment that is completely owned by you. Hence, making it the most suitable solution for generating charts and reports out of sensitive data.

## Key Features
- **One-Click Deploy to Heroku:** Just click on the 'deploy-to-Heroku' button, login to your Heroku account, enter environment variables and the application will be deployed under your account and domain. Otherwise, SQueaLy can easily be deployed manually in any cloud or on-premise server.
- **Secure:** All the database credentials and secret keys are stored as environment variables in your own server architecture (Heroku, AWS etc.).
- **More than just SQL:** SQueaLy supports Jinja2 templates within SQL queries. It provides the ability to parameterize the queries and a wide variety of pre-processing logic that is applied to the SQL queries. ( if conditions, for loops, macros, filters etc. ). It also makes sure that the queries are SQL injection safe. For more details, check out [JinjaSQL](https://github.com/hashedin/jinjasql/).
- **Permission based model:** SQueaLy provides you the ability to assign view/edit permission to any user for each chart/report. 
- **Multiple Databases:** You can set up multiple database connections and specify the database to use while generating the chart/report.

## Getting started
- Click on the 'Deploy-to-Heroku' button on the [top](#squealy) of this documentation.
- Login/signup to your Heroku account.
- Enter the environment variables and click deploy (Make sure to note the admin credentials entered at this step).

The app is deployed and the first chart has already been created for you. Hit the **Run** button and you can see the data/visualization in the results section.

## Advanced Features

### Managing Permissions (Chart-level Authorization)
SQueaLy uses Django's default permission model for managing chart level authorization.
Everytime a new chart is created, 2 permissions are added in the backend automatically corresponding to view and edit mode access.

For example, if the chart is named as **'foo'** then, permissions **'can-view-foo'** and **'can-edit-foo'** are added automatically.

The administrator just needs to add the required permissions to users or groups from the Django admin panel. ( located at https://<your_domain>/admin )

Also, there are two other high-level permissions - **can-add-chart** and **can-delete-chart** that are required to creation and deletion of charts, respectively.

For non-Django folks: By default, the admin user has all permissions.

### Using the APIs

SQueaLy generates APIs in real-time corresponding to each chart. Just hit the API corresponding to your chart_url,
**NOTE:** The chart_url is the chart name in lower case, replacing spaced by hyphen ('-')

``` html
<your_domain>/squealy/<chart_url>
```
This API will return the data in the format that is compatible with **GoogleCharts**.

### Query Parameterization
Squealy supports SQL templates based on [Jinjasql](https://github.com/hashedin/jinjasql/), hence, complex parameterized SQL queries can be written.

These parameter values would be extracted from the filters that you will see in the view mode of the chart, or, from the URL if you are making an API call manually.

To add a parameter, you need to use the keyword object "**params**" inside your jinja template.
For example, to include a parameter named **foo**, 

``` sql
SELECT * from some_table
WHERE some_value = {{params.foo}};
```

### User-level Authorization
SQueaLy allows you to use user parameters inside the query template, the values of which would be extracted from the logged in user while running the query.

Use the keyword object "**user**" in the jinja template to access the **request.user** object provided by Django. For further details, checkout [Django User Objects](https://docs.djangoproject.com/en/1.10/topics/auth/default/#user-objects).

For example, 

``` sql
--- To see the bookings of the current user only.
SELECT bookings from bookings_table
WHERE some_value = {{params.foo}}
AND name = {{user.username}}
```

### Validations
With every chart, you can attach another SQL query that would validate the API. The API would return a 403 Forbidden response, if the validation query returns no rows.

### Transformations 
SQueaLy provides some transformation functions for processing the data after executing the query. Currently, 3 transformations are supported:

- **Transpose:** This would return the transpose of the data table that is returned from the query.
- **Merge:** This merges two columns into a single column and distributes the data accordingly.
- **Split:** This is an alternative to pivoting the table. Chose a column to split and a metric column that is to be distributed.

### JWT Authentication
SQueaLy provides a mechanism to log in a user via an access token that would help in sharing some other application's user-base with squealy without the need to import the users in SQueaLy database.
- **JWT_KEY** - This is setup in the environment while deploying SQueaLy app. This is the private key that is shared between squealy and the other application which is directing users to SQueaLy. 
- **Token encoding**: Use the above key to create a jwt token in your application with the following payload:
    ``` js
    {
    "username": "foo", //Squealy assumes the authenticity of this user is handeled by the directing application.
    
    "groups": ["g1", "g2", "g3"] //List of django permission groups that this user belongs to.
    }
    ```
- **Sending the token**: You can send this token as a url parameter in a GET request or as a body parameter in a POST request to any of the squealy APIs. SQueaLy would ensure to login the user before handling the request.


# Development
## Backend setup
**Activate a virtual environment**
```
virtualenv venv
source venv/bin/activate
```

**Installing dependencies**
```
cd example
pip install -r requirements.txt
```
**Database Setup**
SQuealy needs a postgres database to run. Create a database and a user with **Create DB** role. (To run test cases). Use the following command on psql to grant this access to a user:
```
ALTER USER username CREATEDB;
```
Note the URL of this database for use in the next step. The URL will be of the following format:
```
<mysql/postgres>://<username>:<password>@<host>:<port>/<database>
```
For further help regarding postgres setup, click on one of the following links:
- [For Mac OSX.](https://www.codementor.io/devops/tutorial/getting-started-postgresql-server-mac-osx)
- [For Linux.](http://www.yolinux.com/TUTORIALS/LinuxTutorialPostgreSQL.html)

**Setting up environment variables**
Before running the server, make sure to set the following environment variables using this command:
```
export KEY=VALUE
```
- DATABASE_URL - **(Required)** This is the database that will be used by squealy internally for user management.
- QUERY_DB - **(Required)** This is the DB used to run the queries on. Enter comma separated URLs for multiple DBs.
- ADMIN_USERNAME - **(Required)** This is the default admin's username that would be created with the first migration command.
- ADMIN_PASS - **(Required)** This is the password for the default admin user.
- JWT_KEY - This is the shared private key that will be used to decode the JWT token. This is required for optionally enabling JWT Authentication mechanism that would enable the user to login via an access token parameter in the url or request body. For more information refer [above](#jwt-authentication). 

**Running the migrations**
```
python manage.py migrate
```

**Running the server**
```
python manage.py runserver
```

Running test cases
```
python manage.py test tests --settings=test_settings
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
