import React, { Component } from 'react';
import { getBookings } from '../../../Controller/api/bookingService';
import { Button, Card, Layout, Space, Table } from 'antd';
import AdminHeader from '../../AdminHeader';
const { Content } = Layout;

class Booking extends Component {
    state = {
        fetching: true,
        bookings: []
    }
    componentDidMount() {
        getBookings().then(res => {
            this.setState({
                bookings: res.data.response.bookings,
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
                dataIndex: 'email',
                key: 'emailId',
            },
            {
                title: 'Contact No',
                dataIndex: 'contact',
                key: 'contact',
            },
            {
                title: 'Adults',
                dataIndex: 'adults',
                key: 'adults',
                render: (data)=><div>{data.join(', ')}</div>,
                width: '10%'
            },
            {
                title: 'Kids',
                dataIndex: 'kids',
                key: 'kids',
                render: (data)=><div>{data.join(', ')}</div>,
                width: '10%'
            },
            {
                title: 'Trip Name',
                dataIndex: 'trip',
                key: 'trip',
                render: (data)=><div>{data?.name || "No Trip Found"}</div>
            },
            {
                title: 'Selected Batch',
                dataIndex: 'batch',
                key: 'batch',
                width: '10%'
            },
            {
                title: 'Special Request',
                dataIndex: 'request',
                key: 'request',
                width: '20%'
            }
        ];
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title="Contacts">
                                <Table loading={this.state.fetching} columns={columns} dataSource={this.state.bookings} />
                            </Card>
                        </div>
                    </Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default Booking;