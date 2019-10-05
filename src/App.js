import React from "react";
import NavBar from "./components/NavBar";
import {useAuth0} from "./react-auth0-wrapper";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import {getFromLocalStorage, saveToLocalStorage} from "./utils";

function App() {
  const {loading, getTokenSilently} = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  const token = getFromLocalStorage('token');
  if (!token) getTokenSilently().then(response => saveToLocalStorage('token', response));

  return (
    <div className="App">
      <Router>
        <header>
          <NavBar/>
        </header>
        <Switch>
          <Route path="/" exact/>
          <PrivateRoute path="/profile" component={Profile}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
