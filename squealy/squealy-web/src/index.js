import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import ApiView from './Containers/ApiViewContainer'
import DashboardView from './Containers/DashboardContainer'
import App from './Containers/App'

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={ApiView} />
        <Route path='dashboard' component={DashboardView} />
      </Route>
    </Router>,
  document.getElementById('root')
);
