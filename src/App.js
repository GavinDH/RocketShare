import React, { Component } from 'react';
import './App.css';


import AppBar from './components/appBar';
import Cloud from './components/cloud';
import Field from './components/field';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="FixCloud-pos">
          <AppBar />
        <Field />
        </div>
        <Cloud />
      </div>
    );
  }
}

export default App;
