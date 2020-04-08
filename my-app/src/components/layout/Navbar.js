import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';



function Navigation_bar (props){

  const menu = (
    <Menu className="Icon_Menu">
      {!props.user &&
          <React.Fragment>
            <Menu.Item className="Icon_menu_1" key="1">
              <Link  className="Icon_menu_text" to="/signin"><button className="Icon_menu_link">Login</button></Link>
            </Menu.Item>
          </React.Fragment>
      }
      {props.user &&
          <React.Fragment>
              <Menu.Item className="Icon_menu_1" key="0">
              <Link className="Icon_menu_text" to="/profile"><button className="Icon_menu_link"  onClick={props.handlereset}>Profile</button></Link>
              </Menu.Item>
              <Menu.Item className="Icon_menu_1" key="2">
              <Link  className="Icon_menu_text"><button className="Icon_menu_link" onClick={props.handleLogout}>Logout</button></Link>
              </Menu.Item>
          </React.Fragment>
        }
    </Menu>
  );


    return (
        <nav className="Navi">
          <Link id="title" className="tab" to="/">C4me</Link>
          <Link className="tab" to="">Home</Link>
           {/* User logined */}
           {props.user && props.admin=="admin" &&
            <React.Fragment>
              <Link className="tab" to={"/scrape"}>Scrape</Link>
              <Link className="tab" to={"/questionable"}>Questionable students</Link>
            </React.Fragment>
          }
           {props.user && props.admin=="student" &&
            <React.Fragment>
              <Link className="tab" to={"/searchhighschool"}>Find Similar High School</Link>
              <Link className="tab" to={"/searchcollege"}>Search for College</Link>
            </React.Fragment>
          }
          {/* User not logined */}
          {!props.user &&
            <React.Fragment>

            </React.Fragment>
          }
            <React.Fragment>
                <Dropdown className="Profilebut" overlay={menu}>
                    <UserOutlined className="Profile_icon"  style={{ fontSize: '40px', color: 'yellow' }}/>
                </Dropdown>
            </React.Fragment>
        </nav>
    );
}

export default Navigation_bar;