import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import ApiViewContainer from './Containers/ApiViewContainer'
import DashboardContainer from './Containers/DashboardContainer'
import App from './Containers/App'

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={ApiViewContainer} />
        <Route path='dashboard' component={DashboardContainer} />
      </Route>
    </Router>,
  document.getElementById('root')
);
