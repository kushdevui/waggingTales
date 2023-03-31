import React, { Component } from "react";
import { Card, Layout, Table, Space, Button } from 'antd';
import './index.scss';
import AdminHeader from "../AdminHeader";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { NavLink } from "react-router-dom";
import { reverse } from "named-urls";
import { getCategories, removeCategory } from "../../Controller/api/category.Service";

const {  Content } = Layout;



class Categories extends Component {

  constructor(props){
    super(props);
    this.state={
      fetching:true,
      categories:[]
    }
  }


  componentDidMount(){

    getCategories().then((res)=>{
      this.setState({fetching:false,categories:res.data.response.categories})
    }).catch((err)=>{
      this.setState({fetching:false})
    })
    
  }

  handleDelete=(id)=>{
    removeCategory(id).then(res=>{
      this.setState({
        categories: this.state.categories.filter(category=>category._id!==id)
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
        title: 'Action',
        key: 'action',
        render: (text, record) => (
        
          <Space size="middle">
            <Button type="primary" onClick={()=>{   history.push(reverse(routes.dashboard.categories.edit,{id:record._id}))}}>Edit</Button>
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
              <Card title="Categories" extra={<Button type="primary" onClick={()=>history.push(routes.dashboard.categories.create)}>Add Category</Button>}>
                  <Table loading={this.state.fetching} columns={columns} dataSource={this.state.categories}/>
              </Card>
            </div>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Categories;
