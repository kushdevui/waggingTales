import React, {Component} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { AutoComplete, Button, DatePicker, Form, Input, Select, Spin } from "antd";
import { RightOutlined } from "@ant-design/icons";

import {Image as Images} from "../Images";
import {map} from 'lodash'
import { S3_URL } from '../../Controller/common';
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { routes } from '../../Controller/Routes';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
class SliderHome extends Component {

    constructor(props){
        super(props);
    }

    render() {
        let trips = [ ...this.props.trips.filter((trip, index)=>index!==0)];
        return (
                <Carousel autoPlay={false}  itemClass="carousel-item-width"  containerClass="carousel-container"

               responsive={responsive}>
                        {
                           trips &&  map(trips,trip=>{
                                return( <React.Fragment>
                                <div onClick={()=>history.push(reverse(routes.itinerary,{id:trip._id}))} className="row mx-0 slider-img-row">
                                    <div className="col-12 p-0 item">
                                        <img src={`${S3_URL}${trip.thumbnailImage}`} alt={''} className="img-fluid"/>
                                    </div>
                                    <div className="trips-card-details">
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
                                                            {/* <Button
                                                                onClick={() => history.push(reverse(routes.itinerary, { id: trip._id }))}
                                                                className="go-details-btn">
                                                                <RightOutlined />
                                                            </Button> */}
                                    </div>
                                </div>
                            </React.Fragment>
                                )
                            })
                        }
                       
                </Carousel>
        )
    }
}

export default SliderHome;