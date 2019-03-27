import React, { Component } from 'react';
import {
  Button,
  Popover
} from 'antd';
import './food.scss';

import * as pageTitles from '../../constants/pages';
import Loader from '../Loader';

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      take: 10
    };
  }

  componentDidMount() {
    const { currentPage, getFoodAll, getFoodClass } = this.props;
    const { skip, take } = this.state;

    if (currentPage === pageTitles.ALL) getFoodAll({ skip, take });
    else if (currentPage === pageTitles.VEGETABLE) getFoodClass({ skip, take, foodClass: 'vegetable' });
    // else if (currentPage === pageTitles.FRUIT) this.setState({ foodClassToFetch: 'fruit' });
    // else if (currentPage === pageTitles.MILK) this.setState({ foodClassToFetch: 'milk' });
    // else if (currentPage === pageTitles.RICE) this.setState({ foodClassToFetch: 'rice' });
    // else if (currentPage === pageTitles.MEAT) this.setState({ foodClassToFetch: 'meat' });
    // else if (currentPage === pageTitles.FATS) this.setState({ foodClassToFetch: 'fat' });
    // else if (currentPage === pageTitles.SUGAR) this.setState({ foodClassToFetch: 'sugar' });
    // else if (currentPage === pageTitles.FREE) this.setState({ foodClassToFetch: 'free' });
    // else if (currentPage === pageTitles.BEVERAGE) this.setState({ foodClassToFetch: 'beverage' });


  }

  render() {
    const { currentPage, food, isFetching } = this.props;
    return (

      <div className="food">
        {
          isFetching ? (
            <Loader />
          ) : (
            <div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {currentPage}
            </div>
          )
        }
      </div>
    );
  }
}

export default Food;
