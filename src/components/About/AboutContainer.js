import { connect } from 'react-redux';
import About from '.';

import { changePage } from '../Header/duck';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = dispatch => ({
  changePage: (newPage) => {
    dispatch(changePage(newPage));
  }
});

const AboutContainer = connect(mapStateToProps, mapDispatchToProps)(About);
export default AboutContainer;
