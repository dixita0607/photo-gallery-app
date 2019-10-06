import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth0} from '../react-auth0-wrapper';

const PrivateRoute = ({component: Component, path, ...rest}) => {
  const {isAuthenticated} = useAuth0();

  const render = props => isAuthenticated === true ? <Component {...props} /> : <Redirect to="/"/>;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
