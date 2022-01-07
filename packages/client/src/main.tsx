import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';

import './main.scss';

ReactDOM.render(
    <HashRouter>
        <React.StrictMode>
            <>123</>
        </React.StrictMode>
    </HashRouter>,
    document.getElementById('root')
);
