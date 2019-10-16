import React, { Component } from "react";
import { Fragment } from "react";
import { Menu, Button, Icon } from "antd";
import { Layout } from "antd";
import { Redirect, Link } from "react-router-dom";

const { Sider } = Layout;

class Navbar extends Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.goToHome.bind(this);
  }
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  goToHome = () => {
    return <Redirect to="/" />;
  };
  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <Fragment>
          <Icon
            className="menu-icon trigger"
            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggle}
          />
          <div onClick={this.goToHome} className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="dashboard" />
              <span>Dashboard</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="user" />
              <span>Users</span>
              <Link to="/users" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="user" />
              <span>Calendar</span>
              <Link to="/calendar" />
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="user" />
              <span>Appointments</span>
              <Link to="/appointments" />
            </Menu.Item>
          </Menu>
        </Fragment>
      </Sider>
    );
  }
}

export default Navbar;
