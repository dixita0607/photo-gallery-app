import React from 'react';
import {Button, Typography} from 'antd';
import '../styles/welcome.css';
import {useAuth0} from '../react-auth0-wrapper';

const {Title, Text} = Typography;

const Welcome = () => {

  const {loginWithRedirect} = useAuth0();

  return (
    <div className="welcome">
      <div>
        <Title level={2}>
          Welcome to Photo Gallery App.
        </Title>
        <Text>
          You can upload photos here and browse photos uploaded by other users. To use this app, Please click on Login.
        </Text>
      </div>
      <div className="login-button">
        <Button type="primary" size="large" onClick={() => loginWithRedirect({appState: {targetUrl: '/profile'}})}>Login</Button>
      </div>
    </div>
  );
};

export default Welcome;
