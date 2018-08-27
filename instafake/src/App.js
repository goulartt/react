import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div id="root">
      <div className="main">
        <Header/>
        <Timeline login={this.props.match.params['login']}/>
      </div>
    </div>
    );
  }
}

export default App;
