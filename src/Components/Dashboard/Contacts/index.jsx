import { Button, Card, Layout, Space, Table } from 'antd';
import { reverse } from 'named-urls';
import React, { Component } from 'react';
import { getContacts } from '../../../Controller/api/contactService';
import { history } from '../../../Controller/history';
import { routes } from '../../../Controller/Routes';
import AdminHeader from '../../AdminHeader';
const { Content } = Layout;
class Contacts extends Component {
    state = {
        fetching: true,
        contacts: []
    }
    componentDidMount() {
        getContacts().then(res => {
            this.setState({
                contacts: res.data.response.contacts,
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
                title: 'Message',
                dataIndex: 'message',
                key: 'message',
                width: '50%'
            }
        ];
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title="Contacts">
                                <Table loading={this.state.fetching} columns={columns} dataSource={this.state.contacts} />
                            </Card>
                        </div>
                    </Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default Contacts;