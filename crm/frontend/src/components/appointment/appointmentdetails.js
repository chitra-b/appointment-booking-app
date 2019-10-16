import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getAppointmentDetails } from "../../actions/appointment/getappointmentdetails";
import CancelAppointment from "./cancelappointment";
import EditAppointment from "./editappointment";
import { DATE_TIME_WORDINGS, TIME_FORMAT_AM_PM } from "../../actions/types";
import {
    Row,
    Col,
    Icon,
    Empty,
    Spin,
    PageHeader,
    Divider,
    Button,
    Descriptions,
    Alert,
    Modal
} from "antd";
import moment from "moment";
moment.tz.setDefault("Asia/Calcutta");

class AppointmentDetails extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.match.params.id) {
            this.props.getAppointmentDetails(this.props.match.params.id);
        }
        this.state = { cancelApptModalVisible: false, editApptModalVisible: false };
    }
    showModal = (modalType) => {
        this.setState({
            [modalType]: true,
        });
    };
    handleCancel = (modalType) => {
        this.setState({
            [modalType]: false,
        });
    };
    render() {
        return (
            <Fragment>
                <PageHeader className="page-header">
                </PageHeader>
                <Row className="content-section" type="flex" justify="start">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        {this.props.appointmentDetails.isError ?
                            <Empty /> :
                            <Fragment>
                                {this.props.appointmentDetails.isLoading ?
                                    <Spin tip="Loading..." /> :
                                    (
                                        this.props.appointmentDetails.appointment ?
                                            <Fragment>
                                                <Divider orientation="left">
                                                    <time className="icon">
                                                        <em>
                                                            {moment(this.props.appointmentDetails.appointment.start_time).format('dddd')}
                                                        </em>
                                                        <strong>
                                                            {moment(this.props.appointmentDetails.appointment.start_time).format('MMMM')}
                                                        </strong>
                                                        <span>{moment(this.props.appointmentDetails.appointment.start_time).date()}</span>
                                                    </time>
                                                </Divider>
                                                <div className="appointment_details">
                                                    <h2>

                                                        {moment(this.props.appointmentDetails.appointment.start_time).format(DATE_TIME_WORDINGS)}
                                                        <span> &#8210; </span>
                                                        {/* check if start and end time is on same day, then don't display the end time date. */}
                                                        {
                                                            moment(this.props.appointmentDetails.appointment.start_time).isSame(moment(this.props.appointmentDetails.appointment.end_time), 'date') ?
                                                                moment(this.props.appointmentDetails.appointment.end_time).format(TIME_FORMAT_AM_PM)
                                                                :
                                                                moment(this.props.appointmentDetails.appointment.end_time).format(DATE_TIME_WORDINGS)
                                                        }
                                                    </h2>
                                                    {/* show cancelled status and reason */}
                                                    <h3>
                                                        {this.props.appointmentDetails.appointment.cancelled ?
                                                            (<div className="appointment-cancelled">
                                                                <Icon type="close-circle" /><span>Cancelled</span>
                                                                &#8194;<span className="notes">{this.props.appointmentDetails.appointment.cancellation_reason}</span>
                                                            </div>)
                                                            : null}
                                                    </h3>
                                                    <div className="appointment-item">
                                                        <Icon type="clock-circle" />
                                                        <span>
                                                            {this.props.appointmentDetails.appointment.slot_duration} min.
                                                        </span>
                                                    </div>
                                                    <div className="appointment-item">
                                                        <Icon type="team" />
                                                        <span>
                                                            Assigned to <Button className="inner-notes" type="link">
                                                                {this.props.appointmentDetails.appointment.user}
                                                            </Button>
                                                        </span>
                                                    </div>
                                                    <div className="appointment-item">
                                                        <Icon type="bars" />
                                                        <span>
                                                            Lead status <Button className="inner-notes" type="link">
                                                                {this.props.appointmentDetails.appointment.lead_status}
                                                            </Button>
                                                        </span>
                                                    </div>
                                                    {this.props.appointmentDetails.appointment.notes ?
                                                        <div className="notes">
                                                            <Alert
                                                                message={this.props.appointmentDetails.appointment.notes}
                                                                type="info"
                                                                showIcon
                                                            />
                                                        </div>
                                                        : null}
                                                </div>
                                                {/* show actions if appointment is not cancelled */}
                                                {!this.props.appointmentDetails.appointment.cancelled ?
                                                    <div className="appointment-actions">
                                                        <Button type="primary" onClick={() => this.showModal('rescheduleApptModalVisible')}>Reschedule</Button>
                                                        <Button type="primary" onClick={() => this.showModal('cancelApptModalVisible')}>Cancel</Button>
                                                        <Button type="primary" onClick={() => this.showModal('editApptModalVisible')}>Edit</Button>
                                                        <Modal
                                                            title="Cancel Appointment"
                                                            visible={this.state.cancelApptModalVisible}
                                                            onCancel={(e) => this.handleCancel('cancelApptModalVisible')}
                                                            footer={null}
                                                        >
                                                            <CancelAppointment id={this.props.match.params.id} />
                                                        </Modal>
                                                        <Modal
                                                            title="Edit Appointment"
                                                            visible={this.state.editApptModalVisible}
                                                            onCancel={(e) => this.handleCancel('editApptModalVisible')}
                                                            footer={null}
                                                        >
                                                            <EditAppointment closeModal={this.handleCancel} id={this.props.match.params.id} />
                                                        </Modal>
                                                    </div>
                                                    : null}
                                                {/* show client details */}
                                                {this.props.appointmentDetails.appointment.client ?
                                                    <div className="client_details">
                                                        <Descriptions column={1} title="Client Details">
                                                            <Descriptions.Item label="Name">{this.props.appointmentDetails.appointment.client.client_name}</Descriptions.Item>
                                                            <Descriptions.Item label="Email">{this.props.appointmentDetails.appointment.client.client_email_id}</Descriptions.Item>
                                                            <Descriptions.Item label="Telephone">{this.props.appointmentDetails.appointment.client.client_contact_mobile_number}</Descriptions.Item>
                                                        </Descriptions>
                                                    </div>
                                                    : null}
                                            </Fragment>
                                            : null
                                    )
                                }
                            </Fragment>
                        }
                    </Col>
                </Row>
            </Fragment>
        );
    }
}
const mapStateToProps = state => ({
    appointmentDetails: state.appointmentDetails,
    updateAppointment: state.updateAppointment,
});
export default connect(mapStateToProps, { getAppointmentDetails })(AppointmentDetails)

