import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, notification, Space } from "antd";
import moment from 'moment';
import { createCustomizeTrip } from '../../Controller/api/customizeTrip';
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";


const { RangePicker } = DatePicker;
const openNotification = (placement, message, description) => {
    notification.info({
        message,
        description,
        placement,
    });
};
class CustomizeTripForm extends Component {
    formRef = React.createRef()
    state = {
        loading: false
    }

    onFinish = (values) => {
        this.setState({
            loading: true
        })
        createCustomizeTrip(values).then(res => {
            this.setState({
                loading: false
            }, () => {
                openNotification('bottomCenter', 'Your Query sent successfully', "Thanks for contacting us. You'll be contacted soon by our team!");
                this.formRef.current.resetFields()
            })
        }).catch(err => {
            this.setState({
                loading: false
            }, () => {
                openNotification('bottomCenter', 'Error while sending your message', 'Something went wrong! Please try again later.');
            })
        })
    }
    handleAddOn = (type) => {
        let traveller = parseInt(this.formRef.current.getFieldValue('travellers'))
        if(!traveller){
            this.formRef.current.setFieldsValue({
                travellers: type === 'sub' ? 0 : 1
            })
            return; 
        }
        if (traveller === 99) {
            return;
        }

        this.formRef.current.setFieldsValue({
            travellers: type === 'sub' ? traveller - 1 : traveller + 1
        })

    }

    render() {
        return (
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                // initialValues={{remember: true}}
                onFinish={this.onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                requiredMark={false}
                ref={this.formRef}
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
                            <Input placeholder="Enter Name" />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item
                            label="Email Id"
                            name="emailId"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter valid Email Id' }
                            ]}
                        >
                            <Input placeholder={'Enter Email'} />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item
                            label="Contact No."
                            name="contactNo"
                            rules={[{ required: true, message: 'Please input your Contact number!' }]}
                        >
                            <Input placeholder={'Enter Contact'} />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6 col-sm-6 pr-1">
                                <Form.Item
                                    className="value-plus-min"
                                    label=" No. of Travellers"
                                    name="travellers"
                                    rules={[
                                        { required: true, message: 'Please enter No of Travellers!' },
                                        { pattern: new RegExp('^[1-9]+[0-9]*$'), message: 'Please enter valid input' }
                                    ]}
                                >
                                    <Input placeholder='0' maxLength={2} addonBefore={<PlusOutlined onClick={() => this.handleAddOn('add')} />} addonAfter={<MinusOutlined onClick={() => this.handleAddOn('sub')} />} />
                                </Form.Item>
                            </div>
                            <div className="col-6 ol-sm-6 pl-1">
                                <Form.Item
                                    label="Month"
                                    name="month"
                                    rules={[{ required: true, message: 'Please select month!' }]}
                                >
                                    <DatePicker picker='month' disabledDate={(current) => current && current < moment().endOf('day')} format={"MMM"} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <Form.Item
                            label="Additional Requests"
                            name="additionalRequests"
                        // rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.TextArea className="textArea" placeholder={'Enter here'} />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button loading={this.state.loading} type="primary" htmlType="submit">
                                Place your request
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        )
    }
}

export default CustomizeTripForm;