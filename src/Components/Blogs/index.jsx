import React, { Component } from "react";
import { Card, Layout, Table, Space, Button } from 'antd';
import './index.scss';
import AdminHeader from "../AdminHeader";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { getBlogs,removeBlog } from "../../Controller/api/blog.Service";


const {  Content } = Layout;


class Blog extends Component {

  constructor(props){
    super(props);
    this.state={
      fetching:true,
      blog:[]
    }
  }


  componentDidMount(){
    getBlogs().then((res)=>{
      this.setState({fetching:false,blog:res.data.response.blogs})
    }).catch((err)=>{
      this.setState({fetching:false})
    })
    
  }


  handleDelete=(id)=>{
    removeBlog(id).then(res=>{
      this.setState({
        blog: this.state.blog.filter(b=>b._id!==id)
      })
    }).catch(err=>{
      console.log(err,'err')
    })
  }




  render() {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width:'20%'
      },
      {
        title: 'Sub Title',
        dataIndex: 'subTitle',
        key: 'subTitle',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
        
          <Space size="middle">
            <Button type="primary" onClick={()=>{   history.push(reverse(routes.dashboard.blogs.edit,{id:record._id}))}}>Edit</Button>
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
              <Card title="Testimonials" extra={<Button type="primary" onClick={()=>history.push(routes.dashboard.blogs.create)}>Add Blog</Button>}>
                  <Table loading={this.state.fetching} columns={columns} dataSource={this.state.blog}/>
              </Card>
            </div>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Blog;
