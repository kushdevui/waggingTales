import React, { Component } from "react";
import { Card, Layout, Table, Space, Button } from 'antd';
import './index.scss';
import AdminHeader from "../AdminHeader";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { deleteTrip, getTrips } from "../../Controller/api/trip.Service";

const {  Content } = Layout;


class Trips extends Component {


  constructor(props){
    super(props);
    this.state = {
      trips:[],
      isFetching:true
    }
  }


  componentDidMount(){
    getTrips().then((res)=>{
      this.setState({
        trips:res.data.response.trips
      })
    }).catch((err)=>{
      console.log("err", err);
    })
  }

  handleDelete=(id)=>{
    deleteTrip(id).then(res=>{
      this.setState({
        trips: this.state.trips.filter(trip=> trip._id !== id)
      })
    }).catch(err=>{
      console.log(err,'err')
    })
  }


  render() {
    const columns = [
      {
        title: 'Trip Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render:(text)=><div>{text.name}</div>
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render:(text)=><div>{text? "Active" : "Inactive"}</div>
      },
      {
        title: 'To City',
        dataIndex: 'toCity',
        key: 'toCity',
      },
      {
        title: 'From City',
        dataIndex: 'fromCity',
        key: 'fromCity',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
        
          <Space size="middle">
            <Button type="primary" onClick={()=>{ history.push(reverse(routes.dashboard.trips.edit,{id:record._id}))}}>Edit</Button>
            <Button onClick={()=>this.handleDelete(record._id)} type="primary" danger>Delete</Button>
          </Space>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Layout className="layout">
          <AdminHeader/>
          <Content style={{ padding: '20px' }}>
          <Card title="Trips" extra={<Button type="primary" onClick={()=>history.push(routes.dashboard.trips.create)}>Add Trip</Button>}>
              <Table columns={columns} dataSource={this.state.trips}/>
            </Card>
           
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Trips;
