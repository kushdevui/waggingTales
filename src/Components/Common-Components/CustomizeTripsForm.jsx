import React, { Component } from 'react';
import CustomizeTripForm from "./CustomizeTripForm";
import './index.scss'
class CustomizeTripsForm extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-12 col-sm-12 mx-auto">
                    <div className="row">
                        <div className="col-12 col-sm-5 col-md-5 col-lg-5 offset-lg-1 col-xl-5 offset-xl-1">
                            <h6>Customize your trips</h6>
                            <p>Design a unique travel experience tailored to your specific preferences and needs. Your trip, your choices!</p>
                        </div>
                        <div className="col-12 col-sm-7 col-md-7 col-lg-5 col-xl-4 col-12 col-sm-5 col-md-5 offset-lg-1 col-lg-5 col-xl-5 offset-xl-1">
                            <div className="row mx-0 contact-card">
                                <div className="col-12">
                                    <CustomizeTripForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomizeTripsForm;
