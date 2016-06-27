import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import App from './components/App';
import Room from './components/Room';
import NoMatch from './components/NoMatch';

var routes = (
	<Router history={browserHistory}>
		<Route path="/" component={App} roomId="room1" />
		<Route path="/room" component={Room} />
		<Route path="*" component={NoMatch} />
	</Router>
)

ReactDOM.render(routes, document.querySelector('#main'));