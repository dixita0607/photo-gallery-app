import React from 'react';
import {Icon} from 'antd';
import '../styles/loading.css';

const Loading = () => (
  <div className="loading">
    <Icon style={{fontSize: 48}} type="loading"/>
  </div>
);

export default Loading;
