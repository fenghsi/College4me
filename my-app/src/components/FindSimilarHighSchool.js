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
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState({HighSchoolSearchBox:''});

  ///////

  const [options, setOptions] = useState([
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
  const allstates = <Select placeholder=" Select a State"  style={{ width: '100%', height: '100%' }}>
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

  ///////////////////////////////////////
  const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        fixed:"left",
        width:200,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'City',
        dataIndex: 'city',
        width:200,
        sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
        title: 'State',
        dataIndex: 'state',
        width:200,
        sorter: (a, b) => a.state.localeCompare(b.state),
    },
    {
        title: 'Niche Grade',
        dataIndex: 'niche_grade',
        width:200,
        sorter: (a, b) => a.niche_grade - b.niche_grade,
    },
    {
        title: 'Address',
        dataIndex: 'detail_addr',
        width:200
    },
    {
        title: 'Web Url',
        dataIndex: 'web_url',
        width:400
    },
    {
        title: 'Telephone Num',
        dataIndex: 'tel',
        width:150
    },
    {
        title: 'Avg Sat',
        dataIndex: 'avg_sat',
        width:150,
        sorter: (a, b) => a.avg_sat - b.avg_sat,
    },
    {
        title: 'Avg Act',
        dataIndex: 'avg_act',
        width:150,
        sorter: (a, b) => a.avg_act - b.avg_act,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        width:500,
    },
    {
        title: 'Stats',
        dataIndex: 'stats',
        width:500,
    },
    {
        title: 'Ratings',
        dataIndex: 'ratings',
        width:500,
    },
    {
        title: 'Popular_colleges',
        dataIndex: 'popular_colleges',
        width:500,
    },
    {
      title: 'Similarity Score',
      dataIndex: 'hs_score',
      fixed:"right",
      width:200,
      sorter: (a, b) => a.hs_score - b.hs_score,
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






  ////////////////////////////////////////


  async function handleFindHS(event){
    // setKeyword(event);
    // event.preventDefault();
    // notification.open({
    //   message: "dada",
    //   description: event.HighSchoolState+" "+event.HighSchoolCity,
    //   duration:2.5 
    // });
    const hs_results = await axios.post('/find_similar_high_school', {
        keyword: event.HighSchoolSearchBox,
        hsState: event.HighSchoolState,
        hsCity: event.HighSchoolCity,
    });
   
    if(hs_results.data.status == "non-exist"){
      notification.open({
        message: "High School Not Known to c4me System",
        description: "Currently no student had entered "+ event.HighSchoolSearchBox +" in the profile, please select a different high school to search ",
        duration:2.5 
      });
      setData([]);
    }
    else{
      setData(hs_results.data.highschools);
      data.sort(function(a, b){return a.hs_score - b.hs_score;});
      notification.open({
        message: "Searcg High School Succesfully!!",
        description: "There are "+hs_results.data.highschools.length+" schools that are similar to "+event.HighSchoolSearchBox,
        duration:2.5 
      });
    }

    //history.push('/searchhighschool');
   
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
        <Form.Item  name="HighSchoolCity"
        style={{ display: 'inline-block', width: '20%' , padding:'0 0 0 20px'}}
        rules={[
          {
            required: true,
            message: 'Please input a City!',
          },
        ]}
        >
          <Input style = {{height:'32px',}} placeholder="Enter City" />
        </Form.Item>
        <Form.Item  name="HighSchoolState"
          height={250}
          style={{ display: 'inline-block', width: '20%' , height: '150%', padding:'0 0 0 20px' }}
          rules={[
            {
              required: true,
              message: 'Please Input a State',
            },
          ]}
        >
          {allstates}
        </Form.Item>
        <Form.Item  name="HighSchoolSearchBox"
        style={{ display: 'inline-block', width: '40%',height:'35px', padding:'0 0 0 30px' }}
        rules={[
          {
            required: true,
            message: '   '
          },
        ]}
        >
            <AutoComplete
                dropdownMatchSelectWidth={"100%"}
                style={{ width: "100%" ,height:'30px'}}
                options={options}
                defaultValue = {keyword.HighSchoolSearchBox}
                filterOption={(inputValue, option) =>
                    option.value.toUpperCase().includes(inputValue.toUpperCase()) 
                }
                //autoFocus = {true}
            >
                <Input style={{width:'100%',height:'40px'} }size="large" placeholder="Select a High School" />
            </AutoComplete>
        </Form.Item>
        <Form.Item 
        style={{ display: 'inline-block', width: '20%',height:'50px', padding:'0 0 0 20px' }}
        >
          <Button type="primary" htmlType="submit"style={{width: '50%',height:'40px'}} >
            Search
          </Button>
        </Form.Item>
      </Form>
      </Header>
      <Content style={{background:'snow',padding:'20px 20px 20px 20px', height:"900px"}}>
        <Table 
            columns={mergedColumns} 
            dataSource={data} 
            bordered
            title={() => <div> Find Similar High Schools </div>}
            footer={() => <div>Scroll Right or left to view more info</div>}
            scroll={{ x: 240 , y: 700}} 
            pagination={10}
            rowCount={7}
            style ={{height:"100%"}}
        />
        </Content>
      </Layout>
 
    
    );
}

export default FindSimilarHighSchool;