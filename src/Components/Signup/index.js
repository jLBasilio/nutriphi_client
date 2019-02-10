import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Input,
  Form,
  Select,
  Icon,
  DatePicker,
  Timeline
} from 'antd';

import './signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      sex: '',
      birthday: '',
      weightKg: '',
      weightLbs: '',
      goalKg: '',
      goalLbs: '',
      cmHeight: '',
      heightFt: '',
      heightInch: '',
      target: '',
      lifestyle: '',
      dbw: '',
      endDate: '',

      formno: 1
    };
  }

  render() {
    const { formno } = this.state;
    return (
      <div className="signup">
        <div className="header" />
        <div className="signup-body">
          <Row gutter={24}>
            <Col span={8} />
            <Col xs={24} md={8} className="middle-col">

              <div className="logo-container">
                {
                formno === 1
                  ? <h2>SIGNUP FOR NUTRIPHI</h2>
                  : undefined
                }
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Signup;
