import React from 'react';
import NavBar from './NavBar';
import {useAuth0} from '../react-auth0-wrapper';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Profile from './Profile';
import {Layout} from 'antd';
import PrivateRoute from './PrivateRoute';
import Welcome from './Welcome';
import UserList from './UserList';
import '../styles/app.css';
import Loading from './Loading';

const {Header, Content} = Layout;

function App() {
  const auth0 = useAuth0();
  const {loading, isAuthenticated} = auth0;

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="app">
      <Router>
        <Layout>
          <Header><NavBar/></Header>
          <Content className="content">
            <Switch>
              <Route path="/" exact component={Welcome}/>
              <PrivateRoute path="/profile" component={Profile}/>
              <PrivateRoute path="/users" component={UserList}/>
              <Route path="*" render={() => <Redirect to="/"/>}/>
            </Switch>
          </Content>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
