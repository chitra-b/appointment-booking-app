import React, { Fragment } from "react";
import { connect } from "react-redux";
import jstimezonedetect from "jstimezonedetect";
import { Redirect } from "react-router-dom";
import { reset } from "../../actions/common";
import {
  getUserAvailableSlots,
  setSelectedDate,
  setTimeZone,
  setUser,
  setSlotDuration,
  setSelectedTime
} from "../../actions/appointment/getuserslot";
import { bookappointment } from "../../actions/appointment/bookappointment";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  DATE_FORMAT_WORDINGS,
  RESET_BOOKING_STATE
} from "../../actions/types";
import {
  Radio,
  Calendar,
  Icon,
  message,
  Spin,
  Alert,
  Button,
  Input,
  Form,
  Empty
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";

import { isMobile } from "../../actions/types";
import { Row, Col } from "antd";
const { TextArea } = Input;

function getQueryString(field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
}
class BookingWidget extends React.Component {
  constructor(props) {
    super(props);
    let tz = jstimezonedetect.determine();
    this.props.setTimeZone(tz.name());
    //check if reschedule request
    if (this.props.reschedule) {
      this.props.setUser(this.props.apptUser);
      this.props.setSlotDuration(this.props.apptduration);
    } else {
      //book new appointment
      let path = window.location.pathname.split("/");
      let slot_duration = getQueryString("slot_duration");
      slot_duration = slot_duration ? slot_duration : 15;
      path.pop();
      this.props.setUser(path.pop());
      this.props.setSlotDuration(slot_duration);
    }
    this.state = { current: 0 };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    const WrappedContactForm = Form.create({ name: "ContactDetails" })(
      ContactDetailsApp
    );
    return (
      <Fragment>
        <Row type="flex" className="calendar-details-section" justify="center">
          <Col xs={24} sm={24} md={24} lg={18}>
            <h1>{this.props.userSlots.user}</h1>
            <span>
              <Icon
                style={{ fontSize: "14px", marginRight: "5px" }}
                type="clock-circle"
              />
              {this.props.userSlots.slot_duration} min. Booking
            </span>

            <span style={{ float: "right" }}>
              <Icon
                style={{ fontSize: "14px", marginRight: "5px" }}
                type="global"
              />
              {this.props.userSlots.timezone}
            </span>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col className="bookwidget" xs={24} sm={24} md={24} lg={18}>
            <Row className="calendar-book-section booking-form-navigation">
              {/* new appointment - show two steps on desktop screen and three steps in mobile*/}
              {/* reschedule appointment - don't show nav button in desktop screen and show two steps in mobile*/}
              {this.props.reschedule && !isMobile ? null : (
                <Fragment>
                  <Button
                    disabled={
                      (isMobile && current === 1 && this.props.reschedule) ||
                        (!isMobile && current === 1) ||
                        current === 2
                        ? true
                        : false
                    }
                    style={{ float: "right" }}
                    type="primary"
                    onClick={() => this.next()}
                  >
                    Next
                  </Button>
                  <Button
                    disabled={this.state.current ? false : true}
                    style={{ float: "left" }}
                    type="primary"
                    onClick={() => this.prev()}
                  >
                    Prev
                  </Button>
                </Fragment>
              )}
            </Row>
            {/* if reschedule appointment show caledar and timeslot
              if new appointment show caledar, timeslot and contact form
            */}
            <div className="bookview steps-content">
              {isMobile ? (
                <Fragment>
                  {current === 0 && (
                    <CalendarCardViewApp
                      reschedule={this.props.reschedule}
                      apptDate={this.props.apptDate}
                      apptTime={this.props.apptTime}
                    />
                  )}
                  {current === 1 && (
                    <TimeSlotViewApp
                      reschedule={this.props.reschedule}
                      apptTime={this.props.apptTime}
                    />
                  )}
                  {!this.props.reschedule
                    ? current === 2 && <WrappedContactForm />
                    : null}
                </Fragment>
              ) : (
                  <Fragment>
                    {current === 0 && (
                      <Row gutter={24}>
                        <Col xs={24} sm={24} md={16} lg={16}>
                          <CalendarCardViewApp
                            reschedule={this.props.reschedule}
                            apptDate={this.props.apptDate}
                            apptTime={this.props.apptTime}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={7}>
                          <TimeSlotViewApp
                            reschedule={this.props.reschedule}
                            apptTime={this.props.apptTime}
                          />
                        </Col>
                      </Row>
                    )}
                    {!this.props.reschedule
                      ? current === 1 && <WrappedContactForm />
                      : null}
                  </Fragment>
                )}
            </div>
            {/* show this section only for reschedule appointment
            For mobile show reschedule action on second page
            */}
            {this.props.reschedule ? (
              (isMobile && current == 1) || !isMobile ? (
                <Row type="flex" className="reschedule-action" justify="center">
                  <Col xs={24} sm={24} md={10} lg={8}>
                    <Button
                      style={{ width: "90%" }}
                      onClick={this.props.handleReschedule}
                      size="large"
                    >
                      Reschedule
                    </Button>
                  </Col>
                </Row>
              ) : null
            ) : null}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

class TimeSlotView extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.reschedule) {
      if (this.props.apptTime) {
        this.props.setSelectedTime(this.props.apptTime);
      }
    }
  }

  selectedTime = e => {
    this.props.setSelectedTime(e.target.value);
  };
  render() {
    let availableSlots = this.props.userSlots.user_timeslot;
    let slots = [];
    if (availableSlots) {
      for (let index = 0; index < availableSlots.length; index++) {
        const element = availableSlots[index];
        if (this.props.userSlots.selectedDate == element.date) {
          element.spots.forEach(slot => {
            slots.push(slot.start_time);
          });
          break;
        }
      }
    }
    let timeSlotsGroup = <Empty description="No available slots.. Try another day" />;
    if (slots.length > 0) {
      timeSlotsGroup = slots.map((value, idx) => (
        <Radio.Button className="time-slot-radio" key={idx} value={value}>
          {value}
        </Radio.Button>
      ));
    }
    return (
      <Fragment>
        <h3 className="align-center">
          {moment(this.props.userSlots.selectedDate).format(DATE_FORMAT_WORDINGS) +
            " " +
            (this.props.userSlots.selectedTime
              ? this.props.userSlots.selectedTime
              : "")}
        </h3>
        <Radio.Group
          onChange={this.selectedTime}
          className="time-slot-radiogroup"
          value={this.props.userSlots.selectedTime}
          buttonStyle="solid"
        >
          {timeSlotsGroup}
        </Radio.Group>
      </Fragment>
    );
  }
}
class CalendarCardView extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.userSlots.selectedDate) {
      //get slots of selectedDate
      this.props.getUserAvailableSlots(
        this.props.userSlots.user,
        this.props.userSlots.slot_duration,
        this.props.userSlots.timezone,
        moment(this.props.userSlots.selectedDate).format("YYYY-MM")
      );
      //undo prev. selected timeslot whenever new slots are rendered for selected date
      this.props.setSelectedTime(null);
    } else {
      //check if request is resecdule appt
      if (this.props.reschedule) {
        this.props.setSelectedDate(this.props.apptDate);
        this.props.getUserAvailableSlots(
          this.props.userSlots.user,
          this.props.userSlots.slot_duration,
          this.props.userSlots.timezone
        );
        //set appt time as selected time
        this.props.setSelectedTime(this.props.apptTime);
      } else {
        //set today as selectedDate by default and get available slots if not already set
        this.props.setSelectedDate(moment().format(DATE_FORMAT));
        this.props.getUserAvailableSlots(
          this.props.userSlots.user,
          this.props.userSlots.slot_duration,
          this.props.userSlots.timezone
        );
        //undo prev. selected timeslot whenever new slots are rendered for selected date
        this.props.setSelectedTime(null);
      }
    }
  }

  disabledDate = current => {
    let availableSlots = this.props.userSlots.user_timeslot;
    if (!current) {
      // allow empty select
      return false;
    }
    const date = moment();
    date.hour(0);
    date.minute(0);
    date.second(0);
    let today = date.format(DATE_FORMAT);
    let currentDate = current.format(DATE_FORMAT);
    if (currentDate < today) {
      // can not select days before today
      return true;
    }
    if (availableSlots) {
      let isAvailable = false;
      for (let index = 0; index < availableSlots.length; index++) {
        const element = availableSlots[index];
        if (currentDate == element.date) {
          isAvailable = true;
          break;
        }
      }
      if (isAvailable) {
        return false;
      }
    }
    return true;
  };

  onPanelChange = (value, mode) => {
    this.props.getUserAvailableSlots(
      this.props.userSlots.user,
      this.props.userSlots.slot_duration,
      this.props.userSlots.timezone,
      value.year() + "-" + (parseInt(value.month()) + 1)
    );
    this.props.setSelectedDate(value.format(DATE_FORMAT));
  };

  onSelect = value => {
    this.props.setSelectedDate(value.format(DATE_FORMAT));
    //undo prev. selected timeslot whenever new slots are rendered for selected date
    this.props.setSelectedTime(null);
  };

  render() {
    return (
      <Fragment>
        {this.props.userSlots.isLoading ? (
          <Spin tip="Loading..." />
        ) : (
            <Calendar
              defaultValue={moment(this.props.userSlots.selectedDate)}
              disabledDate={this.disabledDate}
              fullscreen={false}
              onPanelChange={this.onPanelChange}
              onSelect={this.onSelect}
            />
          )}
      </Fragment>
    );
  }
}

class ContactDetails extends React.Component {
  componentWillMount() {
    this.props.reset(RESET_BOOKING_STATE);
  }
  handleSubmit = e => {
    e.preventDefault();

    if (
      !(this.props.userSlots.selectedDate && this.props.userSlots.selectedTime)
    ) {
      message.error("Please select date and time");
      return false;
    }

    this.props.form.validateFields((err, values) => {
      let appointmentData = {};
      let slotInfo = this.props.userSlots;
      if (!err) {
        appointmentData.start_time = moment(
          slotInfo.selectedDate +
          " " +
          moment(slotInfo.selectedTime, ["h:mm A"]).format("HH:mm")
        ).format(DATE_TIME_FORMAT);
        appointmentData.end_time = moment(appointmentData.start_time).add(
          slotInfo.slot_duration,
          "minutes"
        );
        appointmentData.end_time = appointmentData.end_time.format(
          DATE_TIME_FORMAT
        );
        appointmentData.service = 1;
        appointmentData.user = slotInfo.user;
        appointmentData.timezone_field = slotInfo.timezone;
        appointmentData.notes = values.notes;
        delete values.notes;
        appointmentData.client = values;
        this.props.bookappointment(appointmentData);
      }
    });
  };

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
            {getFieldDecorator("client_contact_mobile_number", {
              rules: [
                { required: true, message: "Please input your Phone Numer!" }
              ]
            })(<Input />)}
          </Form.Item>
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

const mapStateToProps = state => ({
  auth: state.auth,
  userSlots: state.getUserSlots,
  appointmentDetails: state.appointmentDetails
});

export default connect(
  mapStateToProps,
  {
    getUserAvailableSlots,
    setSelectedDate,
    setUser,
    setTimeZone,
    setSlotDuration
  }
)(BookingWidget);

const CalendarCardViewApp = connect(
  mapStateToProps,
  {
    getUserAvailableSlots,
    setSelectedDate,
    setUser,
    setTimeZone,
    setSlotDuration,
    setSelectedTime
  }
)(CalendarCardView);

const TimeSlotViewApp = connect(
  mapStateToProps,
  {
    getUserAvailableSlots,
    setSelectedDate,
    setUser,
    setTimeZone,
    setSlotDuration,
    setSelectedTime
  }
)(TimeSlotView);

const mapStateBookToProps = state => ({
  bookAppointmentData: state.bookAppointment,
  userSlots: state.getUserSlots
});
const ContactDetailsApp = connect(
  mapStateBookToProps,
  { bookappointment, reset }
)(ContactDetails);
