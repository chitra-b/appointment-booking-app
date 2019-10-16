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
import infoPage from './appointment/appointmentinfo';
import { UserProfileApp } from "./user";
import Users from "./user";
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
  Button
} from "antd";
const { Header, Footer, Content } = Layout;


class BaseLayout extends Component {
  constructor(props){
    super(props);
    if(this.props.auth.isAuthenticated){
      this.props.loadUserProfile();
    }
  }
  render() {
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
      <Layout style={{ minHeight: "100vh" }}>
        {this.props.myProfile.user ? <Navbar /> :  null}
        
        <Layout>
          <Header style={{ backgroundColor: "#fff" }}>
            <Row type="flex">
              <Col span={24}>
                <div className="align-right">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <a
                      style={{ fontWeight: "bold" }}
                      className="ant-dropdown-link"
                      href="#"
                    >
                      <Icon type="user" /> Hello,{" "}
                      {this.props.myProfile.user ? this.props.myProfile.user.username : ''} <Icon type="down" />
                    </a>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Header>
          <Content className="container">
            <BrowserRouter>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/profile" component={UserProfileApp} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/calendar" component={CalendarApp} />
              <PrivateRoute path="/appointment/:id " component={UserAppointments} />
              <PrivateRoute path="/appointments" component={UserAppointments} />
            </BrowserRouter>
          </Content>
          <Footer style={{ textAlign: "center" }}>Baylynmedia</Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth, myProfile: state.myProfile });
export default connect(
  mapStateToProps,
  { logout, loadUserProfile }
)(BaseLayout);


export class CommonLayout extends Component {
  render() {
    return(
    <Layout style={{ height: "100vh" }}>
      <Header />
      {/* <Content style={{ background: "#fff", overflow: "auto" }}> */}
      <Content>
      <BrowserRouter>
      <Route path="/appointment/book" component={BookingWidget} />
            <Route path="/appointment/info" component={infoPage} />
            </BrowserRouter>
        </Content>
    </Layout>
    );
  }
}