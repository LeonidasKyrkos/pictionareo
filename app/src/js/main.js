import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import NoMatch from './components/NoMatch';

let unString = 'pictionareou';
let pString = 'pictionareop';

function validate() {
	let un = sessionStorage.getItem(unString);
	let p = sessionStorage.getItem(pString);

	if(!un || !p) {
		window.location.pathname = '/';
	} else {
		this.username = un;
	}
}

var routes = (
	<Router history={browserHistory}>
		<Route path="/rooms/:roomId" component={App} onEnter={validate} />
		<Route path="/" component={RoomPicker} unString={unString} pString={pString} />
		<Route path="*" component={NoMatch} />
	</Router>
)

ReactDOM.render(routes, document.querySelector('#main'));