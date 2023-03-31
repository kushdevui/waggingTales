import React, { Component } from "react";
import { Card, Layout, Input, Button, Form, Upload, Spin, Rate, TimePicker } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { get, isEmpty, has } from 'lodash'
import { createHotel, getHotelById, updateHotel } from "../../../../Controller/api/hotelService";
import AdminHeader from "../../../AdminHeader";
import { history } from "../../../../Controller/history";
import { routes } from "../../../../Controller/Routes";
import { BASE_URL, S3_URL } from "../../../../Controller/common";
import moment from 'moment'

const { Content } = Layout;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class ManageHotels extends Component {
    formRef = React.createRef()
    state = {
        buttonLoading: false,
        loading: false,
        imagesLoading: false,
        fileList: [],
        fetching: false
    }
    componentDidMount() {
        const catId = this.props.match.params.id;
        if (catId) {
            this.setState({ fetching: true })
            getHotelById(catId).then((res) => {
                console.log(res.data.response.hotel,'fff')
                this.setState({
                    imageUrl: `${S3_URL}${res.data.response.hotel.hotelImage}`,
                    fetching: false
                })
                this.formRef.current.setFieldsValue({
                    ...res.data.response.hotel,
                    hotelCheckInTime: moment(res.data.response.hotel.hotelCheckInTime)
                })
            }).catch((err) => {
                this.setState({ fetching: false })
                console.log("err---->", err)
            })
        }
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.formRef.current.setFieldsValue({
                hotelImage: get(info, 'file.response.response.image', '')
            })
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    onFinish = (values) => {
        this.setState({ buttonLoading: true })
        const catId = this.props.match.params.id;
        if (catId) {
            updateHotel(values, catId).then((res) => {
                this.setState({ buttonLoading: false })
                history.push(routes.dashboard.hotels.self);
            }).catch((err) => {
                console.log("edit err", err)
            })
        } else {
            createHotel(values).then((res) => {
                this.setState({ buttonLoading: false })
                history.push(routes.dashboard.hotels.self);
            }).catch((err) => {
                this.setState({ buttonLoading: false })
                console.log("error")
            })
        }
    }
    render() {
        const { loading, imageUrl, imagesLoading } = this.state;
        const catId = this.props.match.params.id;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        if (this.state.fetching) {
            return <Spin size="large" />
        }
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title={catId ? "Edit Hotel" : "Create Hotel"} extra={<Button type="primary" onClick={() => history.push(routes.dashboard.hotels.self)}>Hotels</Button>}>
                                <Form
                                    ref={this.formRef}
                                    name="basic"
                                    labelCol={{
                                        span: 5,
                                    }}
                                    wrapperCol={{
                                        span: 8,
                                    }}
                                    onFinish={this.onFinish}
                                    // onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Hotel Name"
                                        name="hotelName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Hotel Name',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Hotel Rating"
                                        name="hotelRating"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Hotel Rating',
                                            },
                                        ]}
                                    >
                                        <Rate />
                                    </Form.Item>
                                    <Form.Item
                                        label="Hotel Includes"
                                        name="hotelIncludes"
                                        rules={[]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Room Type"
                                        name="hotelRoomType"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Room Type',
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Check In Time"
                                        name="hotelCheckInTime"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Check In time',
                                            }
                                        ]}
                                    >
                                        <TimePicker />
                                    </Form.Item>
                                    <Form.Item
                                        label="Hotel Image (500px × 614px)"
                                        name="hotelImage"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Upload Hotel Image',
                                            },
                                        ]}
                                    >
                                        <Upload
                                            name="image"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            // multiple={true}
                                            showUploadList={false}
                                            // fileList={fileList}
                                            action={`${BASE_URL}/upload-image/`}
                                            //beforeUpload={beforeUpload}
                                            onChange={this.handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button loading={this.state.buttonLoading} type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </div>
                    </Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default ManageHotels