import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Firebase
import Rebase  from 're-base';
var base = Rebase.createClass('https://pictionareo.firebaseio.com/');

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import NoMatch from './components/NoMatch';


var routes = (
	<Router history={browserHistory}>
		<Route path="/rooms/:roomId" component={App} base={base} />
		<Route path="/" component={RoomPicker} base={base} />
		<Route path="*" component={NoMatch} />
	</Router>
)

ReactDOM.render(routes, document.querySelector('#main'));