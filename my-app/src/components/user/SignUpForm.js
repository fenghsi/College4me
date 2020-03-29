import React from 'react';
import axios from 'axios';
import { useHistory , Link} from 'react-router-dom';
import { Form, Input, Button} from 'antd';
import { Typography} from 'antd';
import { notification } from 'antd';

const { Title, Paragraph, Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};



function SignUpForm() {
    let history = useHistory();
    
    async function handleSignUp(event){
        //check password match repassowrd
        if(event.password === event.repassword){
            const res = await axios.post('/adduser', {
                username: event.username,
                password: event.password
            });
            //check username exists or not
            if(res.data.status==="err"){
                history.push('/adduser');
                notification.open({
                    message: res.data.msg,
                    description:"Please try again", 
                });
            }
            else{
                history.push('/');
                notification.open({
                    message: "Create Account Successfully",
                    description:"Welcome", 
                });
            }
        }
        else{
            history.push('/adduser');
            notification.open({
                message: "Passwords are not matching",
                description:"Please try again", 
            });
        };
    }

    return (
        <Form
            {...layout}
            className="signupform"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={handleSignUp}
            onFinishFailed={onFinishFailed}
            >
            <Title className="signup-title"><h1>Create C4me Account</h1> </Title>
            <br></br>
            <br></br>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <br></br>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <br></br>
            <Form.Item
                label="Re-enter Password"
                name="repassword"
                rules={[{ required: true, message: 'Please Re-enter your password!' }]}
            >
                <Input.Password  />
            </Form.Item>
            <br></br>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" >
                Create Account
                </Button>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;Already have an account? &nbsp; <Link to="/signin">Login</Link>
            </Form.Item>
            <br></br>
        </Form>
    );
}

export default SignUpForm;