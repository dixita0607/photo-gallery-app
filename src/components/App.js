import React, {useEffect, useState} from 'react';
import NavBar from './NavBar';
import {useAuth0} from '../react-auth0-wrapper';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Profile from './Profile';
import {Layout} from 'antd';
import PrivateRoute from './PrivateRoute';
import Welcome from './Welcome';
import UserList from './UserList';
import '../styles/app.css';
import {gql} from 'apollo-boost';
import Loading from './Loading';
import {useMutation} from '@apollo/react-hooks';
import {showErrorMessage} from '../utils';

const {Header, Content} = Layout;

const ENSURE_USER = gql`
  mutation EnsureUser($userInfo: UserInfo!) {
    ensureUser(userInfo: $userInfo) {
      _id,
      name,
      email,
      nickname,
      picture
    }
  }
`;

function App() {
  const {loading, isAuthenticated, getTokenSilently, user} = useAuth0();
  const [token, setToken] = useState(null);

  const [ensureUser, {called: ensured}] = useMutation(ENSURE_USER, {
    variables: {
      userInfo: {name: user.name, email: user.email, nickname: user.nickname, picture: user.picture}
    },
    context: {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!token) getTokenSilently().then(setToken);
    else ensureUser().catch(error => showErrorMessage(error.message));
  }, [isAuthenticated, token]);

  if (loading || (isAuthenticated && !ensured)) {
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
              <PrivateRoute exact path="/profile" component={Profile}/>
              <PrivateRoute exact path="/profile/:userId" component={Profile}/>
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
