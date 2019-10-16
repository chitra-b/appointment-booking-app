import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { createUser } from "../actions/accounts/usermanagement/createuser";
import { loadUserProfile } from "../actions/accounts/myprofilemanagement/getprofile";
import { updateProfile } from "../actions/accounts/myprofilemanagement/updateprofile";
import {
  fetchUser,
  getUsers
} from "../actions/accounts/usermanagement/fetchuser";
import {
  updateUser
} from "../actions/accounts/usermanagement/updateuser";
import { deleteUsers } from "../actions/accounts/usermanagement/deleteusers";
import { reset } from "../actions/common";
import { loadRoles } from "../actions/common";
import UserPreferenceForm from "./userpreference";
import DjangoCSRFToken from "django-react-csrftoken";
import { DATA_PER_PAGE, responsiveDrawerWidth, isMobile } from "../actions/types";
import {
  PageHeader,
  Skeleton,
  Modal,
  Menu,
  Pagination,
  Dropdown,
  Checkbox,
  Drawer,
  Descriptions,
  Tabs,
  Alert,
  Form,
  Icon,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Select
} from "antd";
const { Option } = Select;
const { TabPane } = Tabs;



class UserDetails extends React.Component {
  componentWillMount() {
    this.props.loadRoles();
  }

  state = {
    confirmDirty: false
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.groups = [values.groups];
      if (!err) {
        if (this.props.updateUserDetails) {
          this.props.updateUser(this.props.userData.id, values);
        } else if (this.props.updateUserProfile) {
          this.props.updateProfile(this.props.userData.id, values);
        } else {
          this.props.createUser(values);
        }
      }
    });
  };

  onChange = e => {
    this.setState(this.props.form.getFieldsValue());
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    let roleItems = this.props.role.roles
      ? this.props.role.roles.map(value => (
          <Option key={value.id} value={value.id}>
            {value.name}
          </Option>
        ))
      : null;
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit} className="userdetails-form">
          <Form.Item label="Username">
            {getFieldDecorator("username", {
              initialValue: this.props.userData
                ? this.props.userData.username
                : null,
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          <Row gutter={16} type="flex">
            <Col xs={24} sm={16} md={12} lg={12}>
              <Form.Item label="First Name">
                {getFieldDecorator("first_name", {
                  initialValue: this.props.userData
                    ? this.props.userData.first_name
                    : null,
                  rules: [
                    {
                      required: true,
                      message: "Please input your firstname!"
                    }
                  ]
                })(<Input onChange={this.onChange} />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={16} md={12} lg={12}>
              <Form.Item label="Last Name">
                {getFieldDecorator("last_name", {
                  initialValue: this.props.userData
                    ? this.props.userData.last_name
                    : ""
                })(<Input onChange={this.onChange} />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="E-mail">
            {getFieldDecorator("email", {
              initialValue: this.props.userData
                ? this.props.userData.email
                : null,
              rules: [
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                },
                {
                  required: true,
                  message: "Please input your E-mail!"
                }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          {this.props.showPassword ? (
            <Fragment>
              <Form.Item label="Password" hasFeedback>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your password!"
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator("confirm", {
                  rules: [
                    {
                      required: true,
                      message: "Please confirm your password!"
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
              </Form.Item>
            </Fragment>
          ) : null}
          <Form.Item label="Mobile Number">
            {getFieldDecorator("user_mobile_number", {
              initialValue: this.props.userData
                ? this.props.userData.user_mobile_number
                : null,
              rules: [
                {
                  required: true,
                  message: "Please input your mobile number!"
                }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          <Form.Item label="Role">
            {getFieldDecorator("groups", {
              initialValue: this.props.userData
                ? this.props.userData.groups.id
                : null,
              rules: [{ required: true, message: "Please select Role!" }]
            })(
              <Select
                placeholder="Select Role"
                onChange={this.onChange}
                loading={this.props.role.isRolesLoading}
              >
                {roleItems}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {this.props.createUserData.isLoading ||
            this.props.updateUserData.isUpdating ? (
              <Button type="primary" loading>
                Loading
              </Button>
            ) : (
              <Fragment>
                <Button
                  style={{ display: "inline" }}
                  type="primary"
                  htmlType="submit"
                >
                  {this.props.updateUserDetails ? "Save" : "Submit"}
                </Button>
                {this.props.createUserData.isError ? (
                  <Alert
                    style={{ display: "inline-block" }}
                    message="Registration Failed"
                    description={this.props.createUserData.isError}
                    type="error"
                    closable
                  />
                ) : null}
                {this.props.updateUserData.isUpdateError ? (
                  <Alert
                    style={{ display: "inline-block" }}
                    message="Update Failed"
                    description={this.props.updateUserData.isUpdateError}
                    type="error"
                    closable
                  />
                ) : null}
              </Fragment>
            )}
          </Form.Item>
          <DjangoCSRFToken />
        </Form>
      </Fragment>
    );
  }
}

export class AddUser extends Component {
  render() {
    return <UserDetailsApp loadUserDetails={false} showPassword={true} />;
  }
}
class UserProfile extends Component {
  render() {
    return (
      <Fragment>
      <PageHeader className="page-header" />
      <div className="content-section">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            <Row type="flex" align="middle">
              <Col xs={24} sm={24} md={18} lg={12}>
                  <UserDetailsApp
                    userData={this.props.myProfile.user}
                    updateUserProfile={true}
                    showPassword={false}
                  />
              </Col>
            </Row>
          </TabPane>
          {this.props.hideUserPref ? null : (
            <TabPane tab="Preferences" key="2">
              <Row type="flex" align="middle">
                <Col xs={24} sm={24} md={18} lg={12}>
                  <UserPreferenceForm />
                </Col>
              </Row>
            </TabPane>
          )}
        </Tabs>
      </div>
      </Fragment>
    );
  }
}

export class UserList extends Component {
  componentWillMount() {
    this.props.getUsers();
  }
  state = {
    visible: false,
    selectedUserList: [],
    currentPage: 1
  };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  editUser = (userid, e) => {
    this.showDrawer();
    this.props.fetchUser(userid);
  };
  pageChange = e => {
    this.props.getUsers(e);
    this.setState({ currentPage: e });
  };
  loadUserList = () => {
    this.onClose();
  };
  onUserselect = userid => {
    let ul = this.state.selectedUserList;
    if (ul.indexOf(userid) < 0) {
      ul.push(userid);
    } else {
      ul.splice(ul.indexOf(userid), 1);
    }
    this.setState({ selectedUserList: ul });
    this.props.getSelectedUsers(this.state.selectedUserList);
  };
  userlist = () => {
    return this.props.getUsersData.userlist
      ? this.props.getUsersData.userlist.map(value => (
          <div key={value.id} onClick={e => this.onUserselect(value.id)}>
            <Descriptions
              className="user-list"
              key={value.id}
              title={
                <Checkbox
                  checked={
                    this.state.selectedUserList.indexOf(value.id) < 0
                      ? false
                      : true
                  }
                >
                  {value.username}
                </Checkbox>
              }
            >
              <Descriptions.Item label="Name">
                {value.first_name + " " + value.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{value.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                {value.groups.name}
              </Descriptions.Item>
              <Descriptions.Item className="align-right">
                <Button
                  type="link"
                  onClick={e => {
                    e.stopPropagation();
                    this.editUser(value.id, e);
                  }}
                  icon="edit"
                >
                  Edit
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ))
      : null;
  };
  render() {
    return (
      <Fragment>
        {this.props.getUsersData.isLoading ? (
          <Spin tip="Loading..." />
        ) : (
          <Fragment>
            {this.userlist()}
            <Pagination
              hideOnSinglePage={true}
              current={this.state.currentPage}
              onChange={this.pageChange}
              defaultPageSize={DATA_PER_PAGE}
              total={this.props.getUsersData.count}
            />
            <Drawer
              width={responsiveDrawerWidth}
              title="Update user"
              onClose={this.onClose}
              visible={this.state.visible}
              destroyOnClose={true}
            >
              {this.props.fetchUserData.isLoading ? (
                <Spin tip="Loading..." />
              ) : (
                <UserDetailsApp
                  userData={this.props.fetchUserData.user}
                  updateUserDetails={true}
                  showPassword={false}
                />
              )}
            </Drawer>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

class Users extends Component {
  state = {
    drawerVisible: false,
    selectedUserList: [],
    errorModalVisible: false
  };
  showDrawer = () => {
    this.setState({
      drawerVisible: true
    });
  };
  onClose = () => {
    this.setState({
      drawerVisible: false
    });
  };

  onDelete = () => {
    this.props.deleteUsers(this.state.selectedUserList);
  };

  getSelectedUsers = userList => {
    this.setState({ selectedUserList: userList });
  };

  showDeleteConfirm = ele => {
    Modal.confirm({
      title: "Are you sure delete user(s)?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        ele.onDelete();
      }
    });
  };

  handleOk = () => {
    Modal.destroyAll();
    this.setState({ errorModalVisible: false });
  };
  render() {
    const mobileActionMenu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={this.showDrawer} type="link">
            <Icon type="plus" />
            Add User
          </Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          <Button
            type="link"
            onClick={e => this.showDeleteConfirm(this)}
            icon="delete"
          >
            Delete
          </Button>
        </Menu.Item>
      </Menu>
    );
    return (
      <Fragment>
        {this.props.deleteUsersData.isDeleting ? (
          <Fragment>
            <Modal
              title="Info"
              okButtonProps={{ hidden: true }}
              cancelButtonProps={{ hidden: true }}
              visible={true}
            >
              Deleting...
            </Modal>
          </Fragment>
        ) : null}
        {this.props.deleteUsersData.isDeleteError ? (
          <Fragment>
            <Alert
              message={this.props.deleteUsersData.isDeleteError}
              closable
              type="error"
            />
          </Fragment>
        ) : null}

        <PageHeader className="align-right page-header">
          {isMobile ? (
            <Fragment>
              <Dropdown overlay={mobileActionMenu}>
                <Button type="primary">
                  Actions <Icon type="down" />
                </Button>
              </Dropdown>
            </Fragment>
          ) : (
            <Fragment>
              <Button onClick={this.showDrawer} type="link">
                <Icon type="plus" /> <b>Add User</b>
              </Button>
              <Button
                onClick={e => this.showDeleteConfirm(this)}
                type="link"
                icon="delete"
              >
                <b>Delete</b>
              </Button>
            </Fragment>
          )}
        </PageHeader>

        <Drawer
          width={responsiveDrawerWidth}
          title="Create a new account"
          onClose={this.onClose}
          visible={this.state.drawerVisible}
          destroyOnClose={true}
        >
          <AddUser />
        </Drawer>
        <UserListApp getSelectedUsers={this.getSelectedUsers} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  createUserData: state.createUser,
  updateUserData: state.updateUser,
  role: state.common,
  auth: state.auth,
  myProfile: state.myProfile
});

const UserDetailsForm = Form.create({ name: "UserDetails" })(UserDetails);
const UserDetailsApp = connect(
  mapStateToProps,
  {
    createUser,
    loadRoles,
    fetchUser,
    getUsers,
    updateUser,
    updateProfile,
    reset
  }
)(UserDetailsForm);

const mapStateToPropsUserList = state => ({
  getUsersData: state.getUsers,
  fetchUserData: state.fetchUser
});
const UserListApp = connect(
  mapStateToPropsUserList,
  { getUsers, fetchUser }
)(UserList);

const mapStateToPropsUserProfile = state => ({
  auth: state.auth,
  myProfile: state.myProfile
});
export const UserProfileApp = connect(
  mapStateToPropsUserProfile,
  { loadUserProfile }
)(UserProfile);

const mapStateToPropsUsers = state => ({
  deleteUsersData: state.deleteUsers
});
export default connect(
  mapStateToPropsUsers,
  { deleteUsers }
)(Users);
