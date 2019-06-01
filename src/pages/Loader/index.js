import React from 'react';
import { Spin } from 'antd';
import './loader.scss';

const Loader = () => (
  <div className="loader">
    <Spin />
  </div>
);

export default Loader;
