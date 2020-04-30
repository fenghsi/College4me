import React ,  { useState, useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Typography } from 'antd';
import { Select } from 'antd';
import {Form,Button,DatePicker} from 'antd';
import { Tabs } from 'antd';
import { Layout} from 'antd';
import { Checkbox, Row, Col,Table } from 'antd';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import axios from 'axios';
import ReactApexChart from "react-apexcharts";


const{RangePicker} =DatePicker;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;


  

function Application_Tracker_Filter(props) {
    const location = useLocation();
    const coll = location.pathname.split("/");
    const cname = coll[coll.length-1];
    
    const options12 = { 
        chart: {
          height: 450,
          type: 'scatter',
          zoom: {
            enabled: false,
            type: 'xy'
          }
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          },
          max: 4.0,
          //min: 0.0, 
        },
        yaxis: {
          tickAmount: 10,
          max: 1600,
          //min: 400, 
        }
    };
    const options22 = { 
        chart: {
          height: 450,
          type: 'scatter',
          zoom: {
            enabled: false,
            type: 'xy'
          }
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          },
          max: 4.0,
          //min: 0.0, 
        },
        yaxis: {
          tickAmount: 10,
          max: 36,
          //min: 400, 
        }
    };
    const options23 = { 
        chart: {
          height: 450,
          type: 'scatter',
          zoom: {
            enabled: false,
            type: 'xy'
          }
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          },
          max: 4.0,
          //min: 0.0, 
        },
        yaxis: {
          tickAmount: 10,
          max: 100,
          //min: 400, 
        }
    };
    const [series1, setSeries1] = useState([]);
    const [series2, setSeries2] = useState([]);
    const [series3, setSeries3] = useState([]);
    const [options1, setOptions1] = useState(options12);
    const [options2, setOptions2] = useState(options22);
    const [options3, setOptions3] = useState(options23);
    const [studentList, setStudentList] = useState([]);
    
    const selectFilter = <Select style={{ width: 123 }}>>
        <Option value="lax">Lax</Option>
        <Option value="strict">Strict</Option>
    </Select>
    
    //const currentYear = new Date().getFullYear();

    function disabledDate(current) {
        return current && current.valueOf() < Date.now(); //Date.now()
    }

 
    const datePickerYear = <RangePicker picker="year"
    style={{width:172}}
    disabledDate={disabledDate}
    />; //defaultValue={moment(2020, 'YYYY')}

        

    const [options, setOptions] = useState([
        { value : "All High Schools"},
        { value : "Academic Magnet High School, North Charleston, SC"},
        { value : "Academy for Information Technology, Scotch Plains, NJ"},
        { value : 'Alpharetta High School, Alpharetta, GA'},
        { value : 'Aragon High School, San Mateo, CA'},
        { value : 'Arcadia High School, Arcadia, OH'},
        { value : 'Arizona College Prep Erie Campus, Chandler, AZ'},
        { value : 'Ashley Ridge High School, Summerville, SC'},
        { value : 'Baccalaureate School For Global Education, Long Island City, NY'},
        { value : 'Bard High School Early College, New York, NY'},
        { value : 'Basis Flagstaff, Flagstaff, AZ'},
        { value : 'Basis Tucson, North, Tucson, AZ'},
        { value : 'Bayless Senior High School, St Louis, MO'},
        { value : 'Bellevue High School, Bellevue, WA'},
        { value : 'Blair High School, Pasadena, CA'},
        { value : 'Blue Valley North High School, Overland Park, KS'},
        { value : 'Brighton High School, Rochester, NY'},
        { value : 'Bronx High School Of Science, Bronx, NY'},
        { value : 'Brooklyn Technical High School, Brooklyn, NY'},
        { value : 'Campolindo High School, Moraga, CA'},
        { value : 'Canyon Crest Academy, San Diego, CA'},
        { value : 'Carrboro High School, Carrboro, NC'},
        { value : 'Carroll Senior High School, Southlake, TX'},
        { value : 'Cedar Key High School, Cedar Key, FL'},
        { value : 'Clements High School, Sugar Land, TX'},
        { value : 'Columbia River High School, Vancouver, WA'},
        { value : 'Columbus High School, Columbus, GA'},
        { value : 'Commack High School, Commack, NY'},
        { value : 'Concord Carlisle High School, Concord, MA'},
        { value : 'Coppell High School, Coppell, TX'},
        { value : 'Crystal Lake Central High School, Crystal Lake, IL'},
        { value : 'Dougherty Valley High School, San Ramon, CA'},
        { value : 'Eagan Senior High School, Eagan, MN'},
        { value : 'East Chapel Hill High School, Chapel Hill, NC'},
        { value : 'Elsik High School, Houston, TX'},
        { value : 'Fairfield High School, Fairfield, TX'},
        { value : 'Fairview High School, Boulder, CO'},
        { value : 'Flowery Branch High School, Flowery Branch, GA'},
        { value : 'Fox Chapel Area High School, Pittsburgh, PA'},
        { value : 'Glenbrook South High School, Glenview, IL'},
        { value : 'Glendale High School, Glendale, AZ'},
        { value : 'Goffstown High School, Goffstown, NH'},
        { value : 'Granada Hills Charter High School, Granada Hills, CA'},
        { value : 'Haas Hall Academy, Fayetteville, AR'},
        { value : 'Hanover High School, Hanover, NH'},
        { value : 'Harriton Senior High School, Rosemont, PA'},
        { value : 'Health Careers High School, San Antonio, TX'},
        { value : 'Highland Park High School, Highland Park, IL'},
        { value : 'Hinsdale Central High School, Hinsdale, IL'},
        { value : 'Hopkinton High School, Hopkinton, MA'},
        { value : 'Huron High School, Ann Arbor, MI'},
        { value : 'Illinois Mathematics And Science Academy, Aurora, IL'},
        { value : 'International Academy, Bloomfield Hills, MI'},
        { value : 'Island Trees High School, Levittown, NY'},
        { value : 'James Madison High School, Vienna, VA'},
        { value : 'Jp Stevens High School, Edison, NJ'},
        { value : 'Lake City High School, Lake City, MI'},
        { value : 'Lawrence Free State High School, Lawrence, KS'},
        { value : 'Lexington High School, Lexington, MA'},
        { value : 'Libertyville High School, Libertyville, IL'},
        { value : 'Lovejoy High School, Lucas, TX'},
        { value : 'Madeira High School, Cincinnati, OH'},
        { value : 'Mamaroneck High School, Mamaroneck, NY'},
        { value : 'Mclean High School, Mclean, VA'},
        { value : 'Memorial High School, Houston, TX'},
        { value : 'Mira Costa High School, Manhattan Beach, CA'},
        { value : 'Mountain Lakes High School, Mountain Lakes, NJ'},
        { value : 'Mt Brook High School, Mountain Brook, AL'},
        { value : 'Naperville Central High School, Naperville, IL'},
        { value : 'Neuqua Valley High School, Naperville, IL'},
        { value : 'New Trier Township High School, Winnetka, IL'},
        { value : 'Niles North High School, Skokie, IL'},
        { value : 'North Carolina School Of Science And Mathematics, Durham, NC'},
        { value : 'Northside College Preparatory High School, Chicago, IL'},
        { value : 'Oakton High School, Vienna, VA'},
        { value : 'Otsego High School, Otsego, MI'},
        { value : 'Panther Creek High School, Cary, NC'},
        { value : 'Parish Hill High School, Chaplin, CT'},
        { value : 'Parkway Central High School, Chesterfield, MO'},
        { value : 'Pelham Memorial High School, Pelham, NY'},
        { value : 'Piedmont High School, Piedmont, CA'},
        { value : 'Providence High School, Charlotte, NC'},
        { value : 'Radnor Senior High School, Radnor, PA'},
        { value : 'Redwood High School, Larkspur, CA'},
        { value : 'Reedy High School, Frisco, TX'},
        { value : 'Richard Montgomery High School, Rockville, MD'},
        { value : 'Richland High School, North Richland Hills, TX'},
        { value : 'Ridgewood High School, Ridgewood, NJ'},
        { value : 'Riverside Stem Academy, Riverside, CA'},
        { value : 'Santa Monica High School, Santa Monica, CA'},
        { value : 'South Pointe High School, Rock Hill, SC'},
        { value : 'South Side High School, Rockville Centre, NY'},
        { value : 'Staten Island Technical High School, Staten Island, NY'},
        { value : 'Sterling High School, Somerdale, NJ'},
        { value : 'Stone Bridge High School, Ashburn, VA'},
        { value : 'Sutton High School, Sutton, MA'},
        { value : 'The Gatton Academy Bowling, Green, KY'},
        { value : 'The Mississippi School For Mathematics And Science, Columbus, MS'},
        { value : 'University High School, Normal, IL'},
        { value : 'Volcano Vista High School, Albuquerque, NM'},
        { value : 'Walton High School, Marietta, GA'},
        { value : 'Waubonsie Valley High School, Aurora, IL'},
        { value : 'Westlake Academy, Westlake, TX'},
        { value : 'Westlake High School, Westlake Village, CA'},
        { value : 'Westwood High School, Austin, TX'},
        { value : 'Whitefish Bay High School, Whitefish Bay, WI'},
        { value : 'Whitney High School, Cerritos, CA'},
    ]);

    const selHighSchool = 
        <Select
            mode="multiple"
            width="100%"
            showSearch
            style={{ width: 400 }}
            placeholder="Select a highschool"
            
            options={options}
            >
        </Select>;

    const setCheckStatus = 
        <Checkbox.Group
            style={{ width: 500 }}>
            <Row>
                <Col style={{width:150}}>
                    <Checkbox value="accepted">Accepted</Checkbox>
                </Col>
                <Col style={{width:150}}>
                    <Checkbox value="rejected">Denied</Checkbox>
                </Col>
            </Row>
            <Row>
                <Col style={{width:150}}>
                    <Checkbox value="wait-list">Wait-list</Checkbox>
                </Col>
                <Col style={{width:150}}>
                    <Checkbox value="pending">Pending</Checkbox>
                </Col>
            </Row>
            <Row>
                <Col style={{width:150}}>
                    <Checkbox value="deferred">Deferred</Checkbox>
                </Col>
                <Col style={{width:150}}>
                    <Checkbox value="withdrawn">Withdrawn</Checkbox>
                </Col>
            </Row>
        </Checkbox.Group>;

    async function handleTrackFilter(event) {
        notification.open({
            message: cname, // + event.TrackerClass + event.TrackerClass.format('YYYY') + event.TrackerHighschool + event.TrackerStatus,
            duration:2.5 
        });
        //utton(true);

        const res = await axios.post('/searchColleges/'+cname, {
            filter: event.TrackerFilter,
            class: [event.TrackerClass[0].format('YYYY'),event.TrackerClass[1].format('YYYY')],
            highSchool: event.TrackerHighschool,
            college:cname,
            status : event.TrackerStatus
        });
        setStudentList(res.data.studentList);
        setSeries1(res.data.SATScatterplot);
        setSeries2(res.data.ACTScatterplot);
        setSeries3(res.data.WeightScatterplot);

    }

    // const listLink =
    //     <Link ng-show="buttonCont.isClicked" className='Tracker_Link' to={location.pathname+"/Link"}>
    //         <Button className='Tracker_Button'>List of Student Profiles</Button>
    //     </Link>

    //     const scatterLink = <Button className='Tracker_Button'>Scatterplot of Application Status</Button>
        

    // const scatterLink =
    //     <Link ng-show="contButton" className='Tracker_Link' to={location.pathname+"/Scatter"}>
    //         <Button className='Tracker_Button'>Scatterplot of Application Status</Button>
    //     </Link>
    //ng-click=display()
    const buttonCont = <Button type="primary" htmlType="submit">
            Continue
        </Button>;

    const FormSizeDemo = () => {
        const [componentSize, setComponentSize] = useState('large');
        const formLayout = {
            labelCol: {
                span: 40,
            },
            wrapperCol: {
                span:40, //range of width of the filter?
            },
            layout: "horizontal",
            initialValues: {
                size: componentSize,
            },
        };
        //{...formLayout}
        return (
        <div>
            <Form> 
                <Form.Item label="Search Mode">{selectFilter}</Form.Item>
                <Form.Item label="Class">{datePickerYear}</Form.Item>
                <Form.Item label="High School">{selHighSchool}</Form.Item>
                <Form.Item label="Application Status">{setCheckStatus}</Form.Item>
            </Form>
            
        </div>
        );
    };

    const columns = [
        {
            title: 'Userid',
            dataIndex: 'userid',
            fixed:"left",
            width:200,
            render: (_, record) => {
                return  (
                   <Link  to={"/users/"+record.userid} record={record} >{record.userid}</Link>
                );
              },
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'GPA',
            dataIndex: 'GPA',
            width:200,
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'SAT Math',
            dataIndex: 'SAT_math',
            width:200,
           // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'SAT EBRW',
            dataIndex: 'SAT_EBRW',
            width:200,
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'ACT Composite',
            dataIndex: 'ACT_composite',
            width:200,
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width:200,
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        //average GPA, average SAT Math, average SAT EBRW, and average ACT composite,
        
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



    return (
        <table>
            <Row>
                <Col style={{position: 'relative', margin: '15px', padding: '10px 10px 10px 10px'}} xs={12} sm={6} md={8} lg={8} xl={10}>
                <Title style={{ width: '420px'}}>Application Tracker</Title>
                <br></br>
                <h2>{location.pathname.replace("/searchcollege/","")}</h2>
                <br></br>
                    <Form
                        className="Application_Tracker"
                        name="Application_Tracker_Filter"
                        onFinish={handleTrackFilter}
                        > 
                        <Form.Item label="High School" name="TrackerHighschool"
                             style={{ width: 600 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select High School!',
                                },
                            ]}>{selHighSchool}</Form.Item>
                        <Form.Item label="Search Mode" name="TrackerFilter"
                            style={{ width: 500 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select Filter!',
                                },
                            ]}>{selectFilter}</Form.Item>
                        <Form.Item label="Class" name="TrackerClass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select Class!',
                                },
                        
                            ]}>{datePickerYear}</Form.Item>
            
                        <Form.Item label="Application Status" name="TrackerStatus"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select Application Status!',
                                },
                            ]}>{setCheckStatus}</Form.Item>
                        
                        {/* <Form.Item label="" name="Filter">{FormSizeDemo()}</Form.Item> */}
                        <Form.Item style={{padding:'0 0 0px 150px'}}>{buttonCont}</Form.Item>
                    </Form>
                </Col>
                <Col style={{position: 'relative', margin: '30px', padding: '10px 10px 10px 10px', background: 'white',  width:900, height:750}} xs={12} sm={6} md={8} lg={8} xl={10}>
                    {/* {showButton && listLink}
                    {showButton && scatterLink} */}
                    <Tabs defaultActiveKey="1" style={{width:'120%'}}>
                        <TabPane tab="List of Similar Students" key="1">
                            <Table 
                                columns={mergedColumns} 
                                dataSource={studentList} 
                                bordered
                                title={() => <div> Similar Students </div>}
                                footer={() => <div>footer</div>}
                                scroll={{ x: 240 , y: 700}} 
                                pagination={10}
                                rowCount={7}
                                style ={{height:"100%"}}
                            />
                        </TabPane>
                        <TabPane tab="Scatterplot SAT" key="2">
                            <ReactApexChart options={options1} series={series1} type="scatter" height={350} />
    
                        </TabPane>
                        <TabPane tab="Scatterplot ACT" key="3">
                            <ReactApexChart options={options2} series={series2} type="scatter" height={350} />
    
                        </TabPane>
                        <TabPane tab="Standard Test Score" key="4">
                            <ReactApexChart options={options3} series={series3} type="scatter" height={350} />
    
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </table>
    );
}

export default Application_Tracker_Filter;