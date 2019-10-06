import React, {useState, useEffect} from 'react';
import {useAuth0} from '../react-auth0-wrapper';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {Avatar, Button, Card, Typography} from 'antd';
import Loading from './Loading';
import '../styles/user-list.css';
import {paginateOver} from '../utils';

const {Text} = Typography;

const GET_USERS = gql`
  query GetUsers($offset: Int, $limit: Int) {
    users(offset: $offset, limit: $limit) {
      _id
    }
  }
`;

const UserList = () => {
  const {getTokenSilently} = useAuth0();
  const [token, setToken] = useState(null);

  const [getUsers, {fetchMore, loading, data}] = useLazyQuery(
    GET_USERS,
    {
      variables: {offset: 0, limit: 20},
      context: {headers: {Authorization: 'Bearer ' + token}}
    }
  );

  useEffect(() => {
    getTokenSilently().then(setToken).then(getUsers);
  }, []);

  if (!token) return <Loading/>;

  const loadMore = () => fetchMore({
    variables: {offset: data.users.length},
    updateQuery: paginateOver('users')
  });

  return <div className="user-list">
    <div className="user-list-container">{
      data && data.users
        ? data.users.map(user =>
          <Card key={user._id} className="user-details-card">
            {(user && user.picture) ? <Avatar src={user.picture}/> : <Avatar icon="user"/>}
            <Text strong className="user-name">{user && user._id ? user._id : "User"}</Text>
          </Card>
        )
        : <Loading/>
    }
    </div>
    <Button type="primary"
            size="small"
            className="load-more-button"
            onClick={loadMore}>
      Load More
    </Button>
  </div>
};

export default UserList;
