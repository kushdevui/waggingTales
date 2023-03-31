import React, { Component } from "react";
import { Card, Layout, Input, Button, Form, Upload, Spin, Rate } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './index.scss';
import AdminHeader from "../../AdminHeader";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { BASE_URL, S3_URL } from "../../../Controller/common";
import { get } from 'lodash'
import { createTestimonial, getTestimonialById, updateTestimonial } from "../../../Controller/api/testimonial.Service";


const { Content } = Layout;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ManageTestimonial extends Component {
  formRef = React.createRef()
  state = {
    buttonLoading: false,
    loading: false,
    testimonialData: {},
    fetching: false
  }

  componentDidMount() {
    const testimonialId = this.props.match.params.id;
    if (testimonialId) {
      this.setState({ fetching: true })
      getTestimonialById(testimonialId).then((res) => {
        // this.formRef.current.setFieldsValue({
        //   name: 'kush'
        // })
        this.setState({
          testimonialData: res.data.response.testimonial,
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

  onFinish = (values) => {
    this.setState({ buttonLoading: true })
    const testimonialId = this.props.match.params.id;
    if (testimonialId) {
      updateTestimonial(values, testimonialId).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.testimonial.self);
      }).catch((err) => {
        console.log("edit err", err)
      })
    } else {
      createTestimonial(values).then((res) => {
        this.setState({ buttonLoading: false })
        history.push(routes.dashboard.testimonial.self);
      }).catch((err) => {
        this.setState({ buttonLoading: false })
        console.log("error")
      })
    }
  }

  render() {
    const { loading, imageUrl } = this.state;
    const testimonialId = this.props.match.params.id;

    if (this.state.fetching) {
      return <Spin size="large" />
    }
    return (
      <React.Fragment>
        <Layout className="layout">
          <AdminHeader />
          <Content style={{ padding: '20px' }}>
            <div className="site-layout-content">
              <Card title={testimonialId ? "Edit Testimonial" : "Create Testimonial"} extra={<Button type="primary" onClick={() => history.push(routes.dashboard.testimonial.self)}>Testimonials</Button>}>
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
                    ...this.state.testimonialData
                  }}
                  onFinish={this.onFinish}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Name',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Description!',
                      },

                    ]}
                    max="100"
                  >
                    <Input.TextArea maxLength={200} />
                  </Form.Item>
                  <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter rating!',
                      },
                    ]}
                  >
                   <Rate/>
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 5,
                      span: 12,
                    }}
                  >
                    <Button style={{ width: "200px" }} loading={this.state.buttonLoading} type="primary" htmlType="submit">
                      {testimonialId ? "Edit" : "Create"}
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

export default ManageTestimonial;
