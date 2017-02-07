import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import ApiViewContainer from './Containers/ApiViewContainer'
import DashboardContainer from './Containers/DashboardContainer'
import AuthoringInterfaceContainer from './Containers/temp/AuthoringInterfaceContainer'
import App from './Containers/App'

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path='/squealy-authoring-interface' component={App}>
        <IndexRoute component={ApiViewContainer} />
        <Route path='/squealy-authoring-interface/dashboard' component={DashboardContainer} />
      </Route>
      <Route path='/' component={App}>
        <IndexRoute component={AuthoringInterfaceContainer} />
      </Route>
    </Router>,
  document.getElementById('root')
);
