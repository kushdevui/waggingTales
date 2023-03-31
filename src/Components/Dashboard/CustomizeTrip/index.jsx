import { Button, Card, Layout, Space, Table } from 'antd';
import React, { Component } from 'react';
import { getCustomizeTrips } from '../../../Controller/api/customizeTrip';
import moment from 'moment';
import AdminHeader from '../../AdminHeader';
const { Content } = Layout;
class CustomizeTrip extends Component {
    state = {
        fetching: true,
        customizeTrips: []
    }
    componentDidMount() {
        getCustomizeTrips().then(res => {
            this.setState({
                customizeTrips: res.data.response.customizeTrips,
                fetching: false
            })
        }).catch(err => {
            this.setState({
                fetching: false
            })
        })
    }
    render() {
        const columns = [
            {
                title: 'Date',
                dataIndex: '_id',
                key: '_id',
                render: (data)=>{
                    const timestamp = data.toString().substring(0,8)
                    const date=  new Date( parseInt( timestamp, 16 ) * 1000 ).toDateString()
                    return(date)
                }
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Email Id',
                dataIndex: 'emailId',
                key: 'emailId',
            },
            {
                title: 'Contact No',
                dataIndex: 'contactNo',
                key: 'contactNo',
            },
            {
                title: 'No of Travellers',
                dataIndex: 'travellers',
                key: 'travellers',
            },
            {
                title: 'Month',
                dataIndex: 'month',
                key: 'month',
                render:(data)=><div>{`${moment(data).format("MMM YYYY")}`}</div>
            },
            {
                title: 'Additional Requests',
                dataIndex: 'additionalRequests',
                key: 'additionalRequests',
                width: '30%'
            }
        ];
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title="Customize Trip Requests">
                                <Table loading={this.state.fetching} columns={columns} dataSource={this.state.customizeTrips} />
                            </Card>
                        </div>
                    </Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default CustomizeTrip;