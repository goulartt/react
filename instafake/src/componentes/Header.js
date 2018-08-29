import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimelineApi from '../services/TimelineApi';

export default class Header extends Component {

  constructor() {
    super();
    this.state = { msg: '' };
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({ msg: this.props.store.getState().notificacao });
    });
  }

  pesquisaInput(event) {
    event.preventDefault();
    this.props.store.dispatch(TimelineApi.pesquisa(this.pesquisa.value));
  }

  render() {
    return (
      <header className="header container">
        <h1 className="header-logo">
          Instalura
          </h1>

        <form className="header-busca" onSubmit={this.pesquisaInput.bind(this)}>
          <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.pesquisa = input} />
          <input type="submit" value="Buscar" className="header-busca-submit" />
        </form>


        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
              <span>{this.state.msg}</span>
              <Link to="/logout" >
                Logout
                </Link>
            </li>

          </ul>
        </nav>
      </header>
    );
  }
}