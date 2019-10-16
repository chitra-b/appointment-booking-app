import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Layout, Row, Col, Card, Icon, Button, Input } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const { Meta } = Card;

class MeetingLink extends Component {
  constructor(props) {
    super(props);
    this.state = { customMin: "" };
  }

  onMinChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      value === "" ||
      value === "-"
    ) {
      this.setState({ customMin: value });
    } else {
      this.setState({ customMin: "" });
    }
  };

  generateLink = (min, e) => {
    message.success("Link copied successfully");
  };
  render() {
    return (
      <section>
        <Row gutter={16} type="flex" justify="center">
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card
              actions={[
                <Button onClick={e => this.generateLink(15, e)} type="primary">
                  Copy Link
                </Button>
              ]}
            >
              <Meta
                className="min-meta"
                avatar={<Icon type="calendar" />}
                title="15 Minute Meeting"
                description="Grab your 15 min. meeting link"
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card
              actions={[
                <Button onClick={e => this.generateLink(30, e)} type="primary">
                  Copy Link
                </Button>
              ]}
            >
              <Meta
                className="min-meta"
                avatar={<Icon type="calendar" />}
                title="30 Minute Meeting"
                description="Grab your 30 min. meeting link"
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card
              actions={[
                <Button onClick={e => this.generateLink(60, e)} type="primary">
                  Copy Link
                </Button>
              ]}
            >
              <Meta
                className="min-meta"
                avatar={<Icon type="calendar" />}
                title="60 Minute Meeting"
                description="Grab your 60 min. meeting link"
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card
              actions={[
                <Button
                  onClick={e => this.generateLink(this.state.customMin, e)}
                  type="primary"
                >
                  Copy Link
                </Button>
              ]}
            >
              <Meta
                className="min-meta"
                avatar={<Icon type="calendar" />}
                title={
                  <div>
                    <Input
                      onChange={this.onMinChange}
                      addonBefore="Custom"
                      value={this.state.customMin}
                      placeholder="Min."
                    />
                  </div>
                }
                description="Grab your custom min. meeting link"
              />
            </Card>
          </Col>
        </Row>
      </section>
    );
  }
}

class Dashboard extends Component {
  render() {
    return <MeetingLink />;
  }
}

const mapStateToProps = state => ({ auth: state.auth, myProfile: state.myProfile});
export default connect(mapStateToProps)(Dashboard);
