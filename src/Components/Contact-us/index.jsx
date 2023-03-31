import React, {Component} from 'react';
import './index.scss'
import {Button, DatePicker, Form, Input, InputNumber, notification} from "antd";
import {Image as Images} from "../Images";
import {Link} from "react-router-dom";
import CustomFooter from "../header-footer/CustomFooter";
import ContactForm from "../Common-Components/CustomizeTripForm";
import { createContact } from '../../Controller/api/contactService';
import CustomSidebar from '../Sidebar/CustomSidebar';
import CustomHeader from '../header-footer';

const openNotification = (placement,message, description) => {
    notification.info({
        message,
        description,
        placement,
    });
};

class ContactUs extends Component {
    state={
        loading: false
    }
    formRef=React.createRef()
    onFinish=(values)=>{
        this.setState({
            loading:true
        })
        createContact(values).then(res=>{
            this.setState({
                loading:false
            },()=>{
                openNotification('bottomCenter', 'Message Sent successfully', "Thanks for contacting us. You'll be contacted soon by our team!");
                this.formRef.current.resetFields()
            })
        }).catch(err=>{
            console.log(err)
            this.setState({
                loading:false
            },()=>{
                openNotification('bottomCenter', 'Error while sending your message', 'Something went wrong! Please try again later.');
            })
        })
    }
    render() {
        return (
            <React.Fragment>
                <CustomSidebar/>
                <div className="container-fluid contact-us-fluid">
                <CustomHeader theme={"dark"}/>
                    <div className="container">
                        <div className="row contact-us-row">
                            <div className="col-12 col-sm-12 col-xl-10 col-lg-12 col-md-12 mx-auto">
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <h5>Contact Us</h5>
                                        <div className="row">
                                            <div className="col-12 contact-details-div">
                                                <div className="details-icon">
                                                    <img src={Images.map_location} alt={''} className="img-fluid"/>
                                                </div>
                                                <div className="contact-details">
                                                    <h6>Visit Us</h6>
                                                    <p>Unit No.19,1st Floor, AMP Vaisaakkhi Mall Premises No.112, AG Block, Sector-II, Bidhannagar, West Bengal 700091</p>
                                                </div>
                                            </div>
                                            <div className="col-12 contact-details-div">
                                                <div className="details-icon">
                                                    <img src={Images.phone_icon} alt={''} className="img-fluid"/>
                                                </div>
                                                <div className="contact-details">
                                                    <h6>Call Us</h6>
                                                    <p>
                                                        <Link to={''}>0987654321</Link>
                                                        <br/>
                                                        <Link to={''}>0987654321</Link>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-12 contact-details-div">
                                                <div className="details-icon">
                                                    <img src={Images.mail_icon} alt={''} className="img-fluid"/>
                                                </div>
                                                <div className="contact-details">
                                                    <h6>Email Us</h6>
                                                    <p><Link to={''}>support@breakbag.com</Link></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="row mx-0 contact-card">
                                            <div className="col-12">
                                                <Form
                                                    name="basic"
                                                    labelCol={{span: 24}}
                                                    wrapperCol={{span: 24}}
                                                    ref={this.formRef}
                                                    // initialValues={{remember: true}}
                                                    onFinish={this.onFinish}
                                                    // onFinishFailed={onFinishFailed}
                                                    autoComplete="off"
                                                >
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <Form.Item
                                                                label="Name"
                                                                name="name"
                                                                rules={[{
                                                                    required: true, message: 'Please input your name!'
                                                                }]}
                                                            >
                                                                <Input placeholder="Enter Name"/>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-12">
                                                            <Form.Item
                                                                label="Email Id"
                                                                name="emailId"
                                                                rules={[
                                                                    {required: true, message: 'Please input your password!'},
                                                                    {type:'email', message:'Please enter valid Email Id'}
                                                                ]}
                                                            >
                                                                <Input placeholder={'Enter Email'}/>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-12">
                                                            <Form.Item
                                                                label="Contact No."
                                                                name="contactNo"
                                                                rules={[
                                                                    {required: true, message: 'Please input your ContactNo!'}
                                                                ]}
                                                            >
                                                                <InputNumber placeholder={'Enter Contact'}/>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-12">
                                                            <Form.Item
                                                                label="Message"
                                                                name="message"
                                                                rules={[{required: true, message: 'Please enter message!'}]}
                                                            >
                                                                <Input.TextArea className="textArea"
                                                                                placeholder={'Enter here'}/>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-12">
                                                            <Form.Item>
                                                                <Button loading={this.state.loading} type="primary" htmlType="submit">
                                                                    Send your message
                                                                </Button>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomFooter/>
            </React.Fragment>
        );
    }
}

export default ContactUs;