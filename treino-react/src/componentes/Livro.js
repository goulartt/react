import React, { Component } from 'react';

import http from 'axios';
import CustomInput from './CustomInput';
import SubmitButton from './SubmitButton';
import PubSub from 'pubsub-js';
import TratadorErros from '../classes/TratadorErros'

export class LivroBox extends Component {

    constructor() {
        super();
        this.state = { lista: [], listaAutores: [] };
    }

    componentDidMount() {
        http.get('http://cdc-react.herokuapp.com/api/livros')
            .then(response => this.setState({ lista: response.data }));

        http.get('http://cdc-react.herokuapp.com/api/autores')
            .then(response => this.setState({ listaAutores: response.data }));

        PubSub.subscribe('atualiza-listagem-livros', (topico, novaListagem) => {
            this.setState({ lista: novaListagem });
        });
    }


    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.listaAutores} />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(livro => {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
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

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.save = this.save.bind(this, );
    }

    enviaForm(evento) {
        evento.preventDefault();
        var livro = { titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId };
        console.log(livro);
        PubSub.publish('limpa-erros', {});
        http.post('http://cdc-react.herokuapp.com/api/livros', livro)
            .then(response => {
                PubSub.publish('atualiza-listagem-livros', response.data);
                this.setState({ titulo: '', preco: '', autorId: '' });
            }).catch(err => {
                var resp = err.response.data;
                if (resp.status === 400) {
                    new TratadorErros().publicaErros(resp);
                }
            });

    }

    save(name, evento) {
        var campo = {};
        campo[name] = evento.target.value;
        this.setState(campo);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" >
                    <CustomInput id="titulo" type="text" name="titulo" label="Título" value={this.state.titulo} onChange={this.save.bind(this, 'nome')} />
                    <CustomInput id="preco" type="number" name="preco" label="Preço" value={this.state.preco} onChange={this.save.bind(this, 'preco')} />
                    <div className="pure-control-group">
                        <label htmlFor="autor">Autor</label>
                        <select name="autor" onChange={this.save.bind(this, 'autorId')}>
                            <option value="">Selecione o autor</option>
                            {
                                this.props.autores.map(autor => {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <SubmitButton submitAction={this.enviaForm} label="Gravar" />
                </form>
            </div>
        );
    }
}
