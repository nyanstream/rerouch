import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';

import { Provider as ReduxProvider } from 'react-redux';
import ReduxStore from './redux/store';

import App from './components/App/Components/AppContainer';

import 'react-toastify/dist/ReactToastify.css';
import './main.scss';

ReactDOM.render(
    <ReduxProvider store={ReduxStore}>
        <HashRouter>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </HashRouter>
    </ReduxProvider>,
    document.getElementById('root')
);
