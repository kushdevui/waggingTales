import React, { Component } from 'react';
import { Button, Form, Input, Progress, notification } from "antd";
import { Image as Images } from "../Images";
import { Link } from "react-router-dom";
import './index.scss'
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import CustomFooter from "../header-footer/CustomFooter";
import CustomSidebar from '../Sidebar/CustomSidebar';
import { history } from '../../Controller/history';
import { routes } from '../../Controller/Routes';
import CustomHeader from "../header-footer";
import { map, forEach } from 'lodash'
import { createBooking, updateBooking } from '../../Controller/api/bookingService';
const openNotification = (placement, message, description) => {
    notification.info({
        message,
        description,
        placement,
    });
};
const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

class Booking extends Component {
    formRef = React.createRef()
    state = {
        adult: 1,
        kid: 1,
        loading: false,
        kid1: ''
    }
    componentDidMount() {
        if (!this.props.location?.state?.batch) {
            history.push(routes.upcomingTrips)
        }
        loadScript("https://checkout.razorpay.com/v1/checkout.js")
    }
    onValuesChange = (values) => {
        if ('kid1' in values) {
            this.setState({
                kid1: values['kid1']
            })
        }
    }
    calculateAmount = () => {
        const { trip } = this.props.location.state
        const adultPrice = this.state.adult * trip.discountedPrice
        const kidPrice = (this.state.kid > 1 || (this.formRef.current && this.formRef.current.getFieldValue('kid1'))) ? this.state.kid * trip.kidPrice : 0
        const totalPeoplePrice = adultPrice + kidPrice
        const gst = 0.05 * totalPeoplePrice
        const total = trip.isInternational ? totalPeoplePrice + gst + gst : totalPeoplePrice + gst
        return { gst: gst.toFixed(2), total: total.toFixed(2) }
    }
    onFinish = (values) => {
        const { batch, trip } = this.props.location.state
        this.setState({
            loading: true
        })
        const adults = []
        const kids = []
        forEach(Object.keys(values), value => {
            console.log(value, 'hee')
            if (value.includes('adult')) {
                adults.push(values[value])
            }
            if (value.includes('kid') && values[value]) {
                kids.push(values[value])
            }
        })
        const newValues = {
            ...values,
            adults,
            kids,
            trip: trip._id,
            batch,
            amount: this.calculateAmount().total
        }
        console.log(newValues)
        createBooking(newValues).then(res => {
            console.log(res, 'response')
            let booking = res.data.response.booking;
            const _ = this;
            const options = {
                key: "rzp_test_VvNB31ZThygAyP",
                currency: "INR",
                amount: booking.amount * 100,
                order_id: booking.orderId,
                name: "Break Bag Travel",
                description: "Transaction",
                image: "http://breakbag.com/static/media/logo.38b01b9d.png",
                prefill: {
                    name: booking.name,
                    email: booking.email,
                    contact: booking.contact
                },
                handler: function (response) {
                    updateBooking({
                        ...booking,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        status: 'success'
                    }, booking._id).then(res => {
                        _.setState({
                            loading: false
                        }, () => {
                            openNotification('bottomCenter', 'Booking created Successfully', "Thanks for booking. You'll be recieving all the details!");
                            history.push(routes.home)
                        })
                    }).catch(err => {
                        console.log(err)
                        _.setState({
                            loading: false
                        }, () => {
                            openNotification('bottomCenter', 'Booking created Successfully', "There's something wrong at our end! Please contact us!");
                        })
                    })
                },
                theme: {
                    color: "#0f3362"
                }

            }
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', function (response){
                updateBooking({
                    ...booking,
                    razorpayOrderId: response.error.metadata.order_id,
                    razorpayPaymentId: response.error.metadata.payment_id,
                    status: 'failed'
                }, booking._id).then(res => {
                    _.setState({
                        loading: false
                    }, () => {
                        openNotification('bottomCenter', 'Payment Failed', "Please Try again!");
                    })
                }).catch(err => {
                    console.log(err)
                    _.setState({
                        loading: false
                    }, () => {
                        openNotification('bottomCenter', 'Payment Failed', "Please Try again!");
                    })
                })
        });
        }).catch(err => {
            openNotification('bottomCenter', 'Booking Failed', "Please try again later");
        })
    }
    render() {
        if (!this.props.location.state) {
            return <div />
        }
        const { batch, trip } = this.props.location.state
        return (
            <>
                <CustomSidebar />
                <div className="container-fluid booking-banner-fluid">
                    <CustomHeader />
                    <div className="container">
                        <div className="row banner-all-details-row align-items-center">
                            <div className="col-12 col-sm-7 col-xl-9 col-lg-7 col-md-7">
                                <h6>Complete your booking</h6>
                                <p className="mb-0">Fill in the form below to complete your booking</p>
                            </div>
                            <div className="col-12 col-sm-3">
                                <ul className="list-inline mb-0 progress-status">
                                    <li className="list-inline-item">
                                        <img src={Images.check_circle} alt={' '} className="img-fluid" />
                                    </li>
                                    <li className="list-inline-item">
                                        <img src={Images.check_circle} alt={' '} className="img-fluid" />
                                    </li>

                                </ul>
                                <ul className="list-inline mb-0 progress-bar">
                                    <li className="list-inline-item">
                                        <Progress strokeColor={'#ea6c40'} percent={50} showInfo={false} />
                                    </li>
                                </ul>
                                <ul className="list-inline mb-0 progress-text">
                                    <li className="list-inline-item">
                                        <span>
                                            Package
                                            Details
                                        </span>
                                    </li>
                                    <li className="list-inline-item">
                                        <span>Traveller
                                            Details</span>
                                    </li>
                                    <li className="list-inline-item">
                                        <span>Make Payment</span>
                                    </li>
                                </ul>
                                <div className="row">
                                    <div className="col-12">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid booking-form-fluid common-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-8 col-xl-9 col-lg-8 col-md-8">
                                <div className="row">
                                    <div className="col-12">
                                        <h5>{trip.name}</h5>
                                        <div className="tag-static">{trip.duration}</div>
                                        <ul className="mb-0 list-inline">
                                            <li className="list-inline-item">Dates:</li>
                                            <li className="list-inline-item">{batch}</li>
                                        </ul>
                                        <ul className="mb-0 list-inline">
                                            <li className="list-inline-item">Inclusions:</li>
                                            {trip.inclusions.includes('flight') && <li className="list-inline-item">
                                                <img src={Images.flight_icon} alt={''} className="img-fluid" />
                                                <span>Flight</span>
                                            </li>}
                                            {trip.inclusions.includes('hostel') && <li className="list-inline-item">
                                                <img src={Images.bed_icon} alt={''} className="img-fluid" />
                                                <span>Hostel</span>
                                            </li>}
                                            {trip.inclusions.includes('food') && <li className="list-inline-item">
                                                <img src={Images.mug_hot_cuff} alt={''} className="img-fluid" />
                                                <span>Food</span>
                                            </li>}
                                        </ul>
                                        <ul className="mb-0 list-inline">
                                            <li className="list-inline-item">From:</li>
                                            <li className="list-inline-item">{trip.fromCity}</li>
                                        </ul>
                                    </div>
                                    <>
                                        <Form
                                            name="basic"
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                            autoComplete="off"
                                            ref={this.formRef}
                                            onFinish={this.onFinish}
                                            requiredMark={false}
                                            onValuesChange={this.onValuesChange}
                                        >
                                            <div className="col-12">
                                                <div className="row mx-0 traveller-info">
                                                    <div className="col-12 p-0">
                                                        <h6>Traveller Information</h6>
                                                        <div class="ant-form ant-form-horizontal">
                                                            <div className="row">
                                                                <div className="col-12 col-sm-6">
                                                                    {map([...Array(this.state.adult)], (item, index) => (
                                                                        <div style={{ position: 'relative' }} key={item}>
                                                                            <Form.Item
                                                                                label={
                                                                                    <div>Adult {index + 1}</div>
                                                                                }
                                                                                name={`adult${index + 1}`}
                                                                                rules={[{
                                                                                    required: true,
                                                                                    message: 'Please enter Adult Name'
                                                                                }]}
                                                                            >
                                                                                <Input placeholder={'Enter name'} />
                                                                            </Form.Item>
                                                                            <Button onClick={() => this.setState({
                                                                                adult: index === [...Array(this.state.adult)].length - 1 ? this.state.adult + 1 : this.state.adult - 1
                                                                            })} className="add-btn rounded-0">
                                                                                {index === [...Array(this.state.adult)].length - 1 ? <PlusOutlined /> : <MinusOutlined />}
                                                                                {index === [...Array(this.state.adult)].length - 1 ? "Add" : "Remove"}
                                                                            </Button>
                                                                        </div>
                                                                    ))}

                                                                </div>
                                                                <div className="col-12 col-sm-6">
                                                                    {map([...Array(this.state.kid)], (item, index) => (
                                                                        <div style={{ position: 'relative' }} key={item}>
                                                                            <Form.Item
                                                                                label={
                                                                                    <div>Kid {index + 1}</div>
                                                                                }
                                                                                name={`kid${index + 1}`}
                                                                                rules={[{
                                                                                    required: this.state.kid > 1,
                                                                                    message: 'Please enter Kid name!'
                                                                                }]}
                                                                            >
                                                                                <Input placeholder={'Enter name'} />
                                                                            </Form.Item>
                                                                            <Button onClick={() => this.setState({
                                                                                kid: index === [...Array(this.state.kid)].length - 1 ? this.state.kid + 1 : this.state.kid - 1
                                                                            })} className="add-btn rounded-0">
                                                                                {index === [...Array(this.state.kid)].length - 1 ? <PlusOutlined /> : <MinusOutlined />}
                                                                                {index === [...Array(this.state.kid)].length - 1 ? "Add" : "Remove"}
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0 traveller-info">
                                                    <div className="col-12 p-0">
                                                        <h6>Please enter your contact details</h6>
                                                        <div
                                                            class="ant-form ant-form-horizontal"
                                                        >
                                                            <div className="row">
                                                                <div className="col-12 col-sm-6">
                                                                    <Form.Item
                                                                        label={
                                                                            <div>Name<sup style={{ color: 'red' }}>*</sup></div>
                                                                        }
                                                                        name="name"
                                                                        rules={[{
                                                                            required: true,
                                                                            message: 'Please enter your name!'
                                                                        }]}
                                                                    >
                                                                        <Input placeholder={'Enter name'} />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="col-12 col-sm-6">
                                                                    <Form.Item
                                                                        label={
                                                                            <div>Email Id<sup style={{ color: 'red' }}>*</sup></div>
                                                                        }
                                                                        name="email"
                                                                        rules={[{
                                                                            required: true,
                                                                            message: 'Please enter your email id!'
                                                                        }, {
                                                                            type: 'email',
                                                                            message: 'Please enter valid email id!'
                                                                        }]}
                                                                    >
                                                                        <Input placeholder={'Enter email'} />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="col-12 col-sm-6">
                                                                    <Form.Item
                                                                        label={
                                                                            <div>Contact No.<sup style={{ color: 'red' }}>*</sup></div>
                                                                        }
                                                                        name="contact"
                                                                        rules={[{
                                                                            required: true,
                                                                            message: 'Please enter your contact no'
                                                                        }, {
                                                                            pattern: new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/),
                                                                            message: 'Please enter valid contact number'
                                                                        }]}
                                                                    >
                                                                        <Input placeholder={'Enter contact'} />
                                                                    </Form.Item>
                                                                </div>

                                                                <div className="col-12 col-sm-6">
                                                                    <Form.Item
                                                                        label={
                                                                            <div>Address<sup style={{ color: 'red' }}>*</sup></div>
                                                                        }
                                                                        name="address"
                                                                        rules={[{
                                                                            required: true,
                                                                            message: 'Please enter your address!'
                                                                        }]}
                                                                    >
                                                                        <Input placeholder={'Enter address'} />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="col-12 col-sm-6">
                                                                    <Form.Item
                                                                        label='Special Requests'
                                                                        name="request"
                                                                        rules={[{
                                                                            required: false,
                                                                            // message: 'Please input your username!'
                                                                        }]}
                                                                    >
                                                                        <Input.TextArea className="textArea" placeholder={'Enter request'} />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 col-xl-3 col-lg-4 col-md-4 itn-mob-row">
                                <div className="row mx-0 itinerary-request-offer-row">
                                    <div className="col-12">
                                        <div className="row offer-inner">
                                            <div className="col-12">
                                                <div className="row offer-card-row">
                                                    <div className="col-12">
                                                        <div className="off-tag">{`${(((trip?.price - trip?.discountedPrice) / trip?.price) * 100).toFixed(2)}% off`}</div>
                                                        <h6>
                                                            Grand Total
                                                        </h6>
                                                        <h5>₹{trip.discountedPrice}  <sub>(Inclusive of all taxes)</sub></h5>
                                                    </div>
                                                </div>
                                                <div className="col-12 p-0">
                                                    <ul className="list-inline mb-0">
                                                        <li className="list-inline-item">₹{trip.discountedPrice} x {this.state.adult} Pax</li>
                                                        <li className="list-inline-item">₹{this.state.adult * trip.discountedPrice}</li>
                                                    </ul>
                                                    {(this.state.kid > 1 || (this.formRef.current && this.formRef.current.getFieldValue('kid1'))) && <ul className="list-inline mb-0">
                                                        <li className="list-inline-item">₹{trip.kidPrice} x {this.state.kid} Kid</li>
                                                        <li className="list-inline-item">₹{this.state.kid * trip.kidPrice}</li>
                                                    </ul>}
                                                    <ul className="list-inline mb-0">
                                                        <li className="list-inline-item">GST (5.0%)</li>
                                                        <li className="list-inline-item">₹{this.calculateAmount().gst}</li>
                                                    </ul>
                                                    {trip.isInternational && <ul className="list-inline mb-0">
                                                        <li className="list-inline-item">TCS (5.0%)</li>
                                                        <li className="list-inline-item">₹{this.calculateAmount().gst}</li>
                                                    </ul>}
                                                    <ul className="list-inline mb-0">
                                                        <li className="list-inline-item border-0"><b>Grand Total</b></li>
                                                        <li className="list-inline-item border-0"><b>₹{this.calculateAmount().total}</b></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Button loading={this.state.loading} onClick={() => this.formRef.current.submit()} className="common-btn">Pay Now</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomFooter />
            </>
        );
    }
}

export default Booking;