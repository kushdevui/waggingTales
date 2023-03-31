import React, { Component } from "react";
import { Card, Layout, Input, Button, Form, Upload, Spin, Radio } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss';
import AdminHeader from "../../AdminHeader";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { BASE_URL, S3_URL } from "../../../Controller/common";
import { get } from 'lodash'
import { createBlog, getBlogById, updateBlog } from "../../../Controller/api/blog.Service";
import ReactQuill from 'react-quill'; // ES6


const { Content } = Layout;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ManageBlogs extends Component {
  formRef = React.createRef()
  state = {
    buttonLoading: false,
    loading: false,
    coverImage: "",
    categoryData: {},
    fetching: false,
    thumbnailImage: "",
    coverImageLoading: false,
  }

  componentDidMount() {
    const blogID = this.props.match.params.id;
    if (blogID) {
      this.setState({ fetching: true })
      getBlogById(blogID).then((res) => {
        // this.formRef.current.setFieldsValue({
        //   name: 'kush'
        // })
        this.setState({
          imageUrl: `${S3_URL}${res.data.response.blog.thumbnailImage}`,
          coverImage: `${S3_URL}${res.data.response.blog.coverImage}`,
          blogData: res.data.response.blog,
          fetching: false
        })
      }).catch((err) => {
        this.setState({ fetching: false })
        console.log("err---->", err)
      })
    }
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.formRef.current.setFieldsValue({
        thumbnailImage: get(info, 'file.response.response.image', '')
      })
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  handleCoverChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ coverImageLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.formRef.current.setFieldsValue({
        coverImage: get(info, 'file.response.response.image', '')
      })
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          coverImage: imageUrl,
          coverImageLoading: false,
        }),
      );
    }
  };

  onFinish = (values) => {
    this.setState({ buttonLoading: true })
    const blogID = this.props.match.params.id;
    if (blogID) {
      updateBlog(values, blogID).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.blogs.self);
      }).catch((err) => {
        console.log("edit err", err)
      })
    } else {
      createBlog(values).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.blogs.self);
      }).catch((err) => {
        this.setState({ buttonLoading: false })
        console.log("error")
      })
    }
  }

  render() {
    const { loading, imageUrl, coverImage, coverImageLoading } = this.state;
    const catId = this.props.match.params.id;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const uploadCoverButton = (
      <div>
        {coverImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    if (this.state.fetching) {
      return <Spin size="large" />
    }
    return (
      <React.Fragment>
        <Layout className="layout">
          <AdminHeader />
          <Content style={{ padding: '20px' }}>
            <div className="site-layout-content">
              <Card title={catId ? "Edit Blog" : "Create Blog"} extra={<Button type="primary" onClick={() => history.push(routes.dashboard.blogs.self)}>Blogs</Button>}>
                <Form
                  ref={this.formRef}
                  name="basic"
                  labelCol={{
                    span: 5,
                  }}
                  wrapperCol={{
                    span: 8,
                  }}
                  initialValues={{
                    ...this.state.blogData
                  }}
                  onFinish={this.onFinish}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Blog Title"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Blog Title',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Sub Title"
                    name="subTitle"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Sub Title',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Hot Tag"
                    name="hotTag"
                  >
                    <Radio.Group>
                      <Radio value="Latest">Latest</Radio>
                      <Radio value="Hot">Hot</Radio>
                      <Radio value="Best Seller">Best Seller</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Blog Description!',
                      },
                    ]}
                  >
                    {/* <Input.TextArea /> */}
                    <ReactQuill />
                  </Form.Item>

                  <Form.Item
                    label="Thumbnail Image(651PX X 651PX)"
                    name="thumbnailImage"
                    rules={[
                      {
                        required: true,
                        message: 'Please Upload Thumbnail Image',
                      },
                    ]}
                  >
                    <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${BASE_URL}/upload-image/`}
                      //beforeUpload={beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Cover Image(651PX X 651PX)"
                    name="coverImage"
                    rules={[
                      {
                        required: true,
                        message: 'Please Upload Thumbnail Image',
                      },
                    ]}
                  >
                    <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${BASE_URL}/upload-image/`}
                      //beforeUpload={beforeUpload}
                      onChange={this.handleCoverChange}
                    >
                      {coverImage ? <img src={coverImage} alt="avatar" style={{ width: '100%' }} /> : uploadCoverButton}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 5,
                      span: 12,
                    }}
                  >
                    <Button style={{ width: "200px" }} loading={this.state.buttonLoading} type="primary" htmlType="submit">
                      {catId ? "Edit" : "Create"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Content>
        </Layout>
      </React.Fragment>
    );
  }
}

export default ManageBlogs;
