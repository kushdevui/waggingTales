import React, { Component } from "react";
import { Card, Layout, Checkbox, Row, Col, Input, Button, notification, Form, Switch, Upload, Select, Divider, InputNumber, Space, DatePicker, Spin, Rate, TimePicker } from 'antd';
import { map, isEmpty, get, groupBy, forEach, has } from 'lodash'
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import './index.scss';
import AdminHeader from "../../AdminHeader";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { BASE_URL, S3_URL } from "../../../Controller/common";
import { getCategories } from "../../../Controller/api/category.Service";
import { createTrip, getTripById, updateTrip } from "../../../Controller/api/trip.Service";
import moment from 'moment'
import ReactQuill from 'react-quill';
import { getHotels } from "../../../Controller/api/hotelService";


const { RangePicker } = DatePicker;

const { Content } = Layout;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


const openNotification = placement => {
    notification.info({
        message: `Something Went`,
        description:
            'Something went wrong with the server API is not working',
        placement,
    });
};

class ManageTrips extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            noOfDays: 0,
            fileList: [],
            thumbnailLoading: false,
            thumbnailImageUrl: "",
            heroImageUrl: "",
            heroImageLoading: false,
            hotelImageLoading: false,
            hotelImageUrl: "",
            categories: [],
            hotels: [],
            isFetching: false,
            tripData: {},
            isformFetch: false,

        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const tripId = this.props.match.params.id;
        if (tripId) {
            this.setState({
                isformFetch: true
            })
            getTripById(tripId).then((res) => {
                const daysObj = {}
                forEach(res.data.response.trip.days, (day, index) => {
                    daysObj[`day${index + 1}`] = day
                })
                this.setState({
                    isformFetch: false,
                    fileList: res.data.response.trip.images.map((image, index) => {
                        return {
                            uid: `-${index + 1}`,
                            name: image,
                            status: 'done',
                            url: `${S3_URL}${image}`
                        }
                    }),
                    thumbnailImageUrl: `${S3_URL}${res.data.response.trip.thumbnailImage}`,
                    heroImageUrl: `${S3_URL}${res.data.response.trip.heroImage}`,
                    hotelImageUrl: res.data.response.trip.hotelImage ? `${S3_URL}${res.data.response.trip.hotelImage}` : '',
                    noOfDays: res.data.response.trip.noOfDays
                })
                this.formRef.current.setFieldsValue({
                    ...daysObj,
                    ...res.data.response.trip,
                    category: res.data.response.trip.category._id,
                    hotels: res.data.response.trip.hotels.map(hotel => hotel._id),
                    hotelDates: res.data.response.trip?.hotelDates?.map(date => moment(date)),
                    hotelCheckInTime: moment(res.data.response.trip.hotelCheckInTime),
                    batches: res.data.response.trip.batches.map(batch => {
                        return (
                            {
                                to: moment(batch.to),
                                from: moment(batch.from)
                            }
                        )
                    })
                })
            }).catch((err) => {
                console.log(err, 'err')
            })
        }

        getCategories().then((res) => {
            this.setState({
                categories: res.data.response.categories
            })
        }).catch((err) => {
            console.log("catErr", err)
        })
        getHotels().then((res) => {
            this.setState({
                hotels: res.data.response.Hotels
            })
        })
    }
    handleChange = ({ fileList }) => {
        console.log(fileList, 'here')
        this.setState({ fileList })
        this.formRef.current.setFieldsValue({
            images: fileList.map((file, index) => {
                if (has(file, 'response')) {
                    return file.response.response.image
                }
                else {
                    return file.name
                }
            })
        })
    };
    handleThumbnailChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ thumbnailLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.formRef.current.setFieldsValue({
                thumbnailImage: get(info, 'file.response.response.image', '')
            })
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    thumbnailImageUrl: imageUrl,
                    thumbnailLoading: false,
                }),
            );
        }
    }

    handleHeroImageChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ heroImageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.formRef.current.setFieldsValue({
                heroImage: get(info, 'file.response.response.image', '')
            })
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    heroImageUrl: imageUrl,
                    heroImageLoading: false,
                }),
            );
        }
    }


    handleHotelImageChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ hotelImageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.formRef.current.setFieldsValue({
                hotelImage: get(info, 'file.response.response.image', '')
            })
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    hotelImageUrl: imageUrl,
                    hotelImageLoading: false,
                }),
            );
        }
    }
    handlePDFChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.formRef.current.setFieldsValue({
                itinerary: get(info, 'file.response.response.image', '')
            })
        }
    }

    handleRemove = (item) => {
        console.log(item, 'remove')
        this.setState({
            fileList: this.state.fileList.filter(file => file.url !== item.url),

        }, () => {
            this.formRef.current.setFieldsValue({
                images: [...this.state.fileList]
            })
        })
    }

    onFinish = (values) => {
        this.setState({
            isFetching: true
        })
        const tripId = this.props.match.params.id;
        if (tripId) {
            updateTrip(values, tripId).then(res => {
                this.setState({
                    isFetching: false
                })
                history.push(routes.dashboard.trips.self);
            }).catch(err => {
                this.setState({
                    isFetching: false
                })
            })

        } else {
            createTrip(values).then((res) => {
                this.setState({
                    isFetching: false
                })
                history.push(routes.dashboard.trips.self);
            }).catch(err => {
                this.setState({
                    isFetching: false
                })
            })
        }
    }

    onFinishFailed = (error) => {
        this.setState({
            isFetching: false
        })
        openNotification('bottomCenter');
    }
    onValuesChange = (values) => {
        this.setState({
            values
        })
    }

    render() {
        const { loading, fileList, thumbnailImageUrl, thumbnailLoading, hotelImageLoading, hotelImageUrl, heroImageUrl, heroImageLoading } = this.state;
        const tripId = this.props.match.params.id;


        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const uploadButtonThumbnail = (
            <div>
                {thumbnailLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload Thumbnail</div>
            </div>
        );
        const uploadButtonHeroImage = (
            <div>
                {heroImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload Hero Image</div>
            </div>
        );
        const uploadButtonHotelImage = (
            <div>
                {hotelImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload Hotel Image</div>
            </div>
        );
        if (this.state.isformFetch) {
            return (<Spin />)
        }
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title="Manage Trip" extra={<Button type="primary" onClick={() => history.push(routes.dashboard.trips.self)}>Trips</Button>}>
                                <Form
                                    ref={this.formRef}
                                    name="basic"
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 8,
                                    }}
                                    onFinish={this.onFinish}
                                    onFinishFailed={this.onFinishFailed}
                                    autoComplete="off"
                                    onValuesChange={this.onValuesChange}
                                >
                                    <Form.Item
                                        label="Trip Name"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Trip Name',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Discounted Price (₹)"
                                        name="discountedPrice"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Discounted Price',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '200px' }}
                                            // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Actual Price (₹)"
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Actual Price',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '200px' }}
                                            // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Kid Price (₹)"
                                        name="kidPrice"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Kid Price',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '200px' }}
                                            // formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            // parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="From City"
                                        name="fromCity"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Departure Destination',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="To City"
                                        name="toCity"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Arival Destination',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Duration of the drip"
                                        name="duration"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Duration of the trip',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Is Trip International ?"
                                        name="isInternational"
                                        rules={[]}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="Trip Status"
                                        name="status"
                                        rules={[]}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item
                                        label="Category"
                                        name="category"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Select trip category',
                                            },
                                        ]}
                                    >
                                        <Select defaultValue="Select Category"  >
                                            {
                                                map(this.state.categories, category => {
                                                    return (
                                                        <Select.Option value={category._id}>{category.name}</Select.Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="inclusions" label="Inclusions">
                                        <Checkbox.Group>
                                            <Row>
                                                <Col >
                                                    <Checkbox value="flight" style={{ lineHeight: '32px' }}>
                                                        Flight
                                                    </Checkbox>
                                                </Col>
                                                <Col >
                                                    <Checkbox value="hostel" style={{ lineHeight: '32px' }}>
                                                        Accomodation
                                                    </Checkbox>
                                                </Col>
                                                <Col >
                                                    <Checkbox value="food" style={{ lineHeight: '32px' }}>
                                                        Food
                                                    </Checkbox>
                                                </Col>

                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>

                                    <Divider plain>CREATE YOUR ITINERARY</Divider>
                                    <Form.Item
                                        label="No Of Days in Trip"
                                        name="noOfDays"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter the number of days included in the trip',
                                            },
                                        ]}
                                    >
                                        <InputNumber style={{ width: '200px' }} onChange={(e) => {
                                            console.log(e)
                                            this.setState({
                                                noOfDays: e
                                            }, () => {
                                                this.formRef.current.setFieldsValue({ noOfDays: e })
                                            })
                                        }} placeholder="No of Days included in the trip" />
                                    </Form.Item>
                                    <Form.Item
                                        hidden
                                        name={`days`}
                                        initialValue={[]}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter the Day Description',
                                            },
                                        ]}
                                    />

                                    {map(Array(this.state.noOfDays), (day, index) => {
                                        return (
                                            <Form.Item
                                                label={`Day ${index + 1}`}
                                                name={`day${index + 1}`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter the Day Description',
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea onChange={(e) => {
                                                    const oldDays = this.formRef.current.getFieldValue('days') || [];
                                                    oldDays[index] = e.target.value
                                                    this.formRef.current.setFieldsValue({
                                                        days: oldDays
                                                    })
                                                }} />
                                            </Form.Item>
                                        )
                                    })}
                                    <Divider plain>CREATE BATCHES</Divider>
                                    <Form.List
                                        name="batches"
                                        rules={[
                                            {
                                                validator: async (_, batches) => {
                                                    console.log(_, batches, 'here')
                                                    if (isEmpty(batches)) {
                                                        return Promise.reject(new Error('At least 1 batch is required'));
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        {(fields, { add, remove, errors }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'from']}
                                                            rules={[{ required: true, message: 'Missing Batch Start Date' }]}
                                                        >
                                                            <DatePicker disabledDate={(current) => current && current < moment().endOf('day')} style={{ width: '200px' }} placeholder="Batch Starts From" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'to']}
                                                            rules={[{ required: true, message: 'Missing Batch End Date' }]}
                                                        >
                                                            <DatePicker disabledDate={(current) => current && current < moment().endOf('day')} style={{ width: '200px' }} placeholder="Batch Ends on" />
                                                        </Form.Item>
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add Batch
                                                    </Button>
                                                </Form.Item>
                                                <Form.ErrorList errors={errors} />
                                            </>
                                        )}
                                    </Form.List>
                                    <Divider plain>Uploads</Divider>
                                    <Form.Item
                                        label="Trip Images Thumbnail (500px × 614px)"
                                        name="thumbnailImage"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Upload Category Image',
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
                                            onChange={this.handleThumbnailChange}
                                        >
                                            {thumbnailImageUrl ? <img src={thumbnailImageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButtonThumbnail}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        label="Hero Images (570px × 258px)"
                                        name="heroImage"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Upload Hero Image',
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
                                            onChange={this.handleHeroImageChange}
                                        >
                                            {heroImageUrl ? <img src={heroImageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButtonHeroImage}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        label="Trip Images (501px × 775px)"
                                        name="images"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Upload Category Image',
                                            },
                                        ]}
                                    >
                                        <Upload
                                            name="image"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            // multiple={true}
                                            // showUploadList={true}
                                            fileList={isEmpty(fileList) ? null : fileList}
                                            action={`${BASE_URL}/upload-image/`}
                                            //beforeUpload={beforeUpload}
                                            onChange={this.handleChange}
                                            onRemove={this.handleRemove}
                                        >
                                            {fileList.length >= 2 ? null : uploadButton}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        label="Itinerary"
                                        name="itinerary"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Upload Itinerary PDF',
                                            },
                                        ]}
                                    >
                                        <Upload name="image" onChange={this.handlePDFChange} action={`${BASE_URL}/upload-image/`}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                        {this.formRef.current && this.formRef.current.getFieldValue('itinerary') && <a href={S3_URL + this.formRef.current.getFieldValue('itinerary')} target="_blank">Uploaded Itinerary</a>}
                                    </Form.Item>
                                    <Divider plain>Other Info</Divider>
                                    <Form.Item
                                        label="Other Info"
                                        name="otherInfo"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Other Information!',
                                            },
                                        ]}
                                        style={{ height: '300px' }}
                                        initialValue=''
                                    >
                                        <ReactQuill style={{ height: '250px', width: '900px' }} modules={{
                                            toolbar: [
                                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                [{ size: [] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                { 'indent': '-1' }, { 'indent': '+1' }],
                                                ['link', 'image', 'video'],
                                                ['clean']
                                            ],
                                            clipboard: {
                                                // toggle to add extra line breaks when pasting HTML:
                                                matchVisual: false,
                                            }
                                        }} formats={[
                                            'header', 'font', 'size',
                                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                                            'list', 'bullet', 'indent',
                                            'link', 'image', 'video'
                                        ]} />
                                    </Form.Item>

                                    {this.formRef.current && this.formRef.current.getFieldValue('inclusions') && this.formRef.current.getFieldValue('inclusions').includes('hostel') && <>
                                        <Divider plain>Accomodations</Divider>
                                        <Form.Item
                                            label="Hotels"
                                            name="hotels"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select atleast one hotel',
                                                },
                                            ]}
                                        >
                                            <Select mode="multiple" style={{ width: '100%' }}>
                                                {this.state.hotels.map(hotel => (
                                                    <Select.Option value={hotel._id}>{hotel.hotelName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                    </>}

                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button loading={this.state.isFetching} type="primary" htmlType="submit">
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

export default ManageTrips;
