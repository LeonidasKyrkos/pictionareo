import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import App from './components/App';
import Room from './components/Room';

var routes = (
	<Router history={hashHistory}>
		<Route path="/" component={App} />
		<Route path="room" component={Room} />
	</Router>
)

ReactDOM.render(routes, document.querySelector('#main'));