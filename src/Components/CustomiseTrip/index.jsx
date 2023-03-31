import React, { Component } from 'react';
import './index.scss'
import CustomSidebar from '../Sidebar/CustomSidebar';
import CustomHeader from '../header-footer';
import CustomFooter from '../header-footer/CustomFooter';
import CustomizeTripForm from '../Common-Components/CustomizeTripForm';

class CustomizeTrips extends Component {
    render() {
        return (
            <React.Fragment>
                <CustomSidebar />
                <div className="container-fluid customize-trip-fluid">
                    <CustomHeader />
                    <div className='container'>
                        <div className="row customize-trip-row">
                            <div className="col-12 col-sm-12 mx-auto">
                                <div className="row">
                                    <div className="col-12 col-sm-12 col-xl-5 offset-xl-1 col-md-5 col-lg-5 offset-lg-1">
                                        <h5><span>Customize</span> your trips</h5>
                                        <div className='row'>
                                            <div className="col-12 customize-trip-description">
                                                Pick your favourite vacation package from an endless list of options and customize it just the way that suits you the best. We, at Break Bag, are passionate about providing our amazing travellers with the finest vacation deals and packages for an unforgettable holiday experience. Design a unique travel experience tailored to your specific preferences and needs. Your trip, your choices!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12 col-xl-4 offset-xl-1 col-md-7 col-lg-5 offset-lg-1">
                                        <div className="row mx-0 form-card">
                                            <div className='col-12'>
                                                <CustomizeTripForm />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <CustomFooter />
            </React.Fragment>
        );
    }
}

export default CustomizeTrips;