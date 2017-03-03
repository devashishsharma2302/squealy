import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import ApiViewContainer from './Containers/ApiViewContainer'
import DashboardContainer from './Containers/DashboardContainer'
import AuthoringInterfaceContainer from './Containers/temp/AuthoringInterfaceContainer'
import App from './Containers/App'

ReactDOM.render(<App />, document.getElementById('root'));
