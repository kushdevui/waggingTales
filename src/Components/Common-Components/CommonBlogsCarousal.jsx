import React, {Component} from 'react';
import BlogsList from "./BlogsList";
import './index.scss'
class CommonBlogsCarousal extends Component {
    render() {
        return (
            <div className="row mx-0">
              
                <div className="col-12 p-0">
                    <BlogsList/>
                </div>
            </div>
        );
    }
}

export default CommonBlogsCarousal;