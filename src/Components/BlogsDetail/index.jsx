import React, { Component } from 'react';
import './index.scss'
import { Button, Carousel, DatePicker, Form, Input, Select } from "antd";
import { Image as Images } from "../Images";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import CustomFooter from "../header-footer/CustomFooter";
import CustomSidebar from "../Sidebar/CustomSidebar";
import { getBlogById } from '../../Controller/api/blog.Service';
import { BASE_URL, S3_URL } from "../../Controller/common";
import CommonBlogsCarousal from "../Common-Components/CommonBlogsCarousal";

import { map } from 'lodash'
import { history } from '../../Controller/history';
import { reverse } from 'named-urls';
import { routes } from '../../Controller/Routes';

import CustomHeader from "../header-footer";

class BlogDetails extends Component {
    state = {
        categories: [],
        blogData: []
    }

    componentDidMount() {
        const blogID = this.props.match.params.id; 
        getBlogById(blogID).then(res => {
            this.setState({
                blogData: res.data.response.blog
            })
        }).catch(err => {

        })
    }

    render() {
        return (
            <>
                <CustomSidebar />
                <div className="container-fluid blogs-banner-fluid-detail" style={{ backgroundImage: `url(${S3_URL}${this.state.blogData.coverImage})` }}>
                    <div className="overlay"></div>
                    <CustomHeader/>
                    <div className="container">
                        <div className="row upcoming-trips-slider-row position-relative" >
                            <h1>{this.state.blogData['title']}</h1>
                        </div>
                    </div>
                   
                </div>
                <div className="container-fluid upcoming-trips-fluid position-relative common-bg">
                   
                    <div className="container">
                        <div className="row">

                          
                            <div className="col-12 upcoming-list-card">
                                <div  dangerouslySetInnerHTML={{__html: this.state.blogData.description}}>
                                 

                                </div>
                            </div>
                            <div className="col-12 blog-slider-heading">
                                <h5>You might also like</h5>
                                <CommonBlogsCarousal />
                            </div>
                        </div>
                    </div>
                </div>
               
                <CustomFooter />
            </>
        );
    }
}

export default BlogDetails;