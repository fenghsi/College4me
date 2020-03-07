import React from 'react';
import { Link } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';


function Navigation_bar (props){


    return (
        <nav className="Navi">
            <React.Fragment>
                <Link id="title" className="tab" to="/">C4me</Link>
                <Link className="tab" to="">Home</Link>
                <Link className="tab" to={""}>Find Similar High School</Link>
                <Link className="tab" to={""}>Search for College</Link>
                <Link className="Profilebut"to={"/profile"}><UserOutlined className="Profile_icon"  style={{ fontSize: '40px', color: 'yellow' }}/><span class="tooltiptext">Profile</span></Link>
            </React.Fragment>
        </nav>
        
    );
}

export default Navigation_bar;