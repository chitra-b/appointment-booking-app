import React, { Component } from "react";
import { connect } from "react-redux";
import { loadUser, login } from "../actions/accounts/usermanagement/auth";
import { loadUserProfile } from "../actions/accounts/myprofilemanagement/getprofile";
import {
  Alert,
  Layout,
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Row,
  Col
} from "antd";
import { Redirect } from "react-router-dom";
import DjangoCSRFToken from "django-react-csrftoken";

const { Header, Footer, Sider, Content } = Layout;

export class Login extends Component {
  // componentWillMount() {
  //   this.props.loadUserProfile();
  // }
  state = {
    username: "",
    password: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(this.state.username, this.state.password);
      }
    });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    if (this.props.isAuthenticated) {
      this.props.loadUserProfile();
      return <Redirect to="/" />;
    }
    const { username, password } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout>
        <Content>
          <Row
            className="content-container"
            type="flex"
            justify="center"
            align="middle"
          >
            <Col xs={24} sm={16} md={12} lg={8}>
              {this.props.isError ? (
                <Alert
                  message="Login Failed"
                  description="Invalid username or password"
                  type="error"
                  closable
                />
              ) : (
                <span />
              )}
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("username", {
                    rules: [
                      { required: true, message: "Please input your username!" }
                    ]
                  })(
                    <Input
                      onChange={this.onChange}
                      size="large"
                      name="username"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Username"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: "Please input your Password!" }
                    ]
                  })(
                    <Input
                      onChange={this.onChange}
                      size="large"
                      name="password"
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {/* {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: true,
                                            })(<Checkbox>Remember me</Checkbox>)} */}
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                  {this.props.isLoading ? (
                    <Button
                      type="primary"
                      size="large"
                      className="login-form-button"
                      loading
                    >
                      Loading
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Log in
                    </Button>
                  )}
                </Form.Item>
                <DjangoCSRFToken />
              </Form>
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  token: state.auth.token,
  isError: state.auth.isError
});
export default connect(
  mapStateToProps,
  { login, loadUserProfile }
)(Login);
