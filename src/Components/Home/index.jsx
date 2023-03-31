import React, {Component} from 'react';
import './index.scss';
import {Button, Form, Input,Carousel, AutoComplete} from "antd";
import {Image as Images} from "../Images";
import CustomHeader from "../header-footer";
import SliderHome from "./SliderHome";
import {RightOutlined} from "@ant-design/icons";
// import Testimonials from "../Common-Components/Testimonials";
import CustomFooter from "../header-footer/CustomFooter";
import {getCategories} from '../../Controller/api/category.Service';
import {head, map} from 'lodash'
import {getTrips} from '../../Controller/api/trip.Service';
import {S3_URL} from '../../Controller/common';
import CustomizeTripsForm from "../Common-Components/CustomizeTripsForm";
import CommonTestimonials from "../Common-Components/CommonTestimonials";
import CustomSidebar from "../Sidebar/CustomSidebar";
import {history} from "../../Controller/history";
import {reverse} from "named-urls";
import {routes} from '../../Controller/Routes';
import {isMobile} from 'react-device-detect';

class Home extends Component {
    state = {
        categories: [],
        categoryFetching: true,
        trips: [],
        tripsFetching: true,
        selectedCategory: {},
        search: '',
        searchedCategory:"",
        selectedCity:"",
        options:[],
        filteredOptions:[],
    }

    componentDidMount() {

        getCategories().then(res => {
            this.setState({
                categoryFetching: false,
                categories: res.data.response.categories,
                selectedCategory: res.data.response.categories[0]
            })
        }).catch(err => {
            this.setState({
                categoryFetching: false
            })
        })

        


        getTrips().then(res => {
            this.setState({
                trips: res.data.response.trips,
                tripsFetching: false,
            },
                ()=>{
                    let names = [];
                    names =  this.state.trips.map(function(value) {
                        return {
                            "label":value['name'],
                            "value":value['name']
                        }
                    });
                    names = names.filter((v,i,a)=>a.findIndex(v2=>(v2.value===v.value))===i)
                   
                    this.setState({
                        options:names
                    })
                }
            )
        }).catch(err => {
            this.setState({
                tripsFetching: false
            })
        })
    }

    handleSelectedCategory = (catId) => {
        const selectedCat = this.state.categories.find(cat => cat._id === catId);
        this.setState({
            selectedCategory: selectedCat
        })
    }
    
    handleSearch = (value) => {
       
        const newOptions = this.state.options.filter(opt=>opt.value.toLowerCase().includes(value.toLowerCase()))
        this.setState({
            filteredOptions:newOptions
        })
    };

    onSelect= (data)=>{
        this.setState({
            search:data
        })
    }

    handleSubmit = () =>{
        const category = this.state.trips.filter(item=>item.name === this.state.search)[0]['category']['_id'];
        const searchedCity = this.state.trips.filter(item=>item.name === this.state.search)[0]['toCity'];
        history.push({
            pathname: routes.upcomingTrips,
            state: {
                search: this.state.search,
                searchedCategory:category,
               selectedCity:searchedCity
            }
        })
    }
   

    render() {
     
        const headTrip = head(this.state.trips);

        return (
            <React.Fragment>
                <CustomSidebar/>
                <div className="container-fluid home-main-banner">
                    <CustomHeader/>
                    <div className="container">
                        <div className="row banner-all-common">
                            <div className="col-12">
                                <h6>Discover the nature again</h6>
                                <h4>In <span>pursuit</span> of new adventure</h4>
                                <Form>
                                    {/* <Input value={this.state.search}
                                           onChange={e => this.setState({search: e.target.value})}
                                           placeholder={'Search by destination'}/> */}
                                    <AutoComplete
                                        style={{
                                            width: "100%",
                                            height:"70px"
                                        }}
                                        onSelect={this.onSelect}
                                      
                                       onSearch={this.handleSearch}
                                        placeholder={'Search by destination'}
                                        options={this.state.filteredOptions}
                                    />
                                    <Button onClick={this.handleSubmit} className="search-btn">
                                        <img src={Images.search_icon} alt={''} className="img-fluid"/>
                                    </Button>
                                </Form>
                                <ul className="list-inline">
                                    <li className="list-inline-item">Popular Search:</li>
                                    <li className="list-inline-item">Thailand, Bali, Meghalaya, Andaman, Spiti, Ladakh</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid trip-categories-fluid common-bg">
                    <ul className="list-inline mb-0">
                        <li className="list-inline-item cat-img-1">
                            <img src={Images.cat_1} alt={''} className={'img-fluid'}/>
                        </li>
                        <li className="list-inline-item cat-round-ball">
                            <div className="round-ball"/>
                        </li>
                        <li className="list-inline-item cat-heading">
                            <h6>Explore</h6>
                            <h5>trip categories</h5>
                        </li>
                        <li className="list-inline-item cat-img-2">
                            <img src={Images.cat_2} alt={''} className={'img-fluid'}/>
                        </li>
                        <li className="list-inline-item cat-img-3">
                            <img src={Images.cat_3} alt={''} className={'img-fluid'}/>
                        </li>
                    </ul>
                    <div className="row categories-inner-row-main">
                        <div className="col-12 col-sm-1 col-xl-3 col-lg-2 col-md-0"/>
                        <div className="col-12 col-sm-11 col-xl-9 col-lg-10 col-md-12 pr-0 p-0">
                            <div className="row mx-0">
                                <div className="col-12 col-sm-4">
                                    <div className="row">
                                        <div className="col-12 heading-trip">
                                            <h6>{this.state.selectedCategory.name}</h6>
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                {this.state.selectedCategory.description}
                                            </p>
                                            <button onClick={() => history.push({
                                                pathname: routes.upcomingTrips,
                                                state: {category: this.state.selectedCategory._id}
                                            })}>Explore
                                            </button>
                                            <ul className="list-inline mb-0">
                                                {map(this.state.categories, category => {
                                                    if (category._id === this.state.selectedCategory._id) {
                                                        return null
                                                    }
                                                    return (
                                                        <li style={{cursor: 'pointer'}}
                                                            onClick={() => this.handleSelectedCategory(category._id)}>{category.name}</li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-8 category-images-section">
                                              
                                    <div className="row mr-0">
                                        <div className="col-12 col-sm-7">
                                            <div className="row cat-img-inner">
                                                <div className="col-12">
                                                    {
                                                        this.state.selectedCategory.images && <img className="inner-img img-fluid" src={`${S3_URL}${this.state.selectedCategory.images[0]}`} alt={''}/>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-5 pad-right-0">
                                            <div className="row cat-img-inner  mr-0">
                                                <div className="col-12  cat-small-img cat-im-2 pr-0">
                                                    {
                                                        this.state.selectedCategory.images && <img src={`${S3_URL}${this.state.selectedCategory.images[1]}`} alt={''} className="img-fluid"/>
                                                    }
                                                </div>
                                                <div className="col-12 cat-small-img cat-im-3 pr-0">
                                                    {
                                                        this.state.selectedCategory.images && <img src={`${S3_URL}${this.state.selectedCategory.images[2]}`} alt={''} className="img-fluid"/>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
                {
           
                    map(this.state.categories,category=>{
                        const filteredTrips = this.state.trips.filter(item=>item.category.name === category.name)
                        if(filteredTrips.length >1){
                            return(
                                <div className="container-fluid">
                                    <div className="container">
                                        <div className="row upcoming-trips-row">
                                                <div className="col-12 col-sm-12 text-center">
                                                    <h6 className="heading"> {category.name}</h6>
                                            </div>
                                            <div className="col-12 col-sm-12 upcoming-slider-row">
                                                <SliderHome trips={filteredTrips || []}/>
                                            </div>
                                    </div>
                                </div>
                                </div>
                            
                            )
                        }
                        
                    })
                }
              
                <div className="container-fluid contact-details-fluid">
                    <div className="container">
                        <CustomizeTripsForm/>
                    </div>
                </div>
                <div className="container-fluid testimonials-fluid common-bg">
                    <div className="container">
                        <CommonTestimonials/>
                    </div>

                </div>
                <CustomFooter/>
            </React.Fragment>
        );
    }
}

export default Home;