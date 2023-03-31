import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '../../Controller/Routes';
import { map } from 'lodash'
import { NavLink } from 'react-router-dom';
import { Image as Images } from "../Images";
const navLinks = [
    {
        name: 'Categories',
        pathname: routes.dashboard.categories.self
    },
    {
        name: 'Trips',
        pathname: routes.dashboard.trips.self
    },
    {
        name: 'Testimonial',
        pathname: routes.dashboard.testimonial.self
    },
    {
        name: 'Blogs',
        pathname: routes.dashboard.blogs.self
    },
    {
        name: "Contacts",
        pathname: routes.dashboard.contacts.self
    },
    {
        name: "Customize Trips",
        pathname: routes.dashboard.customizeTrip.self
    },
    {
        name: "Bookings",
        pathname: routes.dashboard.bookings.self
    },
    {
        name: "Hotels",
        pathname: routes.dashboard.hotels.self
    }
]
class AdminHeader extends Component {
    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <NavLink className="navbar-brand" to={routes.dashboard.self}><img style={{width: '182px'}} className="img-fluid" src={Images.logo}/></NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {
                                map(navLinks, link => {
                                    return (
                                        <li className={`nav-item ${this.props.location.pathname === link.pathname ? 'active' : ''}`}>
                                            <NavLink className="nav-link" to={link.pathname}>{link.name}</NavLink>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <span class="navbar-text">
                        <NavLink to={routes.logout}>Logout</NavLink>
                    </span>
                </nav>
            </React.Fragment>
        );
    }
}

export default withRouter(AdminHeader);