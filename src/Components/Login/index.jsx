import React, { Component } from "react";
import { connect } from "react-redux";
import './index.scss';
import { userLoginAction,userLogOutAction } from "../../Store/actions/authAction";
import { Button, Form, Input, notification, Col, Row } from 'antd';
import { login } from "../../Controller/api/authServices";
import { Image as Images } from "../Images";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";


const openNotification = () => {
  notification.open({
    message: 'Invalid Credentials',
    description:
      'Please check your Email Id and Password and try again!',
  });
};

class Login extends Component {
  
  state={
    loading:false
  }

  componentDidMount(){
    if(this.props.user && this.props.user.token){
      history.push(routes.dashboard.self);
    }
  }

  
  onFinish = (values) => {
    this.setState({
      loading:true
    })
    login(values).then(res=>{
      const token = res.data.data.token;
      this.setState({
        loading:false
      },
      ()=>{
        this.props.userLoginAction({token})
        if(this.props.userToken){
          history.push(routes.dashboard.self);
        }
      }
    )
    }).catch(err=>{
      this.setState({
        loading:false
      },()=>openNotification())
    })
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
   
    return (
      <React.Fragment>
        <div className="container">
            <div className="login-page">
            <div>
             <img style={{width: '120px'}} className="img-fluid" src={Images.logo}/>
            </div>
            <Row>
              <Col span={24}>
              <Form
              name="basic"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button loading={this.state.loading} type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
              </Col>
            </Row>
           
            </div>
        </div>
      </React.Fragment>
    );
  }
}

// const mapActionToProps = {
//   userLoginAction,
//   userLogOutAction,
// };

const mapDispatchToProps = (dispatch) =>{
  return{
    userLoginAction: (data) => dispatch(userLoginAction(data))
  }
}

const mapStateToProps = (state) =>{
  return{
    userToken:state.user.token
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
