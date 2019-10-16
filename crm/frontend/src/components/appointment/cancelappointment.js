import React, { Fragment } from "react";
import { connect } from "react-redux";
import { updateappointment } from "../../actions/appointment/updateappointment"
import { reset } from "../../actions/common";
import {
    RESET_UPDATE_APPOINTMENT_STATE
} from "../../actions/types";
import {
    Button,
    Input,
    Alert,
    Empty
} from "antd";
const { TextArea } = Input;

class CancelAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.props.reset(RESET_UPDATE_APPOINTMENT_STATE);
        this.state = { appointmentId: null, cancellation_reason: '' }
    }
    componentDidMount = () => {
        this.setState({ appointmentId: this.props.id });
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit = e => {
        e.preventDefault();
        let data = { "cancelled": true, "cancellation_reason": this.state.cancellation_reason }
        this.props.updateappointment(this.state.appointmentId, data);
    };

    render() {
        if (! this.state.appointmentId) {
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
                <form onSubmit={this.handleSubmit} >
                    <label className="cancel-form-item" htmlFor="cancellation_reason">
                        <b>Enter cancellation reason</b></label>
                    <TextArea
                        name="cancellation_reason"
                        autosize={{ minRows: 2, maxRows: 6 }}
                        value={this.state.cancellation_reason}
                        onChange={this.handleChange}
                        className="cancel-form-item"
                    />
                    {this.props.updateAppointment.isLoading ? <Button type="primary" loading>Loading</Button>
                        : <Button type="primary" className="cancel-form-item" htmlType="submit" >Submit</Button>}
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    updateAppointment: state.updateAppointment
});
export default connect(mapStateToProps, { updateappointment, reset })(CancelAppointment)