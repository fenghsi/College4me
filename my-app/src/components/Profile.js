import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { Tabs } from 'antd';
import { Descriptions } from 'antd';
import { Table, Tag } from 'antd';




const { TabPane } = Tabs;
const columns = [
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status =>
          {
            let color = (status==="accepted") ? 'green' :((status==="rejected")? 'red':((status==="pending")? 'yellow':'blue'));
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          }
    },
    {
      title: 'Questionable',
      dataIndex: 'questionable',
      key: 'questionable',
      render: questionable=> {
            let color = (questionable==="Yes") ? 'red' : 'green';
            return (
              <Tag color={color} key={questionable}>
                {questionable.toUpperCase()}
              </Tag>
            );
          },
    },
   
    
  ];
  
  const data = [
    {
      key: '1',
      college: 'Stony Brook University',
      status: "rejected",
      questionable: "Yes"
    },
    {
        key: '2',
        college: 'Baruch University',
        status: "pending",
        questionable: "No"
    },
    {
        key: '3',
        college: 'Harvard University',
        status: "accepted",
        questionable: "No"
    },
    {
        key: '3',
        college: 'Binghamton University',
        status: "wait-listed",
        questionable: "Yes"
    },
    
  ];
function callback(key) {
  console.log(key);
}


function Profile(props) {

    return (
            <div>
                <Tabs className="profile_tab" defaultActiveKey="1" onChange={callback}>
                    <TabPane></TabPane>
                    <TabPane className="profile_tabpane" tab="Basic Info" key="1">
                        <Descriptions  className="profile_basic" title="Basic Info">
                            <Descriptions.Item className="pb_col-1" label="UserName">{props.Student.username}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="Residence State">{props.Student.residence_state}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="High School">{props.Student.high_school_name}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="High School City">{props.Student.high_school_city}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="High School State">{props.Student.high_school_state}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="College Class">{props.Student.college_class}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="First Major">{props.Student.major_1}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="Second Major">{props.Student.major_2}</Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane className="profile_tabpane" tab="Scores & Grades" key="2">
                        <Descriptions className="profile_basic" title="School">
                            <Descriptions.Item className="pb_col-1" label="GPA">{props.Student.GPA}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="Num AP Passed">{props.Student.num_AP_passed}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions className="profile_basic" title="SAT">
                            <Descriptions.Item className="pb_col-1" label="SAT EBRW">{props.Student.SAT_EBRW}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Math">{props.Student.SAT_math}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions className="profile_basic" title="ACT">
                            <Descriptions.Item className="pb_col-1" label="ACT English">{props.Student.ACT_English}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="ACT Reading">{props.Student.ACT_reading}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="ACT Math">{props.Student.ACT_math}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="ACT Science">{props.Student.ACT_science}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="ACT Composite">{props.Student.ACT_composite}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions className="profile_basic" title="SAT II">
                            <Descriptions.Item className="pb_col-1" label="SAT Literature">{props.Student.SAT_literature}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT US Hist">{props.Student.SAT_US_hist}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT World Hist">{props.Student.SAT_world_hist}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Math I">{props.Student.SAT_math_I}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Math II">{props.Student.SAT_math_II}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Eco Bio">{props.Student.SAT_eco_bio}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Mol Bio">{props.Student.SAT_mol_bio}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Chemistry">{props.Student.SAT_chemistry}</Descriptions.Item>
                            <Descriptions.Item className="pb_col-1" label="SAT Physics">{props.Student.SAT_physics}</Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                                   
                    <TabPane className="profile_tabpane" tab="Applications" key="3">
                        <Table columns={columns} dataSource={data} />                    
                    </TabPane>
                </Tabs>
            </div>
     );
}

export default Profile; 