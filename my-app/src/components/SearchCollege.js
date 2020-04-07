import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { List, Spin } from 'antd';
import { Button, Form } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { Input, AutoComplete } from 'antd';
import { notification } from 'antd';



function SearchCollege(props) {
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
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
    
    
    useEffect(() => {
        async function fetchData() {
            //const res = await axios.post('/getColleges');
            setData([{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"}]);
        };
        fetchData();
    }, []);
    
    
    async function handleSearchCollege(event) {
        notification.open({
            message: event.CollegeSearchBar,
            duration:2.5  
          });
    }

    return (
      <div>
          <Form
            className="Search_college_form"
            name="Search_College"
            onFinish={handleSearchCollege}
            > 
            <Form.Item  name="CollegeSearchBar">
                <AutoComplete
                    dropdownMatchSelectWidth={"100%"}
                    style={{ width: "50%" }}
                    options={options}
                    // onSelect={onSelect}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().includes(inputValue.toUpperCase()) 
                    }
                >
                    <Input.Search size="large" placeholder="Enter Keywords"  />
                </AutoComplete>
            </Form.Item>
          </Form>
          <div className="demo-infinite-container">
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            hasMore={!loading && hasMore}
            useWindow={false}
            >
            <List
                dataSource={data}
                renderItem={item => (
                <List.Item key={item.id}>
                    <List.Item.Meta
                    title={item.name}
                    description={item.description}
                    />
                    <div>Content</div>
                </List.Item>
                )}
            >
                {loading && hasMore && (
                <div className="demo-loading-container">
                    <Spin />
                </div>
                )}
            </List>
            </InfiniteScroll>
        </div>
      </div>
    );
}

export default SearchCollege;