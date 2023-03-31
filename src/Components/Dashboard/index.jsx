import React, { Component } from "react";
import { Layout } from 'antd';
import './index.scss';
import AdminHeader from "../AdminHeader";
const { Content } = Layout;

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <Layout className="layout">
          <AdminHeader/>
          <Content style={{ padding: '20px' }}>
            <div className="site-layout-content">Dashboard</div>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Dashboard;
