import React, {Component} from 'react';
import {Link, NavLink} from "react-router-dom";
import {Image as Images} from "../Images";
import './index.scss'
import {routes} from "../../Controller/Routes";
import {Button} from "antd";
class CustomSidebar extends Component {
    render() {
        return (
            <div id={"sidebar"} className="sidebar-main position-fixed">
                <Button onClick={()=>document.getElementById('sidebar').classList.remove('show-sidebar')} className="close-btn">
                    <img src={Images.close_icon} alt={''} className="img-fluid"/>
                </Button>
                <div className="row">
                    <div className="col-12">
                        <ul className="list-inline nav-link-sidebar">
                            <li><NavLink exact to={routes.home}>Home</NavLink></li>
                            <li><NavLink exact to={{
                                pathname:routes.upcomingTrips,
                                state: {category:"625f84a81ca2489918da96a5"}  
                            }}>Trips</NavLink></li>
                            <li><NavLink exact to={routes.customizeTrip}>Customize Trips</NavLink></li>
                            <li><NavLink exact to={routes.blogs}>Blogs</NavLink></li>
                            <li><NavLink exact to={routes.contactUs}>Contact Us</NavLink></li>
                            <li><NavLink exact to={routes.aboutUs}>About Us</NavLink></li>
                            <li><NavLink exact to={routes.userAgreement}>User Agreement</NavLink></li>
                            <li><NavLink exact to={routes.termsAndCondition}>Terms and Conditions</NavLink></li>

                        </ul>
                    </div>
                    <div className="col-12">
                        <h6>We are social</h6>
                        <ul className="list-inline mb-0 social-link">
                            <li className="list-inline-item">
                                <Link to={''}>
                                    <img alt={''} className="img-fluid" src={Images.fb_primary}/>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to={''}>
                                    <img alt={''} className="img-fluid" src={Images.instagram_primary}/>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomSidebar;