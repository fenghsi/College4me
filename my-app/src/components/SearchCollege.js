import React ,  { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation,useHistory} from "react-router-dom";
import { List, Spin } from 'antd';
import { Button, Form } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { Input, AutoComplete } from 'antd';
import { notification } from 'antd';
import { Layout } from 'antd';
import { Table } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


function SearchCollege(props) {
    
   // const [data, setData] = useState([]);
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
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          filters: [
            {
              text: 'Joe',
              value: 'Joe',
            },
            {
              text: 'Jim',
              value: 'Jim',
            },
            {
              text: 'Submenu',
              value: 'Submenu',
              children: [
                {
                  text: 'Green',
                  value: 'Green',
                },
                {
                  text: 'Black',
                  value: 'Black',
                },
              ],
            },
          ],
          // specify the condition of filtering result
          // here is that finding the name started with `value`
          onFilter: (value, record) => record.name.indexOf(value) === 0,
          sorter: (a, b) => a.name.length - b.name.length,
          sortDirections: ['descend'],
        },
        {
          title: 'Age',
          dataIndex: 'age',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: 'Address',
          dataIndex: 'address',
          filters: [
            {
              text: 'London',
              value: 'London',
            },
            {
              text: 'New York',
              value: 'New York',
            },
          ],
          filterMultiple: false,
          onFilter: (value, record) => record.address.indexOf(value) === 0,
          sorter: (a, b) => a.address.length - b.address.length,
          sortDirections: ['descend', 'ascend'],
        },
      ];
      
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
        {
          key: '4',
          name: 'Jim Red',
          age: 32,
          address: 'London No. 2 Lake Park',
        },
      ];
    
    useEffect(() => {
        async function fetchData() {
            //const res = await axios.post('/getColleges');
           // setData([{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"},{name:"sbu1", description:"suny"},{name:"baffalo2",description:"suny"}]);
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
        <Sider style={{background:'burlywood', padding:'0 0 500px 0'} }>Sider</Sider>
        <Content style={{background:'snow',padding:'20px 20px 20px 20px'}}>
        {/* <div className="demo-infinite-container" >
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            hasMore={!loading && hasMore}
            useWindow={false}
            style={{background:'white',padding:'20px 20px 20px 20px'}}
            >
            <List
                dataSource={data}
                renderItem={item => (
                <List.Item key={item.id}>
                    <List.Item.Meta
                    // title={item.name}
                    // description={item.description}
                    style={{ background:'white',padding:'50px 50px 50px 50px'}}
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
        </div> */}
        <Table columns={columns} dataSource={data}  />
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
    //   <div>
    //       <Form
    //         className="Search_college_form"
    //         name="Search_College"
    //         onFinish={handleSearchCollege}
    //         > 
    //         <Form.Item  name="CollegeSearchBar">
    //             <AutoComplete
    //                 dropdownMatchSelectWidth={"100%"}
    //                 style={{ width: "50%" }}
    //                 options={options}
    //                 // onSelect={onSelect}
    //                 filterOption={(inputValue, option) =>
    //                     option.value.toUpperCase().includes(inputValue.toUpperCase()) 
    //                 }
    //             >
    //                 <Input.Search size="large" placeholder="Enter Keywords"  />
    //             </AutoComplete>
    //         </Form.Item>
    //       </Form>
    //       <div className="demo-infinite-container">
    //         <InfiniteScroll
    //         initialLoad={false}
    //         pageStart={0}
    //         hasMore={!loading && hasMore}
    //         useWindow={false}
    //         >
    //         <List
    //             dataSource={data}
    //             renderItem={item => (
    //             <List.Item key={item.id}>
    //                 <List.Item.Meta
    //                 title={item.name}
    //                 description={item.description}
    //                 />
    //                 <div>Content</div>
    //             </List.Item>
    //             )}
    //         >
    //             {loading && hasMore && (
    //             <div className="demo-loading-container">
    //                 <Spin />
    //             </div>
    //             )}
    //         </List>
    //         </InfiniteScroll>
    //     </div>
    //   </div>
    );
}

export default SearchCollege;