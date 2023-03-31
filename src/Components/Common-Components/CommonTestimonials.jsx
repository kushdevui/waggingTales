import React, {Component} from 'react';
import Testimonials from "./Testimonials";
import './index.scss'
class CommonTestimonials extends Component {
    render() {
        return (
            <div className="row mx-0">
                <div className="col-12 text-center">
                    <h2>Testimonials</h2>
                </div>
                <div className="col-12">
                    <Testimonials/>
                </div>
            </div>
        );
    }
}

export default CommonTestimonials;