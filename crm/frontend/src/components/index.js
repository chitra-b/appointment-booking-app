import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./sidebar";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./dashboard";
import CalendarApp from "./appointment/calendar";
import BookingWidget from './appointment/bookingwidget';
import UserAppointments from './appointment/showappointments';
import AppointmentDetails from './appointment/appointmentdetails';
import Reschedule from './appointment/reschedulewidget';
import infoPage from './appointment/appointmentinfo';
import Users from "./user";
import Login from "./login";
import { UserProfileApp } from "./user";
import { logout } from "../actions/accounts/usermanagement/auth";
import { loadUserProfile } from "../actions/accounts/myprofilemanagement/getprofile";
import { Redirect, Link } from "react-router-dom";
import {
  Menu,
  Dropdown,
  Layout,
  Row,
  Col,
  Icon,
  Button,
  Form
} from "antd";
const { Header, Footer, Content } = Layout;


class App extends Component {
  constructor(props){
    super(props);
    //validate the token of authenticated user
    if(this.props.auth.isAuthenticated){
      this.props.loadUserProfile();
   }
  }
  render() {
    const LoginFrom = Form.create({ name: "Login" })(Login);
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link icon="user" to="/profile">
            <Button type="link" icon="user">
              Profile
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          <Button type="link" onClick={this.props.logout} icon="poweroff">
            Logout
          </Button>
        </Menu.Item>
      </Menu>
    );
    return (
      <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {/* display navbar only for authenticated users */}
        {this.props.myProfile.user ? <Navbar /> :  null}
        <Layout>
          {/* display headers only for authenticated users */}
        {this.props.myProfile.user ?
          <Header style={{ backgroundColor: "#fff" }}>
            <Row type="flex">
              <Col span={24}>
                <div className="align-right">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <Link
                      style={{ fontWeight: "bold" }}
                      className="ant-dropdown-link"
                      to="/"
                    >
                      <Icon type="user" /> Hello,{" "}
                      {this.props.myProfile.user ? this.props.myProfile.user.username : ''} <Icon type="down" />
                    </Link>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Header>
          :  null}
          <Content className="container">
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/profile" component={UserProfileApp} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/calendar" component={CalendarApp} />
              <PrivateRoute path="/appointment/:id(\d+)" component={AppointmentDetails} />
              <PrivateRoute path="/appointments" component={UserAppointments} />
              <Route path="/login" component={LoginFrom} />
              <Route path="/appointment/book" component={BookingWidget} />
              <Route path="/appointment/info" component={infoPage} />
              <Route path="/appointment/reschedule/:id(\d+)" component={Reschedule} />
          </Content>
          <Footer style={{ textAlign: "center" }}>Baylynmedia</Footer>
        </Layout>
        
      </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth, myProfile: state.myProfile });
export default connect(
  mapStateToProps,
  { logout, loadUserProfile }
)(App);
