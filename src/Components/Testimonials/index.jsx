import React, { Component } from "react";
import { Card, Layout, Table, Space, Button } from 'antd';
import './index.scss';
import AdminHeader from "../AdminHeader";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { getTestimonial,removeTestimonial } from "../../Controller/api/testimonial.Service";


const {  Content } = Layout;


class Testimonials extends Component {

  constructor(props){
    super(props);
    this.state={
      fetching:true,
      testimonials:[]
    }
  }


  componentDidMount(){

    getTestimonial().then((res)=>{
      this.setState({fetching:false,testimonials:res.data.response.testimonials})
    }).catch((err)=>{
      this.setState({fetching:false})
    })
    
  }


  handleDelete=(id)=>{
    removeTestimonial(id).then(res=>{
      this.setState({
        testimonials: this.state.testimonials.filter(testimon=>testimon._id!==id)
      })
    }).catch(err=>{
      console.log(err,'err')
    })
  }




  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width:'20%'
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'rating',
        key: 'rating',
        render: (text, record) => (
        
          <Space size="middle">
            <Button type="primary" onClick={()=>{   history.push(reverse(routes.dashboard.testimonial.edit,{id:record._id}))}}>Edit</Button>
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
            <div className="site-layout-content">
              <Card title="Testimonials" extra={<Button type="primary" onClick={()=>history.push(routes.dashboard.testimonial.create)}>Add Testimonial</Button>}>
                  <Table loading={this.state.fetching} columns={columns} dataSource={this.state.testimonials}/>
              </Card>
            </div>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Testimonials;
