import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { Button } from 'antd';
import { EditOutlined  } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Table, Input, Popconfirm, Form } from 'antd';
import { Select} from 'antd';
import { notification } from 'antd';
import { Typography} from 'antd';

const { Option } = Select;
const { Title} = Typography;
const { TabPane } = Tabs;


function Profile(props) {
    let history = useHistory();
    const [tabpanekey, setTabpanekey] = useState("1");

    function callback(key) {
      setTabpanekey(""+key);
    }
    
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    
    //////all state
    const allstates = <Select  style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}>
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
  </Select> ;  
    //////////////////state

    //////////////////////class of graduation
    let d = new Date();
    let n = d.getFullYear();
    const classyears = [];
    for (let i = n; i < n+18; i++) {
      classyears.push(<Option value={i}>{i}</Option>);
    }
    const classyear =<Select style={{width:340, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}>{classyears}</Select>;
    /////////////////////

    //////////////////////GPA num ap and SAT score select boxes
    const GPA_scores_sbs = [];
    for (let i = 0.0; i <= 4.0; i+=0.1) {
      GPA_scores_sbs.push(<Option value={i.toFixed(1)}>{i.toFixed(1)}</Option>);
    }
    const GPA_scores_sb =<Select  style={{width:355, padding: "0 0 5px 10px"}} disabled={props.DisableScoreSchool}>{GPA_scores_sbs}</Select>;

    const Num_ap_passes =[];
    for (let i = 0; i <= 100; i++) {
      Num_ap_passes.push(<Option value={i}>{i}</Option>);
    }
    const Num_ap_pass =<Select style={{width:280, padding: "0 0 5px 10px"}} disabled={props.DisableScoreSchool}>{Num_ap_passes}</Select>;
    /////////////////////


    ///////////////////////////////////////////////////////below are all for edit applications

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const appStatus = <Select style={{width:417, padding: "0 0 5px 10px"}}>
                    <Option value="accepted">accepted</Option>
                    <Option value="pending">pending</Option>
                    <Option value="wait-listed">wait-listed</Option>
                    <Option value="denied">denied</Option>
                    <Option value="deferred">deferred</Option>
                    <Option value="withdrawn">withdrawn</Option>
                    </Select>;
    const appcolleges =<Select style={{width:410, padding: "0 0 5px 10px"}}>
    <Option value ="American University">American University</Option>
    <Option value ="Barnard College">Barnard College</Option>
    <Option value ="Berry College">Berry College</Option>
    <Option value ="California State University, East Bay">California State University, East Bay</Option>
    <Option value ="California State University, Fresno">California State University, Fresno</Option>
    <Option value ="California State University, Monterey Bay">California State University, Monterey Bay</Option>
    <Option value ="Campbell University">Campbell University</Option>
    <Option value ="Carnegie Mellon University">Carnegie Mellon University</Option>
    <Option value ="Central Connecticut State University">Central Connecticut State University</Option>
    <Option value ="Centre College">Centre College</Option>
    <Option value ="Clarkson University">Clarkson University</Option>
    <Option value ="Colgate University">Colgate University</Option>
    <Option value ="Colorado College">Colorado College</Option>
    <Option value ="DePaul University">DePaul University</Option>
    <Option value ="DePauw University">DePauw University</Option>
    <Option value ="Drake University">Drake University</Option>
    <Option value ="Drexel University">Drexel University</Option>
    <Option value ="Eastern Illinois University">Eastern Illinois University</Option>
    <Option value ="Eastern Washington University">Eastern Washington University</Option>
    <Option value ="Florida Gulf Coast University">Florida Gulf Coast University</Option>
    <Option value ="Fordham University">Fordham University</Option>
    <Option value ="Franklin & Marshall College">Franklin & Marshall College</Option>
    <Option value ="Gannon University">Gannon University</Option>
    <Option value ="Gettysburg College">Gettysburg College</Option>
    <Option value ="Gordon College">Gordon College</Option>
    <Option value ="Hendrix College">Hendrix College</Option>
    <Option value ="Hope College">Hope College</Option>
    <Option value ="Idaho State University">Idaho State University</Option>
    <Option value ="Illinois College">Illinois College</Option>
    <Option value ="Indiana University Bloomington">Indiana University Bloomington</Option>
    <Option value ="Iona College">Iona College</Option>
    <Option value ="John Carroll University">John Carroll University</Option>
    <Option value ="Kalamazoo College">Kalamazoo College</Option>
    <Option value ="Kennesaw State University">Kennesaw State University</Option>
    <Option value ="Lawrence Technological University">Lawrence Technological University</Option>
    <Option value ="Manhattan College">Manhattan College</Option>
    <Option value ="Massachusetts Institute of Technology">Massachusetts Institute of Technology</Option>
    <Option value ="Mercer University">Mercer University</Option>
    <Option value ="Merrimack College">Merrimack College</Option>
    <Option value ="Mississippi State University">Mississippi State University</Option>
    <Option value ="Missouri University of Science and Technology">Missouri University of Science and Technology</Option>
    <Option value ="Moravian College">Moravian College</Option>
    <Option value ="Mount Holyoke College">Mount Holyoke College</Option>
    <Option value ="New Jersey Institute of Technology">New Jersey Institute of Technology</Option>
    <Option value ="New York University">New York University</Option>
    <Option value ="North Park University">North Park University</Option>
    <Option value ="Northwestern University">Northwestern University</Option>
    <Option value ="Nova Southeastern University">Nova Southeastern University</Option>
    <Option value ="Princeton University">Princeton University</Option>
    <Option value ="Providence College">Providence College</Option>
    <Option value ="Reed College">Reed College</Option>
    <Option value ="Rice University">Rice University</Option>
    <Option value ="Rider University">Rider University</Option>
    <Option value ="Rochester Institute of Technology">Rochester Institute of Technology</Option>
    <Option value ="Roger Williams University">Roger Williams University</Option>
    <Option value ="SUNY College of Environmental Science and Forestry">SUNY College of Environmental Science and Forestry</Option>
    <Option value ="Saint Louis University">Saint Louis University</Option>
    <Option value ="Salve Regina University">Salve Regina University</Option>
    <Option value ="Samford University">Samford University</Option>
    <Option value ="San Diego State University">San Diego State University</Option>
    <Option value ="School of the Art Institute of Chicago">School of the Art Institute of Chicago</Option>
    <Option value ="Siena College">Siena College</Option>
    <Option value ="Smith College">Smith College</Option>
    <Option value ="St Bonaventure University">St Bonaventure University</Option>
    <Option value ="Stevenson University">Stevenson University</Option>
    <Option value ="Stony Brook University">Stony Brook University</Option>
    <Option value ="Suffolk University">Suffolk University</Option>
    <Option value ="Temple University">Temple University</Option>
    <Option value ="Texas Christian University">Texas Christian University</Option>
    <Option value ="Texas Tech University">Texas Tech University</Option>
    <Option value ="The College of St Scholastica">The College of St Scholastica</Option>
    <Option value ="The College of Wooster">The College of Wooster</Option>
    <Option value ="Transylvania University">Transylvania University</Option>
    <Option value ="University of Alabama">University of Alabama</Option>
    <Option value ="University of Alabama at Birmingham">University of Alabama at Birmingham</Option>
    <Option value ="University of Arizona">University of Arizona</Option>
    <Option value ="University of Arkansas">University of Arkansas</Option>
    <Option value ="University of California, Davis">University of California, Davis</Option>
    <Option value ="University of California, Santa Barbara">University of California, Santa Barbara</Option>
    <Option value ="University of California, Santa Cruz">University of California, Santa Cruz</Option>
    <Option value ="University of Central Florida">University of Central Florida</Option>
    <Option value ="University of Delaware">University of Delaware</Option>
    <Option value ="University of Hartford">University of Hartford</Option>
    <Option value ="University of Houston">University of Houston</Option>
    <Option value ="University of Illinois at Chicago">University of Illinois at Chicago</Option>
    <Option value ="University of Kentucky">University of Kentucky</Option>
    <Option value ="University of Maine">University of Maine</Option>
    <Option value ="University of Massachusetts Amherst">University of Massachusetts Amherst</Option>
    <Option value ="University of Montana">University of Montana</Option>
    <Option value ="University of Nevada, Las Vegas">University of Nevada, Las Vegas</Option>
    <Option value ="University of Nevada, Reno">University of Nevada, Reno</Option>
    <Option value ="University of Richmond">University of Richmond</Option>
    <Option value ="University of San Diego">University of San Diego</Option>
    <Option value ="University of Utah">University of Utah</Option>
    <Option value ="Utah State University">Utah State University</Option>
    <Option value ="Vassar College">Vassar College</Option>
    <Option value ="Wagner College">Wagner College</Option>
    <Option value ="Washington & Jefferson College">Washington & Jefferson College</Option>
    <Option value ="Westmont College">Westmont College</Option>
    <Option value ="William Jewell College">William Jewell College</Option>
    <Option value ="Williams College">Williams College</Option>
</Select> ;
    
    
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
        await axios.post('/compute_hs_score', {
          high_school_name:props.Student.high_school_name,
          high_school_city: props.Student.high_school_city,
          high_school_state: props.Student.high_school_state
        });
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
          await axios.post('/compute_hs_score', {
            high_school_name:props.Student.high_school_name,
            high_school_city: props.Student.high_school_city,
            high_school_state: props.Student.high_school_state
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
const SAT_brew_and_math_sb =<Select style={{width:320, padding: "5px 0 5px 10px"}} disabled={props.DisableScoreSAT}>{SAT_brew_and_math_sbs}</Select>;

const ACT_sbs = [];
for (let i = 1; i <= 36; i++) {
  ACT_sbs.push(<Option value={i}>{i}</Option>);
}
const ACT_sb =<Select style={{width:320}} disabled={props.DisableScoreACT}>{ACT_sbs}</Select>;



const SAT_sub_sbs = [];
for (let i = 500; i <= 800; i+=10) {
  SAT_sub_sbs.push(<Option value={i}>{i}</Option>);
}
const SAT_sub_sb =<Select style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableScoreSATSub}>{SAT_sub_sbs}</Select>;



    ///////////////

    return (
            <div>
                <Tabs className="profile_tab" defaultActiveKey={tabpanekey} onChange={callback}>
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

                        > <Title className = "title_profile">Basic Information</Title>
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="Username" name="username" rules={[ {required: true},]}>
                              <Input style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}/> 
                            </Form.Item>

                            <Form.Item style  = {{margin: '0 480px', marginTop: 7}} label="Residence State" name="ResidenceState">{allstates}</Form.Item>
                            
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="High School" name="HighSchool"><Input style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic} /></Form.Item>
                            
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="High School City" name="HighSchoolCity"><Input style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}/></Form.Item>
                            
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="High School State" name="HighSchoolState">{allstates}</Form.Item>
                          
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="College Class" name="CollegeClass">{classyear}</Form.Item>
                           
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="First Major" name="FirstMajor"><Input style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}/></Form.Item>
                            
                            <Form.Item style = {{margin: '0 480px', marginTop: 7}} label="Second Major" name="SecondMajor"><Input style={{width:320, padding: "0 0 5px 10px"}} disabled={props.DisableBasic}/></Form.Item>
                            
                            <Form.Item >
                              <Button style = {{margin: '0 880px', marginTop: 30 }} type="primary" htmlType="submit" shape="round" icon={<EditOutlined />}  >
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

                          <Title className = "title_profile">Scores and Grades</Title>
                          <Title style = {{margin: '0 480px'}} class = "subtitleOfGradePage">School</Title>
                          <Form.Item style = {{margin: '0 500px'}} label="GPA" name="GPA">{GPA_scores_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="Num AP Passed" name="NumAPPassed">{Num_ap_pass}</Form.Item>
                          <Form.Item >
                              <Button style = {{margin: '0 850px', marginTop: 30}} type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
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
                          <Title style = {{margin: '0 480px'}} class = "subtitleOfGradePage">SAT</Title>
                          <Form.Item style = {{margin: '0 500px'}} style = {{margin: '0 500px'}} label="SAT EBRW" name="SATEBRW">{SAT_brew_and_math_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Math" name="SATMath">{SAT_brew_and_math_sb}</Form.Item>
                          <Form.Item >
                              <Button style = {{margin: '0 850px', marginTop:30 }} type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
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
                          <Title style = {{margin: '0 480px'}} class = "subtitleOfGradePage">ACT</Title>
                          <Form.Item style = {{margin: '0 500px'}} label="ACT English" name="ACTEnglish">{ACT_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="ACT Reading" name="ACTReading">{ACT_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="ACT Math" name="ACTMath">{ACT_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="ACT Science" name="ACTScience">{ACT_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="ACT Composite" name="ACTComposite">{props.Student.ACT_composite}</Form.Item>
                          <Form.Item >
                              <Button style = {{margin: '0 850px', marginTop: 30}} type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
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
                          <Title style = {{margin: '0 480px'}} class = "subtitleOfGradePage">SAT Subject Test</Title>
                  
                          <Form.Item style = {{margin: '0 500px', padding:"0 0 0 0px"}} label="SAT Literature" name="SATLiterature">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT US Hist" name="SATUSHist">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT World Hist" name="SATWorldHist">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Math I" name="SATMathI">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Math II" name="SATMathII">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Eco Bio" name="SATEcoBio">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Mol Bio" name="SATMolBio">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Chemistry" name="SATChemistry">{SAT_sub_sb}</Form.Item>
                          <Form.Item style = {{margin: '0 500px'}} label="SAT Physics" name="SATPhysics">{SAT_sub_sb}</Form.Item>
                          <Form.Item >
                              <Button style = {{margin: '0 850px', marginTop: 30}} type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} >
                                {props.saveOreditScoreSATSub}
                              </Button>
                          </Form.Item>
                      </Form>

                    </TabPane>
                    <TabPane className="profile_tabpane" tab="Applications" key="3">
                    <Title className = "title_profile">Applications</Title>
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
                      <Form.Item label="College" name="college"  rules={[ {required: true},]} style={{margin: '0 460px', width:500 }}>{appcolleges }</Form.Item>
                      <Form.Item label="Status" name="status"  rules={[ {required: true},]} style={{margin: '0 460px', width:500 }}>{appStatus}</Form.Item>
                      <Form.Item >
                        <Button type="primary" htmlType="submit" shape="round" style={{margin: '0 642px', marginTop: 16 }}>
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
