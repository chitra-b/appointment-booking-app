import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getAppointmentDetails } from "../../actions/appointment/getappointmentdetails";
import { updateappointment } from "../../actions/appointment/updateappointment";
import { reset } from "../../actions/common";
import { SearchSelectUsers } from "../common/search-select-users";
import {
    RESET_UPDATE_APPOINTMENT_STATE
} from "../../actions/types";
import {
    Select,
    Button,
    Alert,
    Empty
} from "antd";
const { Option } = Select;

class EditAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.props.reset(RESET_UPDATE_APPOINTMENT_STATE);
        this.state = { leadStatus: this.props.appointmentDetails.appointment.lead_status, assignedUser: this.props.appointmentDetails.appointment.user }
    }
    componentDidUpdate = () =>{
        if(this.props.updateAppointment.isupdated){
            this.props.closeModal('editApptModalVisible');
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        if (this.state.assignedUser && this.state.leadStatus) {
            let data = { "user": this.state.assignedUser, "lead_status": this.state.leadStatus }
            this.props.updateappointment(this.props.appointmentDetails.appointment.id, data);
        }
        
    };
    getSelectedUser = (user) => {
        this.setState({ assignedUser: user });
    }
    handleChange = value => {
        this.setState({ leadStatus: value });
    };
    render() {
        if (!this.props.appointmentDetails.appointment) {
            return <Empty />;
        }
        return (
            <div className="content-section">
                {this.props.updateAppointment.isError ? <Alert
                    message="Error"
                    description={this.props.updateAppointment.isError}
                    type="error"
                    closable
                /> : null}
                <form onSubmit={this.handleSubmit}>
                    <label className="apptedit-form-item" htmlFor="cancellation_reason">
                        <b>Select User</b></label>
                    <div className="apptedit-form-item">
                        <SearchSelectUsers getSelectedUser={this.getSelectedUser} selectedUser={this.state.assignedUser} />
                    </div>
                    <label className="apptedit-form-item" htmlFor="cancellation_reason">
                        <b>Select Lead Status</b></label>
                    <Select value={this.state.leadStatus} onChange={this.handleChange} className="apptedit-form-item">
                        <Option value="Pending">Pending</Option>
                        <Option value="Closed">Closed</Option>
                        <Option value="Not Interested">Not Interested</Option>
                    </Select>
                    {this.props.updateAppointment.isLoading ? <Button type="primary" loading>Loading</Button>
                        : <Button type="primary" className="cancel-form-item" htmlType="submit" >Submit</Button>}
                </form>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    appointmentDetails: state.appointmentDetails,
    updateAppointment: state.updateAppointment,
    auth: state.auth
});
export default connect(mapStateToProps, { getAppointmentDetails, updateappointment, reset })(EditAppointment)