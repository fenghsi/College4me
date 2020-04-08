import React, { useState, useEffect } from 'react';
import { Route, Switch,useHistory } from "react-router-dom";
import axios from 'axios';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { notification } from 'antd';
import { useLocation } from "react-router-dom";
import QuestionableByid from './QuestionableById';
import { Link } from "react-router-dom";

function Review_Questionable(props) {
    const location = useLocation();
    const [students_and_applications, setStudents_and_Applications] = useState([]);
    let history = useHistory();
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          width: 120,
          fixed: 'left',
          editable: true,

        },
        {
            title: 'Residence State',
            dataIndex: 'residence_state',
            width: 120,
        },
        {
            title: 'High School Name',
            dataIndex: 'high_school_name',
            width: 200,
        },
        {
            title: 'High School City',
            dataIndex: 'high_school_city',
            width: 200,
        },
        {
            title: 'High School State',
            dataIndex: 'high_school_state',
            width: 200,
        },
        {
            title: 'GPA',
            dataIndex: 'GPA',
            width: 120,
        },
        {
            title: 'College Class',
            dataIndex: 'college_class',
            width: 200,
        },
        {
            title: 'Major 1',
            dataIndex: 'major_1',
            width: 200,
        },
        {
            title: 'Major 2',
            dataIndex: 'major_2',
            width: 200,
        },
        {
            title: 'SAT Math',
            dataIndex: 'SAT_math',
            width: 120,
        },
        {
            title: 'SAT EBRW',
            dataIndex: 'SAT_EBRW',
            width: 120,
        },
        {
            title: 'ACT English',
            dataIndex: 'ACT_English',
            width: 120,
        },
        {
            title: 'ACT Math',
            dataIndex: 'ACT_math',
            width: 120,
        },
        {
            title: 'ACT Reading',
            dataIndex: 'ACT_reading',
            width: 120,
        },
        {
            title: 'ACT Science',
            dataIndex: 'ACT_science',
            width: 120,
        },
        {
            title: 'ACT Composite',
            dataIndex: 'ACT_composite',
            width: 200,
        },
        {
            title: 'SAT Literature',
            dataIndex: 'SAT_literature',
            width: 120,
        },
        {
            title: 'SAT US Hist',
            dataIndex: 'SAT_US_hist',
            width: 120,
        },
        {
            title: 'SAT World Hist',
            dataIndex: 'SAT_world_hist',
            width: 200,
        },
        {
            title: 'SAT Math I',
            dataIndex: 'SAT_math_I',
            width: 120,
        },
        {
            title: 'SAT Math II',
            dataIndex: 'SAT_math_II',
            width: 120,
        },
        {
            title: 'SAT Eco Bio',
            dataIndex: 'SAT_eco_bio',
            width: 120,
        },
        {
            title: 'SAT Mol Bio',
            dataIndex: 'SAT_mol_bio',
            width: 120,
        },
        {
            title: 'SAT Chemistry',
            dataIndex: 'SAT_chemistry',
            width: 200,
        },
        {
            title: 'SAT SAT_physics',
            dataIndex: 'SAT_physics',
            width: 200,
        },
        {
            title: 'Num AP Passed',
            dataIndex: 'num_AP_passed',
            width: 120,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width:200,
            fixed:"right",
            render: (_, record) => {
              return  (
                 <Link  to={location.pathname+"/"+record.name} record={record} >View Q-Applications</Link>
            
              );
            },
          },
      ];

    ///////////

    const [form] = Form.useForm();



    const EditableCell = ({
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      }) => {
        return (
          <td {...restProps}>
            { (
              children
            )}
          </td>
        );
      };


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


    ////////

    
    useEffect(() => {
        async function fetchData() {
            const res = await axios.post('/getQuestionable');
            setStudents_and_Applications(res.data.result);
        };
        fetchData();
      }, [location]);

    

    async function handleViewQApplications(event) {
        const row = await form.validateFields();

        notification.open({
                message: row.name,
                duration:2.5 
            });
    }
    
    
    return (
        <div>
            <Form form={form} onSubmit={handleViewQApplications} component={false}>
                <Table
                    components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                    columns={mergedColumns}
                    dataSource={students_and_applications}
                    bordered
                    title={() => 'Questionable Students'}
                    footer={() => ''}
                    scroll={{ x: 1300 }}

                />
            </Form>
            
        </div>
    );
}

export default Review_Questionable;