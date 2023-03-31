import React, { Component } from 'react';
import './index.scss'
import { Button, Carousel, DatePicker, Form, Input, Select } from "antd";
import { Image as Images } from "../Images";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import CustomFooter from "../header-footer/CustomFooter";
import CustomSidebar from "../Sidebar/CustomSidebar";
import { getBlogs } from '../../Controller/api/blog.Service';
import { map } from 'lodash'
import { S3_URL } from '../../Controller/common';
import { history } from '../../Controller/history';
import { reverse } from 'named-urls';
import { routes } from '../../Controller/Routes';
import CustomHeader from "../header-footer";
import moment from 'moment';


class BlogsFE extends Component {
    state = {
        categories: [],
        blogs: []
    }
    componentDidMount() {
        
        getBlogs().then(res => {
            this.setState({
                blogs: res.data.response.blogs
            })
        }).catch(err => {

        })
    }
    render() {
        return (
            <>
                <CustomSidebar />
                <div className="container-fluid blogs-banner-fluid">
                <CustomHeader/>
                </div>
                <div className="container-fluid upcoming-trips-fluid position-relative common-bg">
                   
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center common-heading">
                                <h5>Blogs</h5>
                            </div>
                          
                            <div className="col-12 upcoming-list-card">
                                <div className="row">
                                    {map(this.state.blogs, blog => {
                                         const timestamp = blog._id.toString().substring(0,8)
                                         const date= moment(new Date( parseInt( timestamp, 16 ) * 1000 )).format('Do MMM YYYY')
                                        return (

                                            <div className="col-12 col-sm-4">
                                                <Link to={`${routes.blogs}/${blog._id}`}>
                                                <div className="row mx-0 card-upcoming">
                                                    <div className="col-12 upcoming-card-img">
                                                        <img src={`${S3_URL}${blog.thumbnailImage}`} alt={''} className="img-fluid" />
                                                    </div>
                                                    <div className="col-12 blog-item-list">
                                                        <h6>{blog.title}</h6>
                                                        <div className="sub-title">{date}</div>
                                                    </div>
                                                    {blog.hotTag && <div className='tag'>{blog.hotTag}</div>}
                                                </div>
                                                </Link>
                                            </div>
                                          
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
                <CustomFooter />
            </>
        );
    }
}

export default BlogsFE;