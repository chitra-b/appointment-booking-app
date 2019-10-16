import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  DatePicker,
  Form,
  Row,
  Col,
  Button,
  Icon,
  Drawer,
  Switch,
  Checkbox
} from "antd";
import { getUserAppointments } from "../../actions/appointment/getuserappointments";
import { config } from "@fullcalendar/core";
import moment from "moment";
import { DATE_FORMAT, isMobile, YEAR_MONTH_FORMAT } from "../../actions/types";
import { getUserDetails } from "../../actions/accounts/myprofilemanagement/getprofile";
import {store} from "../../index.js"

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export class FilterUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilterDrawerVisible: false
    };
  }
  showDrawer = () => {
    this.setState({ isFilterDrawerVisible: true });
  };

  onClose = () => {
    this.setState({ isFilterDrawerVisible: false });
  };

  render() {
    return (
      <Fragment>
        {isMobile ? (
          <Fragment>
            <Row className="align-right">
              <Col>
                {" "}
                <Button
                  type="primary"
                  onClick={this.showDrawer}
                  style={{ marginBottom: "15px" }}
                >
                  <Icon type="filter" />
                  Show Filters
                </Button>
              </Col>
            </Row>
            <Row className="align-right">
              <Col>
                <Drawer
                  onClose={this.onClose}
                  visible={this.state.isFilterDrawerVisible}
                >
                  {this.props.children}
                </Drawer>
              </Col>
            </Row>
          </Fragment>
        ) : (
          this.props.children
        )}
      </Fragment>
    );
  }
}

class FilterAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: this.props.userDetails,
      start_date: moment(new Date()).format(DATE_FORMAT),
      end_date:
        moment().format(YEAR_MONTH_FORMAT) + "-" + moment().daysInMonth(),
      flag_team_appointments: false
    }

    this.props.getUserAppointments(
      this.state.start_date, 
      this.state.end_date,
      this.state.flag_team_appointments,
      getUserDetails(store.getState))
  }

  handleFilter = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getUserAppointments(
          moment(values.start_date).format(DATE_FORMAT),
          moment(values.end_date).format(DATE_FORMAT),
          values.team_appointments,
          getUserDetails(store.getState),
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const checkboxLayout = {
      labelCol: { span: 20 },
      wrapperCol: { span: 4 }
    };

    return (
      <Fragment>
        <Form
          layout="inline"
          className="filterappoinments-form"
          style={{ marginBottom: "15px" }}
          onSubmit={this.handleFilter}>
          <Row type="flex">
            <Col xs={24} sm={24} md={4} lg={5} className="filter-form-item">
              <Form.Item {...formItemLayout} label="From" htmlFor="start_date">
                {getFieldDecorator("start_date", {
                  rules: [{ required: false, message: "Please select time!" }],
                  initialValue: moment(this.state.start_date, DATE_FORMAT)
                  // initialValue: moment(this.props.start_date, DATE_FORMAT)
                })(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={5} className="filter-form-item">
              <Form.Item {...formItemLayout} label="To" htmlFor="end_date">
                {getFieldDecorator("end_date", {
                  rules: [{ required: false, message: "Please select time!" }],
                  initialValue:  moment(this.state.end_date, DATE_FORMAT)
                  // initialValue: moment(this.props.end_date, DATE_FORMAT)
                })(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={7} className="filter-form-item">
              <Form.Item {...checkboxLayout} label="Show Team's appointments" >
                {getFieldDecorator("team_appointments", {
                  // valuePropName: "unchecked"
                })(
                  <Switch/>
                )}
              </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={4} lg={3} className="filter-form-item">
              <Form.Item {...formItemLayout}>
                <Button type="primary" htmlType="submit">
                  <Icon type="filter" />
                  Apply Filter
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userAppointments: state.userAppointments,
  userDetails: state.myProfile
});
const FilterAppointmentsApp = connect(
  mapStateToProps,
  { getUserAppointments }
)(FilterAppointments);
const FilterAppointmentsForm = Form.create({ name: "AppointmentsFilterForm" })(
  FilterAppointmentsApp
);
export default FilterAppointmentsForm;
