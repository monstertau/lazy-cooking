import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom'
import './App.css';
import Profile from './pages/Profile';
import RegisterScreen from './pages/RegisterScreen';
import LoginScreen from './pages/LoginScreen';

class App extends React.Component {
  render() {
    return (
       <BrowserRouter>
          <Route path='/profile' exact={true} component={Profile}></Route>
          <Route path='/register' exact={true} component={RegisterScreen}></Route>
          <Route path='/login' exact={true} component={LoginScreen}></Route>
       </BrowserRouter>
    );
  }
}

export default App;
