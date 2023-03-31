import React, {Component} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {Image as Images} from "../Images";
import {StarOutlined} from "@ant-design/icons";
import { getBlogs } from "../../Controller/api/blog.Service";
import { map } from 'lodash';
import { BASE_URL, S3_URL } from "../../Controller/common";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
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
class BlogsList extends Component {


    constructor(props){
        super(props);
        this.state = {
            blogs:[]
        }
    }


    componentDidMount(){
        getBlogs().then((res)=>{
          this.setState({fetching:false,blogs:res.data.response.blogs})
        }).catch((err)=>{
          this.setState({fetching:false})
        })
    }


    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <Carousel responsive={responsive}>
                    {
                        map(this.state.blogs, item => {
                            return (
                                <div>
                                <div className="row mx-0 slider--row blog-item" >
                                    <div className="col-12 p-0">
                                        <img src={`${S3_URL}${item.thumbnailImage}`} className="img-fluid" />
                                    </div>
                                    <div className="col-12">
                                        <p>{item.title}</p>
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

export default BlogsList;