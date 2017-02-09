import App from 'components/app';
import Board from 'components/board';
import LandingPage from 'components/landing-page';
import React from 'react';
import store from 'redux/store';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

var tictactoeRoutes = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={LandingPage} />
                <Route path="game" component={Board} />
            </Route>
        </Router>
    </Provider>
);

export default tictactoeRoutes;
