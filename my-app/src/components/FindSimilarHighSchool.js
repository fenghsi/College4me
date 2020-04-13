import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { Typography} from 'antd';
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import HighschoolImg from '../images/highschool.jpg';
import RankingImg from '../images/college_rank.jpg';
import UProfpic from '../images/prof.png';
import AppTrack from '../images/app_track.png';
import { Select } from 'antd';
import { Button } from 'antd';
import { Table, Input, Popconfirm, Form } from 'antd';
import {AutoComplete } from 'antd';
import { Layout } from 'antd';
import { notification } from 'antd';

const { Header, Footer, Sider, Content } = Layout;


const { Option } = Select;
const { Meta } = Card;
const { Title, Paragraph } = Typography;


function handleChange(value) {
  console.log(`selected ${value}`);
}


//This function acts a handler (E.g., connects a button to an action)
function FindSimilarHighSchool(props) {
  let history = useHistory();
  const [testmsg, settestmsg] = useState(null);
  const location = useLocation();
  const [keyword, setKeyword] = useState({HighSchoolSearchBox:''});


  const [options, setOptions] = useState([
    { value : "Academic Magnet High School, North Charleston, SC"},
    { value : "Academy for Information Technology, Scotch Plains, NJ"},
    { value : "Alpharetta High School, Alpharetta, GA"},
    { value : "Aragon High School, San Mateo, CA"},
    { value : "Arcadia High School, Arcadia, OH"},
    { value : "Arizona College Prep Erie Campus, Chandler, AZ"},
    { value : "Ashley Ridge High School, Summerville, SC"},
    { value : "Baccalaureate School for Global Education, Long Island City, NY"},
    { value : "Bard High School Early College, New York, NY"},
    { value : "BASIS Flagstaff, Flagstaff, AZ"},
    { value : "BASIS Tucson North, Tucson, AZ"}
  ]);


  async function handleFindHS(event){
    // setKeyword(event);
    // event.preventDefault();

    const hs_results = await axios.post('/find_similar_high_school', {
        keyword: event.HighSchoolSearchBox
    });
    if(hs_results.data.status == "non-exist"){
      notification.open({
        message: "High School Not Known to c4me System",
        description: "Currently no student had entered "+ event.HighSchoolSearchBox +" in the profile, please select a different high school to search ",
        duration:2.5 
      });
    }

    history.push('/searchhighschool');
   
}



    return (
      <Layout>
      <Header >
      <Form
            className="Find_Similar_HS_Form"
            name="Find_High_School"
            onFinish={handleFindHS}
            style={{margin:'10px 10px 10px 10px'} }
            > 
            <Form.Item  name="HighSchoolSearchBox">
                <AutoComplete
                    dropdownMatchSelectWidth={"100%"}
                    style={{ width: "100%" }}
                    options={options}
                    defaultValue = {keyword.HighSchoolSearchBox}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().includes(inputValue.toUpperCase()) 
                    }
                    autoFocus = {true}
                >
                    <Input.Search style={{width:'100%'} }size="large" placeholder="Enter a High School to Search" />
                </AutoComplete>
            </Form.Item>
          </Form>
      </Header>
      </Layout>





      // <div>
      // <Form
      //     className = 'HSMsg'>
      //       <Title level={4}>Please enter a high school to search below</Title>
        

/* 
        <Select className = 'dropbox' defaultValue="Select a High School" style={{ width: 200 }} onChange={handleChange}>

          <Option value="High School A">High School A</Option>
          <Option value="High School B">High School B</Option>
          <Option value="High School C">High School C</Option>
          <Option value="High School D">High School D</Option>
          <Option value="High School E">High School E</Option>
          <Option value="High School F">High School F</Option>
          <Option value="High School G">High School G</Option>
        </Select> */
 
    
    );
}

export default FindSimilarHighSchool;