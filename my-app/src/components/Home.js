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
const { Meta } = Card;
const { Title, Paragraph } = Typography;

function Home(props) {
    let history = useHistory();
    const [testmsg, settestmsg] = useState(null);
    const location = useLocation();

   
    async function handletest(event){
        event.preventDefault();
        const res = await axios.post('/test', {
            id:1
        });
        // const scrapedata1 = await axios.post('/import_Colleges', {
           
        // });
        // const scrapedata2 = await axios.post('/scrape_college_ranking', {
           
        // });
        // const scrapedata3 = await axios.post('/import_college_scorecard', {
           
        // });
        
        settestmsg(res.data.msg);
        history.push('/' );
    }


    return (
            <div id = "homepage">
                <div className="odd">
                    <Title id="Title_text">Get Into Your Dream College!</Title>
                    <Paragraph id ="Title_para">The best tool for matching students to Colleges  <br /> Ready for your College Journey</Paragraph>
                    {/* <div className="even">
                        <form onSubmit={handletest}>
                                <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Create Admin account(username: "feyu" passwd:"1111")</button>
                        </form>
                        <p>{testmsg}</p>
                        <br></br>
                    </div> */}
                </div>

                <Divider type="horizontal" />
                <div className="even">
                <div className="even_title"><Title >Learn more about your Ideal Colleges </Title></div>
                <Divider type="vertical" />
                    <div className= "even_card">
                    <Card
                        
                        style={{ width: 500 }}
                        cover={
                        <img
                            alt="example"
                            src={RankingImg}
                        />
                        }
                        actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                        avatar={<Avatar src={UProfpic} />}
                        description="You can search for colleges that fits you. We will list varous options, which are all in the appropriate range based on your profile."
                        />
                    </Card>
                    </div>
                </div>
            

                <Divider type="horizontal" />
                <div className="odd">
                
                    <div className="odd_title">
                    <Title >Compare with other High Schools</Title>
                    </div>
                    <Divider type="vertical" />
                    <div className= "odd_card">
                    <Card
                        style={{ width: 500 }}
                        cover={
                        <img
                            alt="example"
                            src={HighschoolImg}
                        />
                        }
                        actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                        avatar={<Avatar src={UProfpic} />}
                        description="This feature allows students to idetify the high schools that are similar to theirs. We combine wide range of aspects to compute the similarity score, which include Standadized test score, GPA, etc.. "
                        />
                    </Card>
                    </div>
                    
                </div>

                
                <Divider type="horizontal" />

                <div className="even">
                <div className="even_title"><Title >Track Student Applications </Title></div>
                <Divider type="vertical" />
                    <div className= "even_card">
                    <Card
                        
                        style={{ width: 500 }}
                        cover={
                        <img
                            alt="example"
                            src={AppTrack}
                        />
                        }
                        actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                        avatar={<Avatar src={UProfpic} />}
                        description="For a specified college, the system displays information about other students who applied to the specified college and meet specified filter conditions. "
                        />
                    </Card>
                    </div>
                </div>
            
                
            
            </div>
     );
}

export default Home; 