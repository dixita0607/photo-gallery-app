import React from 'react';
import {Card} from 'antd';
import '../styles/gallery.css';

const Gallery = ({photos}) => (
  <div className="gallery-container">
    {
      photos.map(photo =>
        <Card className="image-card" key={photo._id}>
          <img className="photo" src={photo.url} alt="Upload"/>
        </Card>
      )
    }
  </div>
);

export default Gallery;
