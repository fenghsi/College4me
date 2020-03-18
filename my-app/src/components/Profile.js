import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { Button, Radio, Empty } from 'antd';
import { EditOutlined  } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Descriptions } from 'antd';
import { Table, Tag } from 'antd';
import { Form, Input,  Select} from 'antd';
import { notification } from 'antd';
import { Typography} from 'antd';
const { Title} = Typography;


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

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};



function Profile(props) {
    let history = useHistory();
    
    
    return (
            <div>
                <Tabs className="profile_tab" defaultActiveKey="1" onChange={callback}>
                    <TabPane></TabPane>
                    <TabPane className="profile_tabpane" tab="Basic Info" key="1">
                        <Form
                        className="Edit_basic_info"
                        name="basic_info"
                        initialValues={{ remember: true }}
                        onFinish={props.handleEditBasicInfo}
                        onFinishFailed={onFinishFailed}
                        initialValues={{
                          username: props.Student.username,
                          ResidenceState: props.Student.residence_state,
                          HighSchool: props.Student.high_school_name,
                          HighSchoolCity:props.Student.high_school_city,
                          HighSchoolState:props.Student.high_school_state,
                          CollegeClass: props.Student.college_class,
                          FirstMajor: props.Student.major_1,
                          SecondMajor: props.Student.major_2, 
                          prefix: '86',
                        }}
                        >   <Title>Basic Info</Title>
                            <Form.Item label="Username" name="username" rules={[ {required: true},]}>
                              <Input disabled={props.DisableBasic}/> 
                            </Form.Item>
                            <Form.Item label="Residence State" name="ResidenceState"><Input disabled={props.DisableBasic} /></Form.Item>
                            <Form.Item label="High School" name="HighSchool"><Input disabled={props.DisableBasic} /></Form.Item>
                            <Form.Item label="High School City" name="HighSchoolCity"><Input disabled={props.DisableBasic}/></Form.Item>
                            <Form.Item label="High School State" name="HighSchoolState"><Input disabled={props.DisableBasic} /></Form.Item>
                            <Form.Item label="College Class" name="CollegeClass"><Input disabled={props.DisableBasic} /></Form.Item>
                            <Form.Item label="First Major" name="FirstMajor"><Input disabled={props.DisableBasic}/></Form.Item>
                            <Form.Item label="Second Major" name="SecondMajor"><Input disabled={props.DisableBasic}/></Form.Item>
                            <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />}  >
                                {props.saveOreditBasic}
                              </Button>
                           </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane className="profile_tabpane" tab="Scores & Grades" key="2">

                      <Form
                          className="Edit_basic_info"
                          name="profile_score_school"
                          initialValues={{ remember: true }}
                          onFinish={props.handleEditScoreSchool}
                          onFinishFailed={onFinishFailed}
                          initialValues={{
                            GPA: props.Student.GPA,
                            NumAPPassed: props.Student.num_AP_passed,
                            prefix: '86',
                          }}>
                          <Title>School</Title>
                          <Form.Item label="GPA" name="GPA"><Input disabled={props.DisableScoreSchool} /></Form.Item>
                          <Form.Item label="Num AP Passed" name="NumAPPassed"><Input disabled={props.DisableScoreSchool}/></Form.Item>
                          <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                               {props.saveOreditScoreSchool}
                              </Button>
                          </Form.Item>
                      </Form>
                      <Form
                          className="Edit_basic_info"
                          name="profile_score_SAT"
                          initialValues={{ remember: true }}
                          onFinish={props.handleEditScoreSAT}
                          onFinishFailed={onFinishFailed}
                          initialValues={{
                            SATEBRW: props.Student.SAT_EBRW,
                            SATMath: props.Student.SAT_math,
                            prefix: '86',
                          }}>
                          <Title>SAT</Title>
                          <Form.Item label="SAT EBRW" name="SATEBRW"><Input disabled={props.DisableScoreSAT}/></Form.Item>
                          <Form.Item label="SAT Math" name="SATMath"><Input disabled={props.DisableScoreSAT}/></Form.Item>
                          <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                              {props.saveOreditScoreSAT}
                              </Button>
                          </Form.Item>
                      </Form>
                      <Form
                          className="Edit_basic_info"
                          name="profile_score_ACT"
                          initialValues={{ remember: true }}
                          onFinish={props.handleEditScoreACT}
                          onFinishFailed={onFinishFailed}
                          initialValues={{
                            ACTEnglish: props.Student.ACT_English,
                            ACTReading: props.Student.ACT_reading,
                            ACTMath: props.Student.ACT_math,
                            ACTScience: props.Student.ACT_science,
                            ACTComposite: props.Student.ACT_composite,
                            prefix: '86',
                          }}>
                          <Title>ACT</Title>
                          <Form.Item label="ACT English" name="ACTEnglish"><Input disabled={props.DisableScoreACT}/></Form.Item>
                          <Form.Item label="ACT Reading" name="ACTReading"><Input disabled={props.DisableScoreACT}/></Form.Item>
                          <Form.Item label="ACT Math" name="ACTMath"><Input disabled={props.DisableScoreACT}/></Form.Item>
                          <Form.Item label="ACT Science" name="ACTScience"><Input disabled={props.DisableScoreACT}/></Form.Item>
                          <Form.Item label="ACT Composite" name="ACTComposite"><Input disabled={props.DisableScoreACT}/></Form.Item>
                          <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                              {props.saveOreditScoreACT}
                              </Button>
                          </Form.Item>
                      </Form>
                      <Form
                          className="Edit_basic_info"
                          name="profile_score_ACT"
                          initialValues={{ remember: true }}
                          onFinish={props.handleEditScoreSubject}
                          onFinishFailed={onFinishFailed}
                          initialValues={{
                            SATLiterature: props.Student.SAT_literature,
                            SATUSHist: props.Student.SAT_US_hist,
                            SATWorldHist: props.Student.SAT_world_hist,
                            SATMathI: props.Student.SAT_math_I,
                            SATMathII: props.Student.SAT_math_II,
                            SATEcoBio: props.Student.SAT_eco_bio,
                            SATMolBio: props.Student.SAT_mol_bio,
                            SATChemistry: props.Student.SAT_chemistry,
                            SATPhysics: props.Student.SAT_physics,
                            prefix: '86',
                          }}>
                          <Title>SAT Subject Test</Title>
                          <Form.Item label="SAT Literature" name="SATLiterature"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT US Hist" name="SATUSHist"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT World Hist" name="SATWorldHist"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Math I" name="SATMathI"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Math II" name="SATMathII"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Eco Bio" name="SATEcoBio"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Mol Bio" name="SATMolBio"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Chemistry" name="SATChemistry"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item label="SAT Physics" name="SATPhysics"><Input disabled={props.DisableScoreSATSub}/></Form.Item>
                          <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                                {props.saveOreditScoreSATSub}
                              </Button>
                          </Form.Item>
                      </Form>
                    </TabPane>
                    <TabPane className="profile_tabpane" tab="Applications" key="3">
                        <Table columns={columns} dataSource={data} />                    
                    </TabPane>
                </Tabs>
            </div>
     );
}

export default Profile; 