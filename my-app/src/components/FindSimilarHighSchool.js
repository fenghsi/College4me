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


  async function findhandler(event){
    event.preventDefault();
    
    const studentprofile = await axios.post('/delete_all_student_profiles', {
        id:1
    });
    history.push('/searchhighschool');
   
}


    
    

    return (
      <class>
          <div className = 'HSMsg'>
            <Title level={4}>Please select a high school</Title>
          </div>



        <Select className = 'dropbox' defaultValue="Select a High School" style={{ width: 200 }} onChange={handleChange}>
          <Option value="High School A">High School A</Option>
          <Option value="High School B">High School B</Option>
          <Option value="High School C">High School C</Option>
          <Option value="High School D">High School D</Option>
          <Option value="High School E">High School E</Option>
          <Option value="High School F">High School F</Option>
          <Option value="High School G">High School G</Option>
        </Select>


        <div>
          <Button>Search</Button>
        </div> 



      </class>
    
    );
}

export default FindSimilarHighSchool;