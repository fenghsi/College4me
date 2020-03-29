import React from 'react';
import {Link } from 'react-router-dom';
import { Form, Input, Button} from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;

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

function SignInForm(props) {
    
    return (
        <Form
            {...layout}
            className="signupform"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={props.handleLogin}
            onFinishFailed={onFinishFailed}
            >
            <Title className="signup-title"><h1>Login</h1> </Title>
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

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                Sign In
                </Button>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;Need an account?&nbsp; <Link to="/adduser">Register</Link>
            </Form.Item>
            <br></br>
       </Form>
    );
}

export default SignInForm;