import React, {Component} from "react";
import {Steps,Button} from 'antd';
import {get, map} from 'lodash'
import {isMobile} from 'react-device-detect';
import { DownloadOutlined } from "@ant-design/icons";

import './index.scss'
import { S3_URL } from "../../Controller/common";

const {Step} = Steps;

class ItineraryTabs extends Component {
    render() {
        const days = get(this.props, 'trip.days', [])
        return (
            <div className="row mx-0 tabs-main-row itenery-tab">
                <div className={"col-12"}>
                    <div className="row tabs-card-data">
                        <div className="col-12 col-sm-2">
                            {!isMobile && <Steps progressDot current={0} direction="vertical">
                                {map(days, (day, index) => {
                                    return (
                                        <Step title={`Day ${index + 1}`}/>
                                    )
                                })}

                            </Steps>
                            }
                        </div>
                        <div className="col-12 col-sm-10">
                            <div className="row itinerary-details-row">
                                {map(days, (day, index) => {
                                    return (
                                        <div className="col-12 col-details-div">
                                            <h5>{`Day ${index + 1}${index === 0 ? ': Arrival' : ''}`}</h5>
                                            <p>{day}</p>
                                        </div>
                                    )
                                })}
                            </div>
                           {this.props?.trip?.itinerary && <Button onClick={()=>window.open(`${S3_URL}${this.props.trip.itinerary}`, '_blank')} icon={<DownloadOutlined />} className="common-btn">Download Itnerary</Button>}
                        </div>
                       
                    </div>
                   
                </div>
                
            </div>
        )
    }
}

export default ItineraryTabs;