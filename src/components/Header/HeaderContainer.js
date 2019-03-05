import { connect } from 'react-redux';
import Header from '.';

import { toggleDrawer } from './duck';

const mapStateToProps = (state) => {
  const { showDrawer } = state.header;
  const { user } = state.login;
  return {
    showDrawer,
    user
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    toggleDrawer: () => {
      dispatch(toggleDrawer());
    }
  };
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
