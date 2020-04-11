import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { List, Spin } from 'antd';
import { Button, Form } from 'antd';
import { Input, AutoComplete } from 'antd';
import { notification } from 'antd';
import { Layout } from 'antd';
import { Table } from 'antd';
import { Slider } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


function SearchCollege(props) {
    
    const [data, setData] = useState([]);
    const [majors, setMajors] = useState();
    const [name, setName] = useState();
    const [keyword, setKeyword] = useState({CollegeSearchBar:'all'});
    const [admission_rate, setAdmission_rate] = useState([0,100]);
    const [completion_rate, setCompletion_rate] = useState([0,100]);
    const [cost_of_attendance, setCost_of_attendance] = useState();
    const [ranking, setRanking] = useState([1,1000]);
    const [size, setSize] = useState([1,70000]);
    const [sat_math, setSat_math] = useState([200,800]);
    const [sat_EBRW, setSat_EBRW] = useState([200,800]);
    const [act_Composite, setact_Composite] = useState([1,36]);
   

    const [options, setOptions] = useState([
        { value : "American University"},
        { value : "Barnard College"},
        { value : "Berry College"},
        { value : "California State University, East Bay"},
        { value : "California State University, Fresno"},
        { value : "California State University, Monterey Bay"},
        { value : "Campbell University"},
        { value : "Carnegie Mellon University"},
        { value : "Central Connecticut State University"},
        { value : "Centre College"},
        { value : "Clarkson University"},
        { value : "Colgate University"},
        { value : "Colorado College"},
        { value : "DePaul University"},
        { value : "DePauw University"},
        { value : "Drake University"},
        { value : "Drexel University"},
        { value : "Eastern Illinois University"},
        { value : "Eastern Washington University"},
        { value : "Florida Gulf Coast University"},
        { value : "Fordham University"},
        { value : "Franklin & Marshall College"},
        { value : "Gannon University"},
        { value : "Gettysburg College"},
        { value : "Gordon College"},
        { value : "Hendrix College"},
        { value : "Hope College"},
        { value : "Idaho State University"},
        { value : "Illinois College"},
        { value : "Indiana University Bloomington"},
        { value : "Iona College"},
        { value : "John Carroll University"},
        { value : "Kalamazoo College"},
        { value : "Kennesaw State University"},
        { value : "Lawrence Technological University"},
        { value : "Manhattan College"},
        { value : "Massachusetts Institute of Technology"},
        { value : "Mercer University"},
        { value : "Merrimack College"},
        { value : "Mississippi State University"},
        { value : "Missouri University of Science and Technology"},
        { value : "Moravian College"},
        { value : "Mount Holyoke College"},
        { value : "New Jersey Institute of Technology"},
        { value : "New York University"},
        { value : "North Park University"},
        { value : "Northwestern University"},
        { value : "Nova Southeastern University"},
        { value : "Princeton University"},
        { value : "Providence College"},
        { value : "Reed College"},
        { value : "Rice University"},
        { value : "Rider University"},
        { value : "Rochester Institute of Technology"},
        { value : "Roger Williams University"},
        { value : "SUNY College of Environmental Science and Forestry"},
        { value : "Saint Louis University"},
        { value : "Salve Regina University"},
        { value : "Samford University"},
        { value : "San Diego State University"},
        { value : "School of the Art Institute of Chicago"},
        { value : "Siena College"},
        { value : "Smith College"},
        { value : "St Bonaventure University"},
        { value : "Stevenson University"},
        { value : "Stony Brook University"},
        { value : "Suffolk University"},
        { value : "Temple University"},
        { value : "Texas Christian University"},
        { value : "Texas Tech University"},
        { value : "The College of St Scholastica"},
        { value : "The College of Wooster"},
        { value : "Transylvania University"},
        { value : "University of Alabama"},
        { value : "University of Alabama at Birmingham"},
        { value : "University of Arizona"},
        { value : "University of Arkansas"},
        { value : "University of California, Davis"},
        { value : "University of California, Santa Barbara"},
        { value : "University of California, Santa Cruz"},
        { value : "University of Central Florida"},
        { value : "University of Delaware"},
        { value : "University of Hartford"},
        { value : "University of Houston"},
        { value : "University of Illinois at Chicago"},
        { value : "University of Kentucky"},
        { value : "University of Maine"},
        { value : "University of Massachusetts Amherst"},
        { value : "University of Montana"},
        { value : "University of Nevada, Las Vegas"},
        { value : "University of Nevada, Reno"},
        { value : "University of Richmond"},
        { value : "University of San Diego"},
        { value : "University of Utah"},
        { value : "Utah State University"},
        { value : "Vassar College"},
        { value : "Wagner College"},
        { value : "Washington & Jefferson College"},
        { value : "Westmont College"},
        { value : "William Jewell College"},
        { value : "Williams College"}
    ]);
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          fixed:"left",
          width:200,
          sorter: (a, b) => a.name.length - b.name.length,
          sortDirections: ['descend'],
        },
        {
          title: 'Ranking',
          dataIndex: 'ranking',
          width:200
        },
        {
            title: 'Admission Rate',
            dataIndex: 'admission_rate',
            width:200
        },
        {
            title: 'Size',
            dataIndex: 'size',
            width:200
        },
        {
            title: 'City',
            dataIndex: 'city',
            width:200
        },
        {
            title: 'State',
            dataIndex: 'state',
            width:100
        },
        {
            title: 'Control',
            dataIndex: 'control',
            width:200
        },
        {
            title: 'Debt',
            dataIndex: 'debt',
            width:200
        },
        {
            title: 'Completion Rate(4 years)',
            dataIndex: 'completion_rate',
            width:250
        },
        {
            title: 'Range Avg SAT Math',
            dataIndex: 'range_avg_SAT_math',
            width:200
        },
        {
            title: 'Range Avg SAT EBRW',
            dataIndex: 'range_avg_SAT_EBRW',
            width:200
        },
        {
            title: 'Range Avg ACT',
            dataIndex: 'range_avg_ACT',
            width:200
        },
        {
            title: 'Majors',
            dataIndex: 'majors',
            width:1000
        },
        {
            title: 'Cost of attendance',
            dataIndex: 'cost_of_attendance',
            width:200
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
          }),
        };
      });
    
    
    useEffect(() => {
        async function fetchData() {
            handleSearchCollege(keyword);
        };
        fetchData();
    }, []);
    
    
    async function handleSearchCollege(event) {
        setKeyword(event);
        const res = await axios.post('/searchColleges', {
            keyword: event.CollegeSearchBar,
            admission_rate:admission_rate,
            completion_rate:completion_rate,
            cost_of_attendance:cost_of_attendance,
            majors:majors,
            name:name,
            ranking:ranking,
            size:size,
            sat_math:sat_math,
            sat_EBRW:sat_EBRW,
            act_Composite:act_Composite,
          });
        setData(res.data.colleges);
        notification.open({
            message: "Search succesfully",
            duration:2.5  
          });
    }

    async function handleAdmissionFilter(event){
        setAdmission_rate([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
        
    }
    async function handleRankFilter(event){
        setRanking([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }
    async function handleSizeFilter(event){
        setSize([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }
    async function handleSATMathFilter(event){
        setSat_math([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }
    async function handleACTCOMPFilter(event){
        setact_Composite([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }
    async function handleOnSATEBRWFilter(event){
        setSat_EBRW([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }

    async function handleCompleteionFilter(event){
        setCompletion_rate([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }
    
    async function handleCOSFilter(event){
        setCost_of_attendance([event[0],event[1]]);
        if(keyword !=null){
            await handleSearchCollege(keyword);
        }
    }


    return (

    <Layout>
      <Header >
      <Form
            className="Search_college_form"
            name="Search_College"
            onFinish={handleSearchCollege}
            style={{margin:'10px 10px 10px 10px'} }
            > 
            <Form.Item  name="CollegeSearchBar">
                <AutoComplete
                    dropdownMatchSelectWidth={"100%"}
                    style={{ width: "100%" }}
                    options={options}
                    // onSelect={onSelect}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().includes(inputValue.toUpperCase()) 
                    }
                >
                    <Input.Search style={{width:'100%'} }size="large" placeholder="Enter Keywords"  />
                </AutoComplete>
            </Form.Item>
          </Form>
      </Header>
      <Layout>
        <Sider style={{ background: 'snow',padding:'0 0 0 0'} }>
            <div style={{background: 'white', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h1 style={{background: 'snow', width:'100%', padding:'0 0 0 0px'}}>Filters</h1>
            </div>
            <div style={{background: 'white', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'white', width:'100%', padding:'0 0 0 0px'}}>Admission Rate</h4>
                <Slider range step={0.01} min={0} max={1} marks={{0: '0',1: '1'}}  defaultValue={[0, 1]} onChange={e => setAdmission_rate([e[0],e[1]])} onAfterChange={handleAdmissionFilter} />
            </div>
            <div style={{background: 'snow', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'snow', width:'100%', padding:'0 0 0 0px'}}>Completion Rate</h4>
                <Slider range step={1} min={0} max={100} marks={{0: '0%',100: '100%'}}  defaultValue={[0, 100]} onChange={e => setCompletion_rate([e[0],e[1]])} onAfterChange={handleCompleteionFilter} />
            </div>
            
            <div style={{background: 'white', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'white', width:'100%', padding:'0 0 0 0px'}}>Ranking</h4>
                <Slider range step={10} min={1} max={1000} marks={{1: '1st',1000: '1000th'}}  defaultValue={[1, 1000]} onChange={e => setRanking([e[0],e[1]])} onAfterChange={handleRankFilter} />
            </div>
            <div style={{background: 'snow', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'snow', width:'100%', padding:'0 0 0 0px'}}>size</h4>
                <Slider range step={100} min={1} max={70000} marks={{1: '1',70000: '70000'}}  defaultValue={[1, 70000]} onChange={e => setSize([e[0],e[1]])} onAfterChange={handleSizeFilter} />
            </div>
            <div style={{background: 'white', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'white', width:'100%', padding:'0 0 0 0px'}}>SAT Math</h4>
                <Slider range step={10} min={200} max={800} marks={{200: '200',800: '800'}}  defaultValue={[0, 800]} onChange={e => setSat_math([e[0],e[1]])} onAfterChange={handleSATMathFilter} />
            </div>
            <div style={{background: 'snow', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'snow', width:'100%', padding:'0 0 0 0px'}}>SAT EBRW</h4>
                <Slider range step={10} min={200} max={800} marks={{200: '200',800: '800'}}  defaultValue={[0, 800]} onChange={e => setSat_EBRW([e[0],e[1]])} onAfterChange={handleOnSATEBRWFilter} />
            </div>
            <div style={{background: 'white', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'white', width:'100%', padding:'0 0 0 0px'}}>ACT Composite</h4>
                <Slider range step={1} min={0} max={36} marks={{1: '1',36: '36'}}  defaultValue={[0, 36]} onChange={e => setact_Composite([e[0],e[1]])} onAfterChange={handleACTCOMPFilter} />
            </div>
            <div style={{background: 'snow', width:'100%', padding:'10px 10px 10px 10px'}}>
                <h4 style={{background: 'snow', width:'100%', padding:'0 0 0 0px'}}>Cost of Attendence</h4>
                <Slider range step={100} min={0} max={80000} marks={{0: '0$',80000: '80000$'}}  defaultValue={[0, 80000]} onChange={e => setCost_of_attendance([e[0],e[1]])} onAfterChange={handleCOSFilter} />
            </div>
            
        </Sider>
        <Content style={{background:'snow',padding:'20px 20px 20px 20px'}}>
        <Table 
            columns={mergedColumns} 
            dataSource={data} 
            bordered
            title={() => 'Colleges'}
            footer={() => ''}
            scroll={{ x: 1300 }} 
        />
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  
    );
}

export default SearchCollege;