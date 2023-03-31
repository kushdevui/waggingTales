import React, { Component } from 'react';
import './index.scss'
import { AutoComplete, Button, Carousel, DatePicker, Form, Input, Select, Spin } from "antd";
import { Image as Images } from "../Images";
import { RightOutlined } from "@ant-design/icons";
import CustomFooter from "../header-footer/CustomFooter";
import CustomizeTripsForm from "../Common-Components/CustomizeTripsForm";
import CommonTestimonials from "../Common-Components/CommonTestimonials";
import CustomSidebar from "../Sidebar/CustomSidebar";
import { getCategories } from '../../Controller/api/category.Service';
import { getTrips } from '../../Controller/api/trip.Service';
import { find, map } from 'lodash'
import { S3_URL } from '../../Controller/common';
import { history } from '../../Controller/history';
import { reverse } from 'named-urls';
import { routes } from '../../Controller/Routes';
import CustomHeader from "../header-footer";
import { isMobile } from 'react-device-detect';


const { Search } = Input;
const { Option } = Select;

class UpcomingTrips extends Component {
    state = {
        categories: [],
        trips: null,
        destinations: [],
        filteredTrips: null
    }
    formRef = React.createRef(null)

    async componentDidMount() {
        window.scrollTo(0, 0)
        await getCategories().then(res => {
            this.setState({
                categories: res.data.response.categories
            })
        }).catch(err => {

        })
        await getTrips().then(res => {
            this.setState({
                trips: res.data.response.trips,
                filteredTrips: res.data.response.trips
            }, () => {
                let cities = [];
                cities = this.state.trips.map(function (value) {
                    return {
                        "label": value['toCity'],
                        "value": value['toCity']
                    }
                });
                cities = cities.filter((v, i, a) => a.findIndex(v2 => (v2.value === v.value)) === i)
                this.setState({
                    destinations: cities
                })
            })
        }).catch(err => {

        })
        if (this.props.location?.state) {
            this.formRef.current.setFieldsValue({
                search: this.props.location?.state?.search,
                destination: this.props.location?.state?.selectedCity,
                type: this.props.location?.state?.searchedCategory
            })
            this.getFilteredTrips()
        }
    }

    onSearch = (data) => {
        const trip = find(this.state.trips, {name:data})
        this.formRef.current.setFieldsValue({
            search: data,
            destination: trip?.toCity || undefined,
            type: trip?.category._id || undefined
        })
    }

    changeDestination = (data)=>{
        this.formRef.current.setFieldsValue({
            search: undefined,
            destination: data,
            type: undefined
        })
    }
    changeType = (data) => {

        this.formRef.current.setFieldsValue({
            search: undefined,
            destination: undefined,
            type: data
        })
    }

    getFilteredTrips = () => {
        let trips = [...this.state.trips];
        let search = this.formRef.current.getFieldValue('search');
        let type = this.formRef.current.getFieldValue('type');
        let destination = this.formRef.current.getFieldValue('destination');

        if (search) {
            trips = trips.filter(trip => trip.name.toLowerCase().includes(search.toLowerCase()))
        }
        if (destination) {
            trips = trips.filter(trip => trip.toCity.toLowerCase().includes(destination.toLowerCase()))
        }
        if (type) {
            trips = trips.filter(trip => trip.category._id === type)
        }


        this.setState({
            filteredTrips: trips
        })
    }

    render() {
      const currentCat =   this.props.location.state.category ; 

       const selectedCategoryItem =  this.state.categories.find(cat => cat._id === currentCat );
       

       console.log("selectedItme", selectedCategoryItem)
       const upcomingTripsList = [
            {
                item: 'international Trips',

            },
            {
                item: <img src={Images.upcoming_small_icon_1} alt={''} className="img-fluid" />
            },
            {
                item: 'Backpacking Trips',
            },
            {
                item: <img src={Images.upcoming_small_icon_2} alt={''} className="img-fluid" />,
            },
            {
                item: 'Untouched Trips',
            },
            {
                item: <img src={Images.upcoming_small_icon_3} alt={''} className="img-fluid" />,
            },
            {
                item: 'Weekend Trips',
            },
            {
                item: <img src={Images.upcoming_small_icon_4} alt={''} className="img-fluid" />,
            },
            {
                item: 'spiritual Trips',
            },
            {
                item: <img src={Images.upcoming_small_icon_5} alt={''} className="img-fluid" />,
            },
            {
                item: 'leisure Trips',
            },
            {
                item: <img src={Images.upcoming_small_icon_1} alt={''} className="img-fluid" />,
            }
        ]
        return (

            <>
                <CustomSidebar />
                <div className="container-fluid upcoming-trips-banner-fluid">
                    <CustomHeader />
                    <div className="container">
                        <div className="row upcoming-trips-slider-row position-relative">
                            <div className="small-carousel-img-div">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <img src={Images.slider_small_img} alt={''} className={'img-fluid'} />
                                    </li>
                                    <li className="list-inline-item">
                                        <img src={Images.slider_small_img_3} alt={''} className={'img-fluid'} />
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 p-0">
                                <Carousel  dots ={false} effect="fade">
                                   
                                   {
                                       selectedCategoryItem && 
                                            <div>
                                                <div className="row">
                                                    <div className="col-12 col-sm-9 offset-sm-1">
                                                        <div className="row align-items-center">
                                                            {!isMobile &&
                                                                <div className="col-12 col-sm-5">
                                                                    <h3>{`${selectedCategoryItem.name.split(' ')[0]} `}<span>{selectedCategoryItem.name.split(' ')[1]}</span></h3>
                                                                    <p>{selectedCategoryItem.subtitle}</p>
                                                                </div>
                                                            }
                                                            <div style={{ position: 'relative', zIndex: '-1' }}
                                                                className="col-12 col-sm-7">
                                                                <img src={`${S3_URL}${selectedCategoryItem.image}`}
                                                                    className="img-fluid"
                                                                    alt={' '} />
                                                            </div>
                                                            {isMobile &&
                                                                <div className="col-12 col-sm-5 upcoming-trips-col-heading">
                                                                    <h3>{`${selectedCategoryItem.name.split(' ')[0]} `}<span>{selectedCategoryItem.name.split(' ')[1]}</span></h3>
                                                                    <p>{selectedCategoryItem.subtitle}</p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                       
                                    }

                                </Carousel>
                            </div>
                        </div>
                    </div>
                    <div className="row mx-0 upcoming-all-trips">
                        <div className="col-12 p-0 list">
                            {upcomingTripsList.map(e => {
                                return <div className="">
                                    <h6 className="mb-0">
                                        {e.item}
                                    </h6>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="container-fluid upcoming-trips-fluid position-relative common-bg">
                    <div className="row mx-0 upcoming-trip-img-all mt-5">
                        <ul className="list-inline mb-0">
                            {/* <li className="list-inline-item card-1">
                                <img src={Images.trip_inn_1} alt={''} className="img-fluid" />
                            </li>
                            <li className="list-inline-item card-2" />
                            <li className="list-inline-item card-3">
                                <img src={Images.trip_inn_2} alt={''} className="img-fluid" />
                            </li>
                            <li className="list-inline-item card-4" />
                            <li className="list-inline-item card-5">
                                <img src={Images.trip_inn_3} alt={''} className="img-fluid" />
                            </li>
                            <li className="list-inline-item card-6">
                                <img src={Images.trip_inn_4} alt={''} className="img-fluid" />
                            </li> */}
                        </ul>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center common-heading">
                                <h5>Upcoming trips</h5>
                            </div>
                            <div className="col-12 upcoming-form-select">
                                <Form
                                    ref={this.formRef}
                                    className="common-form"
                                    name="basic"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 124 }}
                                    // initialValues={{remember: true}}
                                    // onFinish={onFinish}
                                    // onFinishFailed={onFinishFailed}
                                    onFieldsChange={this.getFilteredTrips}
                                    autoComplete="off"
                                >
                                    <div className="row">
                                        <div className="col-12 col-sm-6">
                                            <Form.Item
                                                label="Search By Destination"
                                                name="search"
                                                rules={[{
                                                    required: false,
                                                    message: ''
                                                }]}
                                            >
                                                <AutoComplete
                                                    style={{
                                                        width: "100%",
                                                        height: "70px",
                                                        color:"#000000",
                                                    }}
                                                    onSelect={this.onSearch}
                                                    placeholder={'Search by destination/city'}
                                                    filterOption={(inputValue, option) =>
                                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                    }
                                                    options={!this.state.trips ? [] : this.state.trips.map(trip => { return { name: trip.name, value: trip.name } })}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <Form.Item
                                                label="month"
                                                name="month"
                                                rules={[{
                                                    required: false,
                                                    message: ''
                                                }]}
                                            >
                                                <DatePicker picker="month" />
                                            </Form.Item>
                                        </div>
                                        {/* {!isMobile &&
                                            <div className="col-6 col-sm-2">
                                                <Form.Item
                                                    label="destination"
                                                    name="destination"
                                                    rules={[{
                                                        required: false,
                                                        message: ''
                                                    }]}
                                                >
                                                    <Select onChange={this.changeDestination} placeholder={'Select Destination'}>
                                                        {
                                                            this.state.destinations.map((item, index) => {
                                                                return <Option value={item.value}>{item.label}</Option>
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        } */}
                                        <div className="col-6 col-sm-3">
                                            <Form.Item
                                                label="Type"
                                                name="type"
                                                rules={[{
                                                    required: false, message: ''
                                                }]}
                                            >
                                                <Select onChange={this.changeType}
                                                    placeholder={'Select Type'}>
                                                    {map(this.state.categories, category => {
                                                        return (
                                                            <Option key={category._id}
                                                                value={category._id}>{category.name}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className="col-12 upcoming-list-card">
                                {!this.state.filteredTrips ? <div className='row '>
                                    <div className='col-12 text-center '>
                                        <Spin size="large" />
                                    </div>
                                </div> :
                                    <div className="row">
                                        {map(this.state.filteredTrips, trip => {

                                            return (
                                                <div className="col-12 col-sm-12 col-xl-4 col-md-6 col-lg-4 list-item">
                                                    <div className="row mx-0 card-upcoming">
                                                        <div className="col-12 upcoming-card-img">
                                                            <img src={`${S3_URL}${trip.thumbnailImage}`} alt={''}
                                                                className="img-fluid" />
                                                        </div>
                                                        <div className="col-12 trips-card-details">
                                                            <div className="trip-location-tag">{trip.fromCity}</div>
                                                            <h6>{trip.name}</h6>
                                                            <ul className="list-inline">
                                                                {trip.inclusions.includes('flight') &&
                                                                    <li className="list-inline-item">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <img src={Images.flight_icon} alt={''}
                                                                                    className="img-fluid" />
                                                                                <div className="d-inline-block w-100">Flight
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>}
                                                                {trip.inclusions.includes('hostel') &&
                                                                    <li className="list-inline-item">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <img src={Images.bed_icon} alt={''}
                                                                                    className="img-fluid" />
                                                                                <div className="d-inline-block w-100">Hostel
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>}
                                                                <li className="list-inline-item">
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <img src={Images.calendar_icon_small} alt={''}
                                                                                className="img-fluid" />
                                                                            <div
                                                                                className="d-inline-block w-100">{trip.duration}</div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                            <h5>₹{trip.discountedPrice}<sub> per person</sub></h5>
                                                            <Button
                                                                onClick={() => history.push(reverse(routes.itinerary, { id: trip._id }))}
                                                                className="go-details-btn">
                                                                <RightOutlined />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )

                                        })}

                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="container-fluid contact-details-fluid">
                    <div className="container">
                        <CustomizeTripsForm />
                    </div>
                </div> */}
                <div className="container-fluid testimonials-fluid common-bg">
                    <div className="container">
                        <CommonTestimonials />
                    </div>
                </div>
                <CustomFooter />
            </>
        );
    }
}

export default UpcomingTrips;