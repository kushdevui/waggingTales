import React, { Component } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Image as Images } from "../Images";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { getTestimonial } from "../../Controller/api/testimonial.Service";
import { map } from 'lodash';

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
class Testimonials extends Component {


    constructor(props) {
        super(props);
        this.state = {
            testimonials: []
        }
    }


    componentDidMount() {

        getTestimonial().then((res) => {
            this.setState({ fetching: false, testimonials: res.data.response.testimonials })
        }).catch((err) => {
            this.setState({ fetching: false })
        })

    }


    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <Carousel arrows={true} autoPlay={false} responsive={responsive}>
                        {
                            map(this.state.testimonials, item => {
                                return (
                                    <div>
                                        <div className="row mx-0 slider--row">
                                            <div className="col-12">
                                                <p>{item.description}</p>
                                                <ul className="list-inline mb-0">
                                                    {[...Array(5)].map((i, index) => {
                                                        return (<li className="list-inline-item">
                                                            <span>{item.rating > index ? <StarFilled /> : <StarOutlined />}</span>
                                                        </li>)
                                                    })}
                                                </ul>
                                                <div className="users-name">{item.name}</div>
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

export default Testimonials;