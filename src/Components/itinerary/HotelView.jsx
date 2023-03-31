import React, {Component} from "react";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import Carousel from "react-multi-carousel";

import './index.scss'
import { S3_URL } from "../../Controller/common";
import moment from "moment";


const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const contentStyle = {
    width:"100%",
}


class HotelView extends Component {

  

    state={

    }

    render(){
        const {trip} = this.props;
        const hotels = trip.hotels;
        
        return(
            <div className="row hotel-section">
                <div className="col-12">
                    <Carousel arrows={true} autoPlay={false} responsive={responsive}>
                        {
                            hotels.map((item)=>{
                                return (
                                    <div className="hotel-view" style={contentStyle}>
                                    <h2>Accomodation</h2>
                                    <div className="row content">
                                        <div className="col-lg-6 image">
                                            <img src={S3_URL+item.hotelImage} className="img-fluid"/>
                                        </div>
                                        <div className="col-lg-6">
                                        <div className="tag">Hotel</div>
                                        <p>{item.hotelName}   {[...Array(5)].map((i, index) => {
                                                                            return (<li className="list-inline-item">
                                                                                <span>{item.hotelRating > index ? <StarFilled /> : null}</span>
                                                                            </li>)
                                                                        })} </p>
                                        <ul>
                                            {/* <li><div>From</div> <span>{`${moment(trip.hotelDates[0]).format('ddd, DD MMM YYYY')} - ${moment(item.hotelDates[1]).format('ddd, DD MMM YYYY')}`}</span></li> */}
                                            {item.hotelIncludes && <li><div>Includes</div> <span>{item.hotelIncludes}</span></li>}
                                            <li><div>Room Type</div> <span>{trip.hotelRoomType}</span></li>
                                            <li><div>CheckLin</div> <span>{moment(item.hotelCheckInTime).format("hh:mm A")}</span></li>
                                        </ul>
                                        </div>
                                </div>
                            </div>
                           
                                )
                            })
                        }
                       
                    </Carousel>
                </div>
            </div>
        )
    }
}


export default HotelView