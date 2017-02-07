import App from 'components/app';
import React from 'react';
import { Provider } from 'react-redux'
import store from 'redux/store';
import ReactDOM from 'react-dom';

function render() {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('main-app')
    );
};

render();
