import React from 'react';
import {useAuth0} from '../react-auth0-wrapper';
import {Link, useLocation} from 'react-router-dom';
import {Menu} from 'antd';
import '../styles/navbar.css';

const NavBar = () => {
  const {isAuthenticated, logout} = useAuth0();
  const {pathname} = useLocation();

  const menuItems = isAuthenticated
    && [
      <Menu.Item key="/users"><Link to="/users">Users</Link></Menu.Item>,
      <Menu.Item key="/profile"><Link to="/profile">Profile</Link></Menu.Item>,
      <Menu.Item key="/logout" onClick={() => logout()}>Log out</Menu.Item>
    ];

  return (
    <div className="nav-bar">
      <div className="app-title">Photo Gallery App</div>
      <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]} style={{lineHeight: '64px'}}>
        {menuItems}
      </Menu>
      {isAuthenticated && (
        <span>

        </span>
      )}
    </div>
  );
};

export default NavBar;
