import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Popover,
  Progress,
  Row
} from 'antd';
import './home.scss';

import * as constants from '../../constants';
import * as pageTitles from '../../constants/pages';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopups: false,
      skip: 0,
      take: 10
    };
  }

  componentDidMount() {
    const {
      changePage,
      setTodayDate,
      userId,
      fetchLogs
    } = this.props;
    const { skip, take } = this.state;
    const date = new Date(Date.now());
    const dateFormatted = `${date.getFullYear()}-${(date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;

    changePage(pageTitles.HOME);
    setTodayDate(dateFormatted);

    fetchLogs({
      userId,
      date: dateFormatted,
      skip,
      take
    });
  }

  handleAddClick = () => {
    const { showPopups } = this.state;
    this.setState({
      showPopups: !showPopups
    });
  }

  handleAddEntry = (period) => {
    const { setPeriod } = this.props;
    setPeriod(period);
  }

  render() {
    const {
      showPopups
    } = this.state;

    return (
      <div className="home">
        <div className="home-body">
          <Row gutter={24} className="today-progress">
            <div className="today-title">
              Today&apos;s progress
            </div>
            <Col span={24} className="macro-progress">
              CARBOHYDRATE (CHO)
              <Progress
                type="line"
                strokeColor={{
                  from: '#0FD64F',
                  to: '#F8EF42'
                }}
                percent={100}
                status="active"
              />
            </Col>
            <Col span={24} className="macro-progress">
              PROTEIN (PRO)
              <Progress
                type="line"
                strokeColor={{
                  from: '#F8EF42',
                  to: '#FF748B'
                }}
                percent={100}
                status="active"
              />
            </Col>
            <Col span={24} className="macro-progress">
              FAT (FAT)
              <Progress
                type="line"
                strokeColor={{
                  from: '#FF748B',
                  to: '#F53803'
                }}
                percent={100}
                status="active"
              />
            </Col>
          </Row>


          <div className="space" />

          <Row gutter={24} className="today-progress">
            <div className="today-title">
              Breakfast
            </div>
          </Row>

        </div>
        <div className="absolute-button">
          <div className="popoverzzz">
            <Popover
              content={(
                <div>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.BREAKFAST)}>Breakfast</Link>
                  </h5>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.LUNCH)}>Lunch</Link>
                  </h5>
                  <h5>
                    <Link to="/entry" onClick={() => this.handleAddEntry(constants.DINNER)}>Dinner</Link>
                  </h5>
                  <h5>
                    Exercise
                  </h5>
                </div>
              )}
              placement="topLeft"
              title="Add Log"
              trigger="click"
              visible={showPopups}
              onVisibleChange={this.handleAddClick}
            />
          </div>
          <Button className="add-button" onClick={this.handleAddClick}>
            <img className="add-img" src="/home/addbutton.png" alt="add-entry" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Home;
