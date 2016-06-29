import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import NoMatch from './components/NoMatch';

let unString = 'pictionareou';
let pString = 'pictionareop';

function validate() {
	let roomId = window.location.pathname;
	let un = localStorage.getItem(unString);
	let p = localStorage.getItem(pString);

	console.log(un,p);

	if(!un || !p) {
		//window.location.pathname = '/';
	}
}

var routes = (
	<Router history={browserHistory}>
		<Route path="/rooms/:roomId" component={App} onEnter={validate} />
		<Route path="/" component={RoomPicker} unString={unString} />
		<Route path="*" component={NoMatch} pString={pString} />
	</Router>
)

ReactDOM.render(routes, document.querySelector('#main'));