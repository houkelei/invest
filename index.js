import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Main from './js/main';
import registerServiceWorker from './lib/registerServiceWorker';

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();