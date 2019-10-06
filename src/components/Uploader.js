import React, {useState} from 'react';
import {Upload, Icon, Button} from 'antd';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useAuth0} from "../react-auth0-wrapper";
import {showErrorMessage, showSuccessMessage} from '../utils';

const UPLOAD_PHOTO = gql`
  mutation($photo: Upload!) {
    uploadPhoto(photo: $photo) {
      _id,
      url
      uploadedAt
    }
  }
`;

export default ({onPhotoUploaded}) => {
  const {getTokenSilently} = useAuth0();
  const [uploadPhoto, {loading: uploadingPhoto}] = useMutation(UPLOAD_PHOTO);
  const [photo, setPhoto] = useState(null);

  const beforeUpload = photo => {
    if (photo.size > (1024 * 1024 * 5)) {
      showErrorMessage(`Can't upload file having size greater than 5MB.`);
      return false;
    }
    setPhoto(photo);
    return false;
  };

  const upload = async () => {
    return uploadPhoto({
      variables: {photo},
      context: {
        headers: {
          Authorization: 'Bearer ' + await getTokenSilently()
        }
      }
    })
      .then(({data}) => {
        showSuccessMessage('Photo uploaded successfully');
        onPhotoUploaded(data.uploadPhoto);
      })
      .catch(error => showErrorMessage(error.message))
      .finally(() => setPhoto(null));
  };

  return (
    <>
      <Upload accept=".png,.jpeg,.gif,.svg,.jpg"
              beforeUpload={beforeUpload}
              fileList={photo ? [photo] : []}
              onRemove={() => setPhoto(null)}
      >
        <Button><Icon type={uploadingPhoto ? 'loading' : 'plus'}/> Select Photo</Button>
      </Upload>
      <Button disabled={!photo || uploadingPhoto} loading={uploadingPhoto}
              onClick={upload}>{uploadingPhoto ? 'Uploading' : 'Upload photo'}
      </Button>
    </>
  );
};
