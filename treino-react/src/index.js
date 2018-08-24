import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { AutorBox } from './componentes/Autor';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/autor"  component={ AutorBox} />
            <Route path="/livro" />
        </div>
    </Router>, document.getElementById('root'));
registerServiceWorker();
