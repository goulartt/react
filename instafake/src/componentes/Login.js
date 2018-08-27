import React, { Component } from 'react';

export default class Login extends Component {
    
    constructor(props) {
        super(props);
        
        var msg = '';
        if (this.props.location.state) {
            msg = this.props.location.state.msg;
        }
        this.state = { msg: msg };
    }

    envia(event){
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({login: this.login.value, senha: this.senha.value}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch('http://localhost:8080/api/public/login', requestInfo)
            .then(resp => {
                if(resp.ok) {
                    return resp.text();
                } else {
                    throw new Error('Credenciais invalidas')
                }
            })
            .then(token => {
                localStorage.setItem('auth-token', token);
                this.props.history.push('timeline');
            }).catch(err => this.setState({msg: err.message})); 
    }
    
    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.envia.bind(this)}>
                    <input type="text" ref={(input) => this.login = input}/>
                    <input type="password" ref={(input) => this.senha = input}/>
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }
}