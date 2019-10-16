import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Result, Row, Col } from "antd";

function infoPage() {
  return (
    <Row type="flex" className="calendar-details-section" justify="center">
        <Col xs={24} sm={24} md={24} lg={18}>
    <Result
      status="success"
      title="Successfully Booked Appointment"
      subTitle=""
    />
    </Col>
    </Row>
  );
}
export default infoPage;
