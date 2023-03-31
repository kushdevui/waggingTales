import React, { Component } from 'react';
import './index.scss'
import {Link} from "react-router-dom";
import {Image as Images} from "../Images";
import { getCategories } from '../../Controller/api/category.Service';
import {map} from 'lodash'
class CustomFooter extends Component {
    state={
        categoryFetching: true,
        categories: []
    }
    componentDidMount() {
        getCategories().then(res=> {
            this.setState({categoryFetching:false,categories:res.data.response.categories})
        }).catch(err=>{
            this.setState({
                categoryFetching: false
            })
        })
    }
    render() {
        return (
            <div className="container-fluid custom-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-6 col-sm-6 col-xl-2 col-lg-4 col-md-4">
                            <ul className="list-inline mb-0">
                                {map(this.state.categories, category=>{
                                    return(
                                        <li>
                                            <Link to={' '}>{category.name}</Link>
                                        </li>  
                                    )
                                })}
                                {/* <li>
                                    <Link to={' '}>Backpacking Trips</Link>
                                </li>
                                <li>
                                    <Link to={' '}>Weekend Trips</Link>
                                </li>
                                <li>
                                    <Link to={' '}>Offbeat Stays</Link>
                                </li>
                                <li>
                                    <Link to={' '}>Wildlife Adventures</Link>
                                </li>
                                <li>
                                    <Link to={' '}>Leisure Trips</Link>
                                </li>
                                <li>
                                    <Link to={' '}>International Trips</Link>
                                </li> */}
                            </ul>
                        </div>
                        <div className="col-6 col-sm-6 col-xl-3 col-lg-4 col-md-4">
                            <h6>Call Us</h6>
                            <ul className="list-inline mb-0">
                                <li>
                                    <Link to={' '}>+917699002674  |  +91-6294448400</Link>
                                </li>
                            </ul>
                            <h6>Email Us</h6>
                            <ul className="list-inline mb-0">
                                <li>
                                    <Link to={' '}>support@breakbag.com</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-0 col-xl-5 col-md-0 col-lg-0"/>
                        <div className="col-12 col-sm-2 col-xl-2 col-lg-4 col-md-4 text-left mob-time-padd">
                            <div>
                                <h6>Follow Us On</h6>
                                <ul className="list-inline social-link mb-0">
                                    <li className="list-inline-item">
                                        <Link to={' '}>
                                            <img src={Images.insta_icons} alt={' '} className="img-fluid"/>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to={' '}>
                                            <img src={Images.fb_icons} alt={' '} className="img-fluid"/>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomFooter;