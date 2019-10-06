import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from './react-auth0-wrapper';
import config from './auth0Config.json';
import {ApolloClient} from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import 'antd/dist/antd.css';
import './index.css';

const graphQLURL = 'http://localhost:4000/graphql';

const apolloClient = new ApolloClient({
  uri: graphQLURL,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: graphQLURL
  })
});

const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      audience={config.audience}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      connection="google-oauth2"
    >
      <App/>
    </Auth0Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
