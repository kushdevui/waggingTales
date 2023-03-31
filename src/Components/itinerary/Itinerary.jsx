import React, { Component } from "react";
import { Button, Tabs } from "antd";
import { Image as Images } from "../Images";
import './index.scss'
import ItineraryTabs from "./ItineraryTabs";
import BatchesTabs from "./BatchesTabs";
import CustomFooter from "../header-footer/CustomFooter";
import { getTripById } from "../../Controller/api/trip.Service";
import { history } from "../../Controller/history";
import { routes } from "../../Controller/Routes";
import { get } from 'lodash'
import { S3_URL } from "../../Controller/common";
import CustomSidebar from "../Sidebar/CustomSidebar";
import CustomHeader from "../header-footer";
import HotelView from "./HotelView"
import { isMobile } from 'react-device-detect';
const {TabPane} = Tabs;


class Itinerary extends Component {
    state = {
        trip: null,
        isFetching: true,
        selectedBatch: ''
    }

    componentDidMount() {
        if (!this.props.match.params.id) {
            history.push(routes.home)
        }
        getTripById(this.props.match.params.id).then(res => {
            this.setState({
                isFetching: false,
                trip: res.data.response.trip
            })
        }).catch(err => {
            this.setState({
                isFetching: false
            })
        })
    }

    updateSelectedBatch = (value) => {
        this.setState({ selectedBatch: value })
    }

    render() {
        const { trip } = this.state
        return (
            <React.Fragment>
                <CustomSidebar />
                <div className="container-fluid itinerary-fluid">
                    <CustomHeader />
                    <div className="container">
                        <div className="row itinerary-main-heading-row">
                            <div className="col-12 col-sm-9">
                                <h6>{get(trip, 'name', '')}</h6>
                                <ul className="mb-0 list-inline">
                                    <li className="list-inline-item">
                                        <span>{get(trip, 'duration', '')}</span>
                                    </li>
                                    <li className="list-inline-item">
                                        <span>best seller</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-sm-3">
                                <Button className="call-back-btn float-right">
                                    <img src={Images.phone_white_icons} alt={""} className="img-fluid" />
                                    get a call back</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid itinerary-fluid-details common-bg">
                    <div className="container">
                        <div className="row img-section-row">
                            <div className="col-12 col-sm-6 itinerary-img-div itinerary-1-img">
                                    {
                                        !isMobile ?  <img src={`${S3_URL}${get(trip, 'heroImage','')}`} alt={' '} className="img-fluid" /> 
                                        :  <img src={`${S3_URL}${get(trip, 'thumbnailImage','')}`} alt={' '} className="img-fluid" />
                                    }
                               
                            </div>
                            {isMobile &&
                                <div className="col-12">
                                    <div className="row itinerary-row-data-main">
                                        <div className="col-12 tabs-main-row pl-0">
                                            <div className="row mx-0 itinerary-request-offer-row">
                                                <div className="col-12">
                                                    <div className="row offer-inner">
                                                        <div className="col-12">
                                                            <div className="row offer-card-row">
                                                                <div className="col-12">
                                                                    <div
                                                                        className="off-tag">{`${(((trip?.price - trip?.discountedPrice) / trip?.price) * 100).toFixed(2)}% off`}</div>
                                                                    <h6>
                                                                        <del>₹{trip?.price}</del>
                                                                    </h6>
                                                                    <h5>₹{trip?.discountedPrice} <sub>per person</sub></h5>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 p-0">
                                                                <p className="mb-0">
                                                                    <img src={Images.calendar_icon} alt={''} className="img-fluid" />
                                                                    {this.state.selectedBatch}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 itinery-cta">
                                                    <Button disabled={!this.state.selectedBatch} onClick={() => history.push({
                                                        pathname: routes.bookIng,
                                                        state: { batch: this.state.selectedBatch, trip: trip }
                                                    })} className="common-btn">Place your request</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {!isMobile &&
                                <div className="col-12 col-sm-3 pl-web-0 itinerary-img-div itinerary-2-img">
                                    <img src={`${S3_URL}${get(trip, 'thumbnailImage', '')}`} alt={' '}
                                        className="img-fluid" />
                                </div>
                            }
                            {!isMobile &&
                                <div className="col-12 col-sm-3 pl-web-0">
                                    <div className="row">
                                        <div className="col-12 itinerary-img-div itinerary-3-img">
                                            <img src={`${S3_URL}${get(trip, 'images', [])[0]}`} alt={' '}
                                                className="img-fluid" />
                                        </div>
                                        <div className="col-12 itinerary-img-div itinerary-4-img">
                                            <img alt={''} src={`${S3_URL}${get(trip, 'images', [])[1]}`}
                                                className="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        
                        {trip && <div className="row itinerary-row-data-main">
                            <div className="col-12 col-sm-9">
                                <Tabs defaultActiveKey="1" type="card">
                                    <TabPane tab="itinerary" key="1">
                                        <ItineraryTabs trip={trip} />
                                    </TabPane>
                                    <TabPane forceRender={true} tab="batches" key="2">
                                        <BatchesTabs selectedBatch={this.state.selectedBatch}
                                            updateSelectedBatch={this.updateSelectedBatch} trip={trip} />
                                    </TabPane>
                                    <TabPane tab="Other Info">
                                        <div className="row mx-0 tabs-main-row">
                                            <div className={"col-12"}>
                                                <div className="row tabs-card-data">
                                                <div  dangerouslySetInnerHTML={{__html: trip.otherInfo}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                               {trip.inclusions.includes('hostel') && <HotelView trip={trip}/>}
                            </div>
                            
                            {!isMobile &&
                                <div className="col-12 col-sm-3 tabs-main-row pl-0">
                                    <div className="row mx-0 itinerary-request-offer-row">
                                        <div className="col-12">
                                            <div className="row offer-inner">
                                                <div className="col-12">
                                                    <div className="row offer-card-row">
                                                        <div className="col-12">
                                                            <div
                                                                className="off-tag">{`${(((trip?.price - trip?.discountedPrice) / trip?.price) * 100).toFixed(2)}% off`}</div>
                                                            <h6>
                                                                <del>₹{trip?.price}</del>
                                                            </h6>
                                                            <h5>₹{trip?.discountedPrice} <sub>per person</sub></h5>
                                                        </div>
                                                    </div>
                                                    {this.state.selectedBatch && <div className="col-12 p-0">
                                                        <p className="mb-0">
                                                            <img src={Images.calendar_icon} alt={''} className="img-fluid" />
                                                            {this.state.selectedBatch}
                                                        </p>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 itinery-cta">
                                            <Button disabled={!this.state.selectedBatch} onClick={() => history.push({
                                                pathname: routes.bookIng,
                                                state: { batch: this.state.selectedBatch, trip: trip }
                                            })} className="common-btn">Place your request</Button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>}
                    </div>
                </div>
                <CustomFooter />
            </React.Fragment>
        )
    }
}

export default Itinerary;