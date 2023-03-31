import React, { Component } from "react";
import { Card, Layout, Table, Space, Button } from 'antd';
import { reverse } from "named-urls";
import { getHotels, removeHotel } from "../../../Controller/api/hotelService";
import AdminHeader from "../../AdminHeader";
import { history } from "../../../Controller/history";
import { routes } from "../../../Controller/Routes";


const { Content } = Layout;

class Hotels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            hotels: []
        }
    }
    componentDidMount() {

        getHotels().then((res) => {
            this.setState({ fetching: false, hotels: res.data.response.Hotels })
        }).catch((err) => {
            this.setState({ fetching: false })
        })

    }
    handleDelete = (id) => {
        removeHotel(id).then(res => {
            this.setState({
                hotels: this.state.hotels.filter(hotel => hotel._id !== id)
            })
        }).catch(err => {
            console.log(err, 'err')
        })
    }
    render() {
        const columns = [
            {
                title: 'Hotel Name',
                dataIndex: 'hotelName',
                key: 'hotelName'
            },
            {
                title: 'Hotel Rating',
                dataIndex: 'hotelRating',
                key: 'hotelRating',
            },
            {
                title: 'Hotel Includes',
                dataIndex: 'hotelIncludes',
                key: 'hotelIncludes'
            },
            {
                title: "Check In Time",
                dataIndex: 'hotelCheckInTime',
                key: 'hotelCheckInTime'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                
                  <Space size="middle">
                    <Button type="primary" onClick={()=>{ history.push(reverse(routes.dashboard.hotels.edit,{id:record._id}))}}>Edit</Button>
                    <Button onClick={()=>this.handleDelete(record._id)} type="primary" danger>Delete</Button>
                  </Space>
                ),
              },
        ];
        return (
            <React.Fragment>
                <Layout className="layout">
                    <AdminHeader />
                    <Content style={{ padding: '20px' }}>
                        <div className="site-layout-content">
                            <Card title="Hotels" extra={<Button type="primary" onClick={() => history.push(routes.dashboard.hotels.create)}>Add Hotels</Button>}>
                                <Table loading={this.state.fetching} columns={columns} dataSource={this.state.hotels} />
                            </Card>
                        </div>
                    </Content>
                </Layout>
            </React.Fragment>
        );
    }
}

export default Hotels;