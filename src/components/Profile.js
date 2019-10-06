import React, {useEffect, useState} from 'react';
import {useAuth0} from '../react-auth0-wrapper';
import {Typography, Avatar, Button} from 'antd';
import Uploader from './Uploader';
import Loading from './Loading';
import '../styles/profile.css';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Gallery from './Gallery';
import {useParams, useLocation} from 'react-router-dom';
import {showErrorMessage, paginateOver, prepend} from '../utils';

const {Text} = Typography;

const GET_PHOTOS = gql`
  query PhotosByUser($userId: String!, $offset: Int, $limit: Int) {
    photosByUser(userId: $userId, offset: $offset, limit: $limit) {
      _id,
      url,
      uploadedAt
    }
  }
`;

const Profile = () => {
  const {user, getTokenSilently} = useAuth0();
  const [token, setToken] = useState(null);
  const {userId} = useParams();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const [getPhotos, {fetchMore, data, updateQuery}] = useLazyQuery(
    GET_PHOTOS, {
      variables: {userId: userId || user.sub, offset: 0, limit: 10},
      context: {headers: {Authorization: 'Bearer ' + token}}
    }
  );

  useEffect(() => {
    const currentUser = location.state && location.state.currentUser;
    if (userId) setCurrentUser(currentUser);
    else setCurrentUser(user);
    getTokenSilently()
      .then(setToken)
      .then(getPhotos)
      .catch(error => showErrorMessage(error.message));
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) return <Loading/>;

  const loadMore = () => fetchMore({
    variables: {offset: data.photosByUser.length},
    updateQuery: paginateOver('photosByUser')
  });

  const onPhotoUploadedHandler = photo => updateQuery(prepend('photosByUser', photo));

  return (
    <div className="profile">
      <div className="user">
        <div className="user-details">
          {(user && currentUser.picture) ? <Avatar src={currentUser.picture}/> : <Avatar icon="user"/>}
          <Text strong
                className="user-name">{currentUser && currentUser.nickname ? currentUser.nickname : "User"}</Text>
        </div>
        {!userId && <Uploader onPhotoUploaded={onPhotoUploadedHandler}/>}
      </div>
      <div className="user-gallery">
        {
          data && data.photosByUser
            ? <Gallery photos={data.photosByUser}/>
            : <Loading/>
        }
        {data && data.photosByUser.length === 0 && <Text strong>No pictures found.</Text>}
        <Button
          onClick={loadMore}
          type="primary"
          size="small"
          className="load-more-button">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default Profile;
