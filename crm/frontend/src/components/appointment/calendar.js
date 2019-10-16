import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { getUserAppointments } from "../../actions/appointment/getuserappointments";
import { reset } from "../../actions/common";
import { responsiveDrawerWidth, isMobile, RESET_BOOKING_STATE, DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT_AM_PM, DATE_TIME_FORMAT_AM_PM } from "../../actions/types";
import { getUserPreference } from "../../actions/accounts/userpreference/loadpreference";

import { bookappointment } from "../../actions/appointment/bookappointment";
//import moment from "moment";
import moment from 'moment-timezone';
// must manually import the stylesheets for each plugin
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import 'react-widgets/dist/css/react-widgets.css';
import { getUserDetails } from "../../actions/accounts/myprofilemanagement/getprofile";
import {store} from "../../index.js"


import {
  Row,
  Col,
  Button,
  Spin,
  Drawer,
  Form,
  Alert,
  Input,
  DatePicker
} from "antd";
const { TextArea } = Input;
const { RangePicker } = DatePicker;


moment.tz.setDefault("America/Los_Angeles");

class UserCalendar extends React.Component {
  calendarComponentRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      popover_style: { visibility: 'hidden' },
      popover_visible: false,
      appointment_drawer_visible: false,
      hideClinetFields_Appointment: false
    };

    this.props.getUserAppointments(
      '',
      '',
      false,
      getUserDetails(store.getState));
  }

  showDrawer = () => {
    this.setState({ popover_style: { display: 'none' } })
    this.setState({ popover_visible: false });
    this.setState({
      appointment_drawer_visible: true
    });
  };

  closeDrawer = () => {
    this.setState({
      appointment_drawer_visible: false
    });
  };
  fetchAppointments = () => {
    let appointments = this.props.userAppointments.appointments;
    let calendarEvents = []
    if (appointments) {
      for (let index = 0; index < appointments.length; index++) {
        calendarEvents.push({ title: appointments[index].client.client_name, start: appointments[index].start_time, end: appointments[index].end_time })

      }
    }
    return calendarEvents;
  }
  render() {
    const WrappedBookingFormForStaffApp = Form.create({ name: "BookingForm" })(
      BookingFormForStaffApp
    );
    return (
      <Fragment>
        
        {this.props.userAppointments.isLoading ? <Spin />: null}
        <Drawer
          width={responsiveDrawerWidth}
          title="Appointment"
          onClose={this.closeDrawer}
          visible={this.state.appointment_drawer_visible}
          destroyOnClose={true}
        >
          <WrappedBookingFormForStaffApp hideClinetFields={this.state.hideClinetFields_Appointment} />
        </Drawer>

        <div id="popover" className="custom-popover" style={this.state.popover_style}>
          <ul>
            {/* <li>
              <Button type="link">
                New Appointment
        </Button>
            </li> */}
            <li>
              <Button type="link" onClick={(e) => {this.setState({ hideClinetFields_Appointment: true }); this.showDrawer() }}>
                Mark Busy
        </Button>
            </li>
          </ul>
        </div>
        <Row justify="center">
          <Col xs={24} sm={24} md={24} lg={24} >
            
            <FullCalendar
              timeZone='EST'
              defaultView={isMobile ? "listWeek" : "dayGridMonth"}
              header={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
              }}
              showNonCurrentDates={false}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              ref={this.calendarComponentRef}
              weekends={this.state.calendarWeekends}
              events={this.fetchAppointments()}
              eventLimit={4}
              fixedWeekCount={false}
              datesRender={this.change}
              dateClick={this.handleDateClick}
              viewSkeletonRender={this.dayRender}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }

  toggleWeekends = () => {
    this.setState({
      // update a property
      calendarWeekends: !this.state.calendarWeekends
    });
  };

  change = (info) => {
    this.setState({isLoading: true});
    this.props.getUserAppointments(
      moment(info.view.view.activeStart).format(DATE_FORMAT),
      moment(info.view.view.activeEnd).format(DATE_FORMAT),
      false,
      getUserDetails(store.getState)
    )
    this.setState({isLoading: false});
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  };

  handleDateClick = arg => {
    if (this.state.popover_visible) {
      this.setState({ popover_style: { display: 'none' } })
      this.setState({ popover_visible: false });
    }
    else {
      this.setState({ popover_style: { display: 'block', top: (arg.jsEvent.pageY).toString() + 'px', left: (arg.jsEvent.pageX).toString() + 'px' } });
      this.setState({ popover_visible: true });
    }
  };
}

class BookingFormForStaff extends React.Component {
  constructor(props) {
    super(props);
    this.props.getUserPreference(this.props.myProfile.user.id);
    this.props.reset(RESET_BOOKING_STATE);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.bookappointment({});
      }
    });
  };

  onDateRangeSelect = e => {

  }
  render() {
    if (this.props.bookAppointmentData.isBooked) {
      return <Redirect to="/appointment/info/" />;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        {this.props.bookAppointmentData.isError ? (
          <Alert
            message="Appointment failed"
            description={this.props.bookAppointmentData.isError}
            type="error"
            closable
          />
        ) : null}
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Select Time">
            {getFieldDecorator("date_range", {
              rules: [
                {
                  required: true,
                  message: "Please select time!"
                }
              ]
            })(
              <RangePicker
                className="date-range"
                showTime={{
                  use12Hours: true,
                  format: TIME_FORMAT_AM_PM,
                  minuteStep: 15
                }}
                format={DATE_TIME_FORMAT_AM_PM}
                placeholder={['Start Time', 'End Time']}
                onChange={this.onDateRangeSelect}
                onOk={this.onDateRangeSelect}
              />
            )}
          </Form.Item>
          {this.props.hideClinetFields ? null : (
            <Fragment>
              <Form.Item label="E-mail">
                {getFieldDecorator("client_email_id", {
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
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Name">
                {getFieldDecorator("client_name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input Name!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Phone Numer">
                {getFieldDecorator("client_contact_mobile_number")(<Input />)}
              </Form.Item>
            </Fragment>
          )}
          <Form.Item label="Phone Notes">
            {getFieldDecorator("notes")(
              <TextArea
                placeholder="Additional information"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Form.Item>

          <Form.Item>
            {this.props.bookAppointmentData.isLoading ? (
              <Button type="primary" loading>
                Loading
              </Button>
            ) : (
                <Button type="primary" htmlType="submit">
                  Submit
              </Button>
              )}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const mapStateBookToProps = state => ({
  bookAppointmentData: state.bookAppointment,
  myProfile: state.myProfile,
  userSlots: state.getUserSlots,
  userPref: state.loadUserPref
});
const BookingFormForStaffApp = connect(
  mapStateBookToProps,
  { bookappointment, reset, getUserPreference }
)(BookingFormForStaff);

const mapStateToProps = state => ({
  userAppointments: state.userAppointments
});
export default connect(mapStateToProps, { getUserAppointments })(UserCalendar)