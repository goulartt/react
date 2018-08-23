import React, { Component } from 'react';
import http from 'axios'
import CustomInput from './CustomInput'
import SubmitButton from './SubmitButton'

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        var autor = { nome: this.state.nome, email: this.state.email, senha: this.state.senha };
        http.post('http://cdc-react.herokuapp.com/api/autores', autor)
            .then(response => this.setState({ lista: response.data }))
            .catch(err => console.log(err));

    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }

    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }

    setSenha(evento) {
        this.setState({ senha: evento.target.value });
    }


    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" >
                    <CustomInput id="nome" type="text" name="nome" label="Nome" value={this.state.nome} onChange={this.setNome} />
                    <CustomInput id="email" type="text" name="email" label="E-Mail" value={this.state.email} onChange={this.setEmail} />
                    <CustomInput id="senha" type="text" name="senha" label="Senha" value={this.state.senha} onChange={this.setSenha} />

                    <SubmitButton submitAction={this.enviaForm} label="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {


    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(autor => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        http.get('http://cdc-react.herokuapp.com/api/autores')
            .then(response => this.setState({ lista: response.data }))
    }

    atualizaListagem(novaLista) {
        this.setState({ lista: novaLista });
    }
    
    render() {
        return (
            <div>
                <FormularioAutor callbackAtualizaListagem={this.atualizaListagem} />
                <TabelaAutores lista={this.state.lista} />
            </div>
        );
    }
}


