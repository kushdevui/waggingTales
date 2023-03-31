import React, { Component } from 'react';
import CustomHeader from '../header-footer';
import CustomFooter from '../header-footer/CustomFooter';
import CustomSidebar from '../Sidebar/CustomSidebar';

class AboutUs extends Component {
    render() {
        return (
            <React.Fragment>
                <CustomSidebar />
                <div className="container-fluid blogs-banner-fluid">
                    <CustomHeader />
                </div>
                <div className="container-fluid upcoming-trips-fluid position-relative common-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center common-heading">
                                <h5>About Us</h5>
                            </div>
                            <div className="col-12 text-center">
                                <p className='h4 my-5'>
                                    It all started back in the year 2015,founded by veterans of travel
                                    industry with a vision to offer traveller an extensive selection of
                                    hotels, tours and travel services to meet every budget
                                    BreakBag® Holidays Private Limited came into existence.
                                </p>
                                <p className='h4 my-5'>
                                    We are B2C travel company of trusted passionate travel
                                    specialists who create customized luxury journeys to inspiring
                                    destinations for you .With a client satisfaction ratings of more
                                    than 90% including traveller travelled via online platform and
                                    other sources helped BreakBag® to received an award of
                                    Destination Expert - Outbound from India’s leading online
                                    holiday marketplace.
                                </p>
                                <p className='h4 my-5'>
                                    Also,the way with which the BreakBag® treats its customers
                                    helps BreakBag® in attracting more than 50% repeated visits.
                                    Our expertise, knowledge and personal relationships allow us to
                                    design journeys that are rugged and adventurous, urban and
                                    ultra-sophisticated, or the perfect blend of both. With more and
                                    more Indians initiating International tour today it has become
                                    important for us to achieve long a term sustainable growth and
                                    development by building values, adopting best business practices
                                    and seek newer opportunities time to time .
                                </p>
                                <p className='h4 my-5'>
                                    BreakBag® excels in International &amp; Domestic Tour packages
                                    including guided group tours, exclusive customised holiday
                                    packages, corporate MICE travel and Student Travel. The key
                                    factors that makes us unique from the rest is Post Booking
                                    Services and On Tour Support,in order to create uniqueness we
                                    have a dedicated team who handles Post Booking Services and
                                    On Tour Support,which we think is more important than Sales or
                                    Marketing in order to create a positive impact on Client
                                    Retention . Our Future Planning Involves Partner Programs
                                    through Retail Stores, Franchise Programs and a full-fledged
                                    travel brand having a pan India presence.
                                </p>
                                <p className='h4 my-5'>
                                    We are looking to achieve this through an integrated approach
                                    and spreading our network in all the cities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomFooter />
            </React.Fragment>
        );
    }
}

export default AboutUs;