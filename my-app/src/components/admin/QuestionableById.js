import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { notification } from 'antd';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { Descriptions } from 'antd';

function QuestionableById(props) {

    const location = useLocation();
    const [applications, setApplcations] = useState([]);
    const [student, setStudent] = useState([]);
    
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
            width:200,
            fixed:"right",
            render: (_, record) => {
              return  (
                <a onClick={() => unmarkQ(record)}>
                    Unmark Questionable
                </a>               
                
              );
            },
          },
    ];
    const [form] = Form.useForm();

    const unmarkQ = async record => {
        const res = await axios.post('/unmarkQuestionable', { 
            userid: student.userid,
            college: record.college
          });
        
        setApplcations(res.data.applications);
        notification.open({
            message: "Successfully Unmark Questionable",
            duration:2.5 
        });
      };
    
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

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname);
            setApplcations(res.data.applications);
            setStudent(res.data.student)
        };
        fetchData();
    }, []);

    return (
        <div>
            <Descriptions title={student.username+"'s profile"} layout="vertical">
                <Descriptions.Item label="UserName">{student.userid}</Descriptions.Item>
                <Descriptions.Item label="Residence State">{student.residence_state}</Descriptions.Item>
                <Descriptions.Item label="high_school_name">{student.high_school_name}</Descriptions.Item>
                <Descriptions.Item label="High School City">{student.high_school_city}</Descriptions.Item>
                <Descriptions.Item label="High School State">{student.high_school_state}</Descriptions.Item>
                <Descriptions.Item label="GPA">{student.GPA}</Descriptions.Item>
                <Descriptions.Item label="college_class">{student.college_class}</Descriptions.Item>
                <Descriptions.Item label="major_1">{student.major_1}</Descriptions.Item>
                <Descriptions.Item label="major_2">{student.major_2}</Descriptions.Item>
                <Descriptions.Item label="SAT_math">{student.SAT_math}</Descriptions.Item>
                <Descriptions.Item label="SAT_EBRW">{student.SAT_EBRW}</Descriptions.Item>
                <Descriptions.Item label="ACT_English">{student.ACT_English}</Descriptions.Item>
                <Descriptions.Item label="ACT_math">{student.ACT_math}</Descriptions.Item>
                <Descriptions.Item label="ACT_reading">{student.ACT_reading}</Descriptions.Item>
                <Descriptions.Item label="ACT_science">{student.ACT_science}</Descriptions.Item>
                <Descriptions.Item label="ACT_composite">{student.ACT_composite}</Descriptions.Item>
                <Descriptions.Item label="SAT_literature">{student.SAT_literature}</Descriptions.Item>
                <Descriptions.Item label="SAT_US_hist">{student.SAT_US_hist}</Descriptions.Item>
                <Descriptions.Item label="SAT_world_hist">{student.SAT_world_hist}</Descriptions.Item>
                <Descriptions.Item label="SAT_math_I">{student.SAT_math_I}</Descriptions.Item>
                <Descriptions.Item label="SAT_math_II">{student.SAT_math_II}</Descriptions.Item>
                <Descriptions.Item label="SAT_eco_bio">{student.SAT_eco_bio}</Descriptions.Item>
                <Descriptions.Item label="SAT_mol_bio">{student.SAT_mol_bio}</Descriptions.Item>
                <Descriptions.Item label="SAT_chemistry">{student.SAT_chemistry}</Descriptions.Item>
                <Descriptions.Item label="SAT_physics">{student.SAT_physics}</Descriptions.Item>
                <Descriptions.Item label="num_AP_passed">{student.num_AP_passed}</Descriptions.Item>
            </Descriptions>
           <Form form={form}  component={false}>
                <Table
                    components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                    columns={mergedColumns}
                    dataSource={applications}
                    bordered
                    title={() => 'Questionable Applications'}
                    footer={() => ''}
                    scroll={{ x: 1300 }}

                />
            </Form>
        </div>
    );
}

export default QuestionableById;