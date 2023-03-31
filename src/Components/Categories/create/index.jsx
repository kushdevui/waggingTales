import React, { Component } from "react";
import { Card, Layout, Input, Button, Form, Upload, Spin, } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss';
import AdminHeader from "../../AdminHeader";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { BASE_URL, S3_URL } from "../../../Controller/common";
import { get, isEmpty, has } from 'lodash'
import { createCategory, getCategoryById, updateCategory } from "../../../Controller/api/category.Service";


const { Content } = Layout;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ManageCategories extends Component {
  formRef = React.createRef()
  state = {
    buttonLoading: false,
    loading: false,
    imagesLoading: false,
    fileList: [],
    categoryData: {},
    fetching: false
  }

  componentDidMount() {
    const catId = this.props.match.params.id;
    if (catId) {
      this.setState({ fetching: true })
      getCategoryById(catId).then((res) => {
        this.setState({
          fileList: res.data.response.category.images.map((image, index) => {
            return {
              uid: `-${index + 1}`,
              name: image,
              status: 'done',
              url: `${S3_URL}${image}`
            }
          }),
          imageUrl: `${S3_URL}${res.data.response.category.image}`,
          categoryData: res.data.response.category,
          fetching: false
        })
        this.formRef.current.setFieldsValue({
          ...res.data.response.category
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
        image: get(info, 'file.response.response.image', '')
      })
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  handleChangeImages = ({ fileList }) => {
    console.log(fileList, 'here')
    this.setState({ fileList })
    this.formRef.current.setFieldsValue({
      images: fileList.map((file, index) => {
        if (has(file, 'response')) {
          return file.response.response.image
        }
        else {
          return file.name
        }
      })
    })
  };

  handleRemove = (item) => {
    console.log(item, 'remove')
    this.setState({
      fileList: this.state.fileList.filter(file => file.url !== item.url),

    }, () => {
      this.formRef.current.setFieldsValue({
        images: [...this.state.fileList]
      })
    })
  }

  onFinish = (values) => {
    this.setState({ buttonLoading: true })
    const catId = this.props.match.params.id;
    if (catId) {
      updateCategory(values, catId).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.categories.self);
      }).catch((err) => {
        console.log("edit err", err)
      })
    } else {
      createCategory(values).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.categories.self);
      }).catch((err) => {
        this.setState({ buttonLoading: false })
        console.log("error")
      })
    }
  }

  render() {
    const { loading, imageUrl, fileList, imagesLoading } = this.state;
    const catId = this.props.match.params.id;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const uploadImagesButton = (
      <div>
        {imagesLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload Images</div>
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
              <Card title={catId ? "Edit Category" : "Create Category"} extra={<Button type="primary" onClick={() => history.push(routes.dashboard.categories.self)}>Catetories</Button>}>
                <Form
                  ref={this.formRef}
                  name="basic"
                  labelCol={{
                    span: 5,
                  }}
                  wrapperCol={{
                    span: 8,
                  }}
                  onFinish={this.onFinish}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Category Name',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Subtitle"
                    name="subtitle"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Category Subtitle!',
                      },
                    ]}
                  >
                    <Input.TextArea maxLength={170} />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Category Description!',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    label="Category Image(651PX X 651PX)"
                    name="image"
                    rules={[
                      {
                        required: true,
                        message: 'Please Upload Category Image',
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
                    label="Category Images (345px × 533px)"
                    name="images"
                    rules={[
                      {
                        required: true,
                        message: 'Please Upload 3 side category images',
                      },
                    ]}
                  >
                    <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      // multiple={true}
                      // showUploadList={true}
                      fileList={isEmpty(fileList) ? null : fileList}
                      action={`${BASE_URL}/upload-image/`}
                      //beforeUpload={beforeUpload}
                      onChange={this.handleChangeImages}
                      onRemove={this.handleRemove}
                    >
                      {fileList.length >= 3 ? null : uploadImagesButton}
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

export default ManageCategories;
