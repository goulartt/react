import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import { BrowserRouter, Switch, Route, Redirect, matchPath } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

function verificaAutenticacao(props) {
    const match = matchPath('/timeline', {
        path: props.match.url,
        exact: true
    })

    let valida = false
    if (match !== null) {
        valida = match.isExact
    }

    if (valida && localStorage.getItem('auth-token') === null) {
        return <Redirect to={{
            pathname: '/',
            state: { msg: 'Faça login para acessar esta página' }
        }} />
    }
    return <App {...props}/>
}


ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" render={props => {
                if (localStorage.getItem('auth-token') !== null) {
                    return <Redirect to='/timeline'/>
                }
                return <Login {...props} />
            }} />
            <Route exact path="/timeline/:login?" render={verificaAutenticacao} />
            <Route exact path="/logout" component={Logout} />
        </Switch>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
