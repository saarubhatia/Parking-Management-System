import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router';
import Dashboard from './components/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import Initialize from './components/Initialize';
import Report from './components/Report';
import Header from './components/Header';

function App() {
  return (
    <Container fluid >
      <Header></Header>
      <Container>
        <BrowserRouter>
          <Switch>
            <Route exact path="/"><Dashboard /> </Route>
            <Route path="/dashboard"><Dashboard /> </Route>
            <Route path="/initialize"><Initialize /> </Route>
            <Route path="/report"><Report /> </Route>
          </Switch>
        </BrowserRouter>
      </Container>
    </Container>
  );
}

export default App;
