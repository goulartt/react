import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component {


  render() {
    return (
      <header className="header container">
        <h1 className="header-logo">
          Instalura
          </h1>

        <form className="header-busca">
          <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" />
          <input type="submit" value="Buscar" className="header-busca-submit" />
        </form>


        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
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