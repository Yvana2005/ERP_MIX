import {
  MenuFoldOutlined,
  MenuOutlined,
  DownOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useContext } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { Button, Col, Row, Typography,  Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import 
{ BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill,BsHeartPulse, BsPeopleFill, BsGraphUpArrow  }
 from 'react-icons/bs';
 import { ModuleContext } from './ModuleContext';
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>
];

function Header({ onPress, collapsed, handleCollapsed }) {
  const { selectedModule, handleModuleClick } = useContext(ModuleContext);
  useEffect(() => window.scrollTo(0, 0));
  
  const isLogged = localStorage.getItem("isLogged");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role"); // Ajouté pour récupérer le rôle de l'utilisateur

  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  const [activeModule, setActiveModule] = useState(null);


  useEffect(() => {
    let themeClass = isDarkMode ? "dark-theme" : "light-theme";
    if (role === "Professionnel") {
      themeClass += " professional-sidenav-bg";
    }
    if (role === "Particulier") {
      themeClass += " particular-sidenav-bg";
    }
    document.body.className = themeClass;
  }, [isDarkMode, role]);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs={24} md={3}>
          <div className={styles.sidebarTogglerPC}>
            {isLogged &&
              React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: `${styles.trigger}`,
                  onClick: () => handleCollapsed(!collapsed)
                }
              )}
          </div>
        </Col>
        {isLogged && role !== "Professionnel" && role !== "Particulier" && (
          <>
        <Col xs={24} md={4}>
           
          <a href="/dashboardsms"><div className={`topButton ${selectedModule === "MSC" ? "active-button" : ""}`} onClick={() => handleModuleClick('MSC')}>
                  <BsGraphUpArrow className='card_icon'/> SMS 
                  {/* <h3 style={{fontSize : "120%"}}>SMS</h3> style={{color:"#b029b0"}}*/}
            </div></a>
          
        </Col>
          
        <Col xs={24} md={4}>
          <a href="/dashboardsms" ><div className={`topButton ${selectedModule === "MV" ? "active-button" : ""}`} onClick={() => handleModuleClick('MV')}>
                  <BsFillArchiveFill className='card_icon'/> VENTES
                  {/* <h3 style={{fontSize : "120%"}}>VENTES</h3> style={{color:"#b029b0"}} */}
            </div></a>
        </Col>
          
        <Col xs={24} md={4}>
          <a href="/admin/dashboardrh"><div className={`topButton ${selectedModule === "MR" ? "active-button" : ""}`} onClick={() => handleModuleClick('MR')}>
                  <BsPeopleFill className='card_icon'/> RH
                  {/* <h3 style={{fontSize : "120%"}}>RH</h3> #1890ff*/}
            </div></a>
        </Col>

        <Col xs={24} md={4}>
          <a href="/admin/dashboardrh"><div className='topButton' onClick={() => handleModuleClick('MR')}>
                  <BsHeartPulse className='card_icon'/> SOINS
                  {/* <h3 style={{fontSize : "120%"}}>RH</h3> #1890ff*/}
            </div></a>
        </Col>
        </>
        )}
        <Col xs={24} md={5} className={styles.headerControl}>
          <DarkModeSwitch
            style={{ margin: "1rem" }}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={20}
          />
          {isLogged && (
            <Typography.Title level={5} style={{ margin: 0 }} className="me-3">
              <UserOutlined style={{ fontSize: "16px" }} /> {user}
            </Typography.Title>
          )}

          {isLogged ? (
            <Link to="/auth/logout" className={styles.logoutLink}>
              <LogoutOutlined className="text-danger" />
              <span className="logout-text font-weight-bold">
                Se déconnecter
              </span>
            </Link>
          ) : (
            <Link to="/auth/login" className="btn-sign-in text-dark">
              <span></span>
            </Link>
          )}
          {isLogged && (
            <Button
              type="link"
              className={styles.sidebarTogglerMobile}
              onClick={() => onPress()}
              style={{ boxShadow: "none" }}
            >
              <MenuOutlined
                className={`${styles.hamburgerMenuIcon} hamburger-menu-icon`}
              />
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Header;
