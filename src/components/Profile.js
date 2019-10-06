import React, {useEffect, useState} from 'react';
import {useAuth0} from '../react-auth0-wrapper';
import {Typography, Avatar, Button} from 'antd';
import Uploader from './Uploader';
import Loading from './Loading';
import '../styles/profile.css';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Gallery from './Gallery';
import {showErrorMessage, showSuccessMessage, paginateOver, prepend} from '../utils';

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
  const [getPhotos, {fetchMore, data, error, updateQuery}] = useLazyQuery(
    GET_PHOTOS,
    {
      variables: {userId: user.sub, offset: 0, limit: 3},
      context: {headers: {Authorization: 'Bearer ' + token}}
    }
  );

  useEffect(() => {
    getTokenSilently().then(setToken).then(getPhotos).then(() => {
      if (data && data.photosByUser.length > 0) showSuccessMessage('Fetched photos successfully.')
    });
  }, []);

  if (!token) return <Loading/>;
  if (error) showErrorMessage(error.message);

  const loadMore = () => fetchMore({
    variables: {offset: data.photosByUser.length},
    updateQuery: paginateOver('photosByUser')
  });

  const onPhotoUploadedHandler = photo => updateQuery(prepend('photosByUser', photo));

  return (
    <div className="profile">
      <div className="user">
        <div className="user-details">
          {(user && user.picture) ? <Avatar src={user.picture}/> : <Avatar icon="user"/>}
          <Text strong className="user-name">{user && user.name ? user.name : "User"}</Text>
        </div>
        <Uploader onPhotoUploaded={onPhotoUploadedHandler}/>
      </div>
      <div className="user-gallery">
        {
          data && data.photosByUser
            ? <Gallery photos={data.photosByUser}/>
            : <Loading/>
        }
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
