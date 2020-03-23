import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { Button, Radio, Empty } from 'antd';
import { EditOutlined  } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Descriptions } from 'antd';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { Tag } from 'antd';
import { Select} from 'antd';
import { notification } from 'antd';
import { Typography} from 'antd';

const { Option } = Select;
const { Title} = Typography;
const { TabPane } = Tabs;


function callback(key) {
  console.log(key);
}

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};





function Profile(props) {
    let history = useHistory();

    //////all state
    const allstates = <Select disabled={props.DisableBasic}>
    <Option value="AL">Alabama</Option>
    <Option value="AK">Alaska</Option>
    <Option value="AZ">Arizona</Option>
    <Option value="AR">Arkansas</Option>
    <Option value="CA">California</Option>
    <Option value="CO">Colorado</Option>
    <Option value="CT">Connecticut</Option>
    <Option value="DE">Delaware</Option>
    <Option value="DC">District Of Columbia</Option>
    <Option value="FL">Florida</Option>
    <Option value="GA">Georgia</Option>
    <Option value="HI">Hawaii</Option>
    <Option value="ID">Idaho</Option>
    <Option value="IL">Illinois</Option>
    <Option value="IN">Indiana</Option>
    <Option value="IA">Iowa</Option>
    <Option value="KS">Kansas</Option>
    <Option value="KY">Kentucky</Option>
    <Option value="LA">Louisiana</Option>
    <Option value="ME">Maine</Option>
    <Option value="MD">Maryland</Option>
    <Option value="MA">Massachusetts</Option>
    <Option value="MI">Michigan</Option>
    <Option value="MN">Minnesota</Option>
    <Option value="MS">Mississippi</Option>
    <Option value="MO">Missouri</Option>
    <Option value="MT">Montana</Option>
    <Option value="NE">Nebraska</Option>
    <Option value="NV">Nevada</Option>
    <Option value="NH">New Hampshire</Option>
    <Option value="NJ">New Jersey</Option>
    <Option value="NM">New Mexico</Option>
    <Option value="NY">New York</Option>
    <Option value="NC">North Carolina</Option>
    <Option value="ND">North Dakota</Option>
    <Option value="OH">Ohio</Option>
    <Option value="OK">Oklahoma</Option>
    <Option value="OR">Oregon</Option>
    <Option value="PA">Pennsylvania</Option>
    <Option value="RI">Rhode Island</Option>
    <Option value="SC">South Carolina</Option>
    <Option value="SD">South Dakota</Option>
    <Option value="TN">Tennessee</Option>
    <Option value="TX">Texas</Option>
    <Option value="UT">Utah</Option>
    <Option value="VT">Vermont</Option>
    <Option value="VA">Virginia</Option>
    <Option value="WA">Washington</Option>
    <Option value="WV">West Virginia</Option>
    <Option value="WI">Wisconsin</Option>
    <Option value="WY">Wyoming</Option>
  </Select>	;  

    //////////////////state

    ////// ////////class of graduation
    let d = new Date();
    let n = d.getFullYear();
    const classyears = [];
    for (let i = n; i < n+18; i++) {
    classyears.push(<Option value={i}>{i}</Option>);
    }
    const classyear =<Select disabled={props.DisableBasic}>{classyears}</Select>;
    /////////////////////

    //////////////////////GPA num ap and SAT score select boxes
    const GPA_scores_sbs = [];
    for (let i = 0.0; i <= 4.0; i+=0.1) {
      GPA_scores_sbs.push(<Option value={i.toFixed(1)}>{i.toFixed(1)}</Option>);
    }
    const GPA_scores_sb =<Select disabled={props.DisableScoreSchool}>{GPA_scores_sbs}</Select>;

    const Num_ap_passes =[];
    for (let i = 0; i <= 100; i++) {
      Num_ap_passes.push(<Option value={i}>{i}</Option>);
    }
    const Num_ap_pass =<Select disabled={props.DisableScoreSchool}>{Num_ap_passes}</Select>;


    /////////////////////


    ///////////////////////////////////////////////////////below are all for edit applications
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const appStatus = <Select>
                    <Option value="accepted">accepted</Option>
                    <Option value="pending">pending</Option>
                    <Option value="wait-list">wait-list</Option>
                    <Option value="rejected">rejected</Option>
                    </Select>;
    const appcolleges =<Select ><Option value ="SBU">SBU</Option><Option value ="Massachusetts Institute of Technology" >Massachusetts Institute of Technology</Option> </Select> ;
    
    const EditableCell = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    }) => {
      
              
      const inputNode = dataIndex==='college' ? appcolleges:appStatus;
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
              rules={[ {required: true},]}
            >
              {inputNode}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };

    const isEditing = record => record.key === editingKey;

    const edit = record => {
      form.setFieldsValue({ ...record });
      setEditingKey(record.key);
    };

    const cancel = () => {
      setEditingKey('');
    };

    const deletes = async key => {
      const newData = [...props.Applications];//old data
      const index = newData.findIndex(item => key === item.key);
      const deleteitem = newData[index];
      
      const res = await axios.post('/deleteApplication', {
        userid: props.Student.userid,
        college: deleteitem.college,
      });
      if(res.data.status==="err"){
        notification.open({
          message: "Declined" ,
          description: "Delete Unsucessfully, Try again",
          duration:2.5 
        });
      }
      else{
        props.setApplications(res.data.applications);
        notification.open({
          message: "Successfully Delete an Application" ,
          //description: res.data.applications[].college,
          duration:2.5 
        });

      }
      
    };

    const save = async key => {
      try {
        const row = await form.validateFields();//new data
        const newData = [...props.Applications];//old data
        const index = newData.findIndex(item => key === item.key);
        let validator = false;
        
        for (let i =0; i< newData.length; i++) {
          if(newData[i].college === row.college && i!=index){
            validator = true;
          }
        }
        
        if(validator){
          notification.open({
            message: "Declined" ,
            description: row.college+" is already in the list",
            duration:2.5 
          });
          history.push('/profile');
        }
        else if (index > -1) {//edit the data
          const item = newData[index];
          const res = await axios.post('/updateApplication', {
            userid: props.Student.userid,
            college: item.college,
            newcollege: row.college,
            newstatus: row.status
          });
            notification.open({
            message: "Successfully Edit an Application" ,
            duration:2.5 
          });
          props.setApplications(res.data.applications);
          setEditingKey('');
        } else {
          newData.push(row);
          props.setApplications(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        notification.open({
          message: "Declined2" ,
          description: errInfo,
          duration:2.5 
        });
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
      {
        title: 'College',
        dataIndex: 'college',
        width: '25%',
        editable: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: '25%',
        editable: true,
      },
      {
        title: 'Questionable',
        dataIndex: 'questionable',
        width: '30%',
        editable: false,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a
                href="javascript:;"
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </a>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
          );
        },
      },
      {
        title: 'operation2',
        dataIndex: 'operation2',
        render: (_, record) => {
          return(
              <a
              href="javascript:;"
              onClick={() => deletes(record.key)}
              style={{
                marginRight: 8,
              }}
              >
              delete
              </a>
          );
        },
      },
    ];
    const mergedColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    
    /////////////////////////////////////////////////////////////above are all for edit applications

const SAT_brew_and_math_sbs = [];
for (let i = 200; i <= 800; i+=10) {
  SAT_brew_and_math_sbs.push(<Option value={i}>{i}</Option>);
}
const SAT_brew_and_math_sb =<Select  disabled={props.DisableScoreSAT}>{SAT_brew_and_math_sbs}</Select>;

const ACT_sbs = [];
for (let i = 1; i <= 36; i++) {
  ACT_sbs.push(<Option value={i}>{i}</Option>);
}
const ACT_sb =<Select  disabled={props.DisableScoreACT}>{ACT_sbs}</Select>;



const SAT_sub_sbs = [];
for (let i = 500; i <= 800; i+=10) {
  SAT_sub_sbs.push(<Option value={i}>{i}</Option>);
}
const SAT_sub_sb =<Select disabled={props.DisableScoreSATSub}>{SAT_sub_sbs}</Select>;



    ///////////////

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
                            <Form.Item label="Residence State" name="ResidenceState">{allstates}</Form.Item>
                            <Form.Item label="High School" name="HighSchool"><Input disabled={props.DisableBasic} /></Form.Item>
                            <Form.Item label="High School City" name="HighSchoolCity"><Input disabled={props.DisableBasic}/></Form.Item>
                            <Form.Item label="High School State" name="HighSchoolState">{allstates}</Form.Item>
                            <Form.Item label="College Class" name="CollegeClass">{classyear}</Form.Item>
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
                          <Form.Item label="GPA" name="GPA">{GPA_scores_sb}</Form.Item>
                        <Form.Item label="Num AP Passed" name="NumAPPassed">{Num_ap_pass}</Form.Item>
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
                          <Form.Item label="SAT EBRW" name="SATEBRW">{SAT_brew_and_math_sb}</Form.Item>
                          <Form.Item label="SAT Math" name="SATMath">{SAT_brew_and_math_sb}</Form.Item>
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
                          <Form.Item label="ACT English" name="ACTEnglish">{ACT_sb}</Form.Item>
                          <Form.Item label="ACT Reading" name="ACTReading">{ACT_sb}</Form.Item>
                          <Form.Item label="ACT Math" name="ACTMath">{ACT_sb}</Form.Item>
                          <Form.Item label="ACT Science" name="ACTScience">{ACT_sb}</Form.Item>
                        <Form.Item label="ACT Composite" name="ACTComposite">{props.Student.ACT_composite}</Form.Item>
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
                        <Form.Item label="SAT Literature" name="SATLiterature">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT US Hist" name="SATUSHist">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT World Hist" name="SATWorldHist">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Math I" name="SATMathI">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Math II" name="SATMathII">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Eco Bio" name="SATEcoBio">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Mol Bio" name="SATMolBio">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Chemistry" name="SATChemistry">{SAT_sub_sb}</Form.Item>
                          <Form.Item label="SAT Physics" name="SATPhysics">{SAT_sub_sb}</Form.Item>
                          <Form.Item >
                              <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                                {props.saveOreditScoreSATSub}
                              </Button>
                          </Form.Item>
                      </Form>
                    </TabPane>
                    <TabPane className="profile_tabpane" tab="Applications" key="3">
                    <Form form={form} component={false} >
                      <Table
                        components={{
                          body: {
                            cell: EditableCell,
                          },
                        }}
                        bordered
                        dataSource={props.Applications}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                          onChange: cancel,
                        }}
                      />
                    </Form>
                    <Form
                        className="Edit_basic_info"
                        name="basic_info"
                        initialValues={{ remember: true }}
                        onFinish={props.handleAddNewApp}
                        onFinishFailed={onFinishFailed}
                    >
                        
                      <Form.Item label="College" name="college"  rules={[ {required: true},]} style={{ width:500 }}>{appcolleges }</Form.Item>
                      <Form.Item label="Status" name="status"  rules={[ {required: true},]} style={{ width:500 }}>{appStatus}</Form.Item>
                      <Form.Item >
                        <Button type="primary" htmlType="submit" shape="round" style={{ marginTop: 16 }}>
                          Add an Application
                        </Button> 
                      </Form.Item>
                    </Form>
                              
                    </TabPane>
                </Tabs>
            </div>
     );
}

export default Profile; 