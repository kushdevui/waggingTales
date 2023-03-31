import React, { Component } from 'react';
import {Button} from "antd";
import {Image as Images} from "../Images";
import {Link} from "react-router-dom";
import './index.scss'
class CustomHeader extends Component {
    render() {
        const darkTheme = this.props.theme==="dark"

        return (
            <div className="row align-items-center custom-header">
                <div className="toggle-menu col-6">
                    <Button onClick={()=>document.getElementById('sidebar').classList.add('show-sidebar')}>
                        <img src={darkTheme?Images.menu_primary_icon:Images.toggle_menu} alt={''} className="img-fluid"/>
                    </Button>
                </div>
                <div className="logo-main col-6 text-right">
                    <Link className={darkTheme?"text-primary-theme": ""} to={''}><img style={{width:'182px'}} className='img-fluid' src={darkTheme?Images.logo_dark:Images.logo}/></Link>
                </div>
            </div>
        )
    }
}

export default CustomHeader;