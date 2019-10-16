import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getUserAppointments } from "../../actions/appointment/getuserappointments";
import {
  DATA_PER_PAGE,
  DATE_TIME_FORMAT_AM_PM,
} from "../../actions/types";
import FilterAppointmentsForm from "./filterappointments";
import { FilterUI } from "./filterappointments";
import {
  Descriptions,
  Checkbox,
  PageHeader,
  Pagination,
  Button,
  Icon,
  Empty
} from "antd";
import moment from "moment";
import { getUserDetails } from "../../actions/accounts/myprofilemanagement/getprofile";
import {store} from "../../index.js"
moment.tz.setDefault("Asia/Calcutta");


class UserAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentPage: 1,
    };
  }

  appointmentlist = () => {
    return this.props.userAppointments.appointments &&
      this.props.userAppointments.appointments.length > 0 ? (
      this.props.userAppointments.appointments.map(value => (
        <div key={value.id}>
          <Descriptions className="appointment-list " key={value.id}>
            <Descriptions.Item label="Client Name">
              {value.client.client_name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
            <Icon type="mail" theme="filled" style={{marginRight: '5px'}}/>
              {value.client.client_email_id}  
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
            <Icon type="phone" theme="filled" style={{transform: 'rotate(90deg)', marginRight: '5px'}}/>
              {value.client.client_contact_mobile_number}
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {moment(value.start_time).format(DATE_TIME_FORMAT_AM_PM)}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {moment(value.end_time).format(DATE_TIME_FORMAT_AM_PM)}
            </Descriptions.Item>
            <Descriptions.Item label="Lead Status">
              {value.lead_status}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{value.notes}</Descriptions.Item>
          </Descriptions>
        </div>
      ))
    ) : (
      <Empty />
    );
  };
  render() {
    return (
      <Fragment>
        <PageHeader className="align-right page-header"></PageHeader>
        <FilterUI>
          <FilterAppointmentsForm />
        </FilterUI>
        {this.appointmentlist()}
        <Pagination
          hideOnSinglePage={true}
          defaultCurrent={this.state.currentPage}
          onChange={this.pageChange}
          defaultPageSize={DATA_PER_PAGE}
          total={10}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  userAppointments: state.userAppointments,
});
export default connect(
  mapStateToProps,
  { getUserAppointments}
)(UserAppointments);
