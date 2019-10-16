import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { reset } from "../actions/common";
import { loadTimezones } from "../actions/common";
import { getUserPreference } from "../actions/accounts/userpreference/loadpreference";
import { updateUserPreference } from "../actions/accounts/userpreference/updatepreference";
import DjangoCSRFToken from "django-react-csrftoken";

import {
  TimePicker,
  Checkbox,
  Tabs,
  Divider,
  Radio,
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
import moment from "moment";

const { Option } = Select;

class UserPreferenceClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentWillMount() {
    await this.props.getUserPreference(this.props.myProfile.user.id);
    await this.props.loadTimezones();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.available_from = values.available_from.format('HH:mm');
      values.available_till = values.available_till.format('HH:mm');
      if (!err) {
        this.props.updateUserPreference(this.props.myProfile.user.id,values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let timeZoneOptions = this.props.common.timeZone
      ? this.props.common.timeZone.map(value => (
          <Option key={value} value={value}>
            {value}
          </Option>
        ))
      : null;
    return (
      <Fragment>
        {/* user preference load error */}
        {this.props.loadUserPref.isError ? (
          <Alert closable message="Unable to load preference" type="warning" />
        ) : null}
        {/* user preference update error */}
        {this.props.updateUserPref.isError ? (
          <Alert
            message="Update Failed"
            description={this.props.updateUserPref.isError}
            type="error"
            closable
          />
        ) : null}
        {this.props.loadUserPref.isLoading ? (
          <Spin tip="Loading..." />
        ) : (
          <Form autoComplete="off" onSubmit={this.handleSubmit}>
            <Divider orientation="left">Schedule</Divider>
            <Form.Item label="Time Zone">
              {getFieldDecorator("timezone_field", {
                initialValue: this.props.loadUserPref.user_preference
                  ? this.props.loadUserPref.user_preference.timezone_field
                  : null,
                rules: [
                  {
                    required: true,
                    message: "Please enter preferred timezone!"
                  }
                ]
              })(
                <Select
                  placeholder="select preferred timezone"
                  showSearch={true}
                  loading={this.props.common.isTimeZoneLoading}
                >
                  {timeZoneOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Available days">
              {getFieldDecorator("available_days", {
                initialValue: this.props.loadUserPref.user_preference
                  ? this.props.loadUserPref.user_preference.available_days
                  : [],
                rules: [
                  { required: true, message: "Please select available days!" }
                ]
              })(
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row>
                    <Col span={8}>
                      <Checkbox value="0">MON</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="1">TUE</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="2">WED</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="3">THU</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="4">FRI</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="5">SAT</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="6">SUN</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              )}
            </Form.Item>
            <Form.Item label="Available From">
              {getFieldDecorator("available_from", {
                initialValue: this.props.loadUserPref.user_preference
                  ? moment(
                      this.props.loadUserPref.user_preference.available_from,
                      "h:mm"
                    )
                  : null,
                rules: [
                  { required: true, message: "Please select available from!" }
                ]
              })(<TimePicker use12Hours minuteStep={15} format="h:mm A" />)}
            </Form.Item>
            <Form.Item label="Available To">
              {getFieldDecorator("available_till", {
                initialValue: this.props.loadUserPref.user_preference
                  ? moment(
                      this.props.loadUserPref.user_preference.available_till,
                      "h:mm"
                    )
                  : null,
                rules: [
                  { required: true, message: "Please select available till!" }
                ]
              })(<TimePicker use12Hours minuteStep={15} format="h:mm A" />)}
            </Form.Item>
            <Divider orientation="left">Notification</Divider>
            <Form.Item>
              <Checkbox
                name="is_mail_preferred"
                defaultChecked={
                  this.props.loadUserPref.user_preference
                    ? this.props.loadUserPref.user_preference.is_mail_preferred
                    : false
                }
              >
                E-Mail
              </Checkbox>
              <Checkbox
                name="is_sms_preferred"
                defaultChecked={
                  this.props.loadUserPref.user_preference
                    ? this.props.loadUserPref.user_preference.is_sms_preferred
                    : false
                }
              >
                SMS
              </Checkbox>
            </Form.Item>

            <Form.Item>
              {this.props.updateUserPrefisLoading ? (
                <Button type="primary" loading>
                  Loading
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              )}
            </Form.Item>
          </Form>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  myProfile: state.myProfile,
  common: state.common,
  loadUserPref: state.loadUserPref,
  updateUserPref: state.updateUserPref
});

const UserPreferenceForm = Form.create({ name: "UserPreference" })(
  UserPreferenceClass
);

export default connect(
  mapStateToProps,
  { reset, loadTimezones, getUserPreference, updateUserPreference }
)(UserPreferenceForm);
