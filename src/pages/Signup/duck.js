import { handle } from 'redux-pack';
import { message } from 'antd';
import * as auth from '../../api/user';
import * as signupConst from '../../utils/signup.util';

const actions = {
  CHECK_EXISTING: 'SIGNUP/CHECK_EXISTING',
  CONFIRM: 'SIGNUP/CONFIRM',
  GETDBW: 'SIGNUP/GETDBW',
  SIGNUP: 'SIGNUP/SIGNUP',
  SUCCESS: 'SIGNUP/SUCCESS',
  TOGGLE_MODAL: 'SIGNUP/TOGGLE_MODAL',
  SIGNUP_LOGIN: 'SIGNUP/SIGNUP_LOGIN'
};

export const getDBW = ({ sex, heightCm }) => ({
  type: actions.GETDBW,
  promise: signupConst.getDBW({ sex, heightCm })
});

export const checkExistingUser = ({ userName, sex, heightCm }) => (dispatch) => {
  dispatch({
    type: actions.CHECK_EXISTING,
    promise: auth.findUser({ userName }),
    meta: {
      onSuccess: () => {
        message.error('Username exists.', 4);
      },
      onFailure: (response) => {
        if (response.response.data.status === 404) {
          dispatch(getDBW({ sex, heightCm }));
        } else {
          message.error('Server error.', 4);
        }
      }
    }
  });
};

export const signupToLogin = () => ({
  type: actions.SIGNUP_LOGIN
});

export const toggleModal = () => ({
  type: actions.TOGGLE_MODAL
});

export const signup = goalTEA => ({
  type: actions.SIGNUP,
  promise: signupConst.getNutriDist(goalTEA)
});

export const confirmSignup = body => ({
  type: actions.CONFIRM,
  promise: auth.signup(body),
  meta: {
    onSuccess: () => {
      message.success('Successful sign up.', 4);
    },
    onFailure: response => (
      response.response.data.status === 409
        ? message.error('Username exists.', 4)
        : message.error('Server error.', 4)
    )
  }
});

const initialState = {
  existingUser: false,
  isCheckingExisting: false,

  dbwKg: null,
  dbwLbs: null,
  choPerDay: null,
  proPerDay: null,
  fatPerDay: null,

  isConfirming: false,
  isSigningUp: false,
  showConfirmModal: false,
  successSigningUp: false
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.CHECK_EXISTING:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isCheckingExisting: true
        }),
        success: prevState => ({
          ...prevState,
          existingUser: payload.data.status === 200
        }),
        finish: prevState => ({
          ...prevState,
          isCheckingExisting: false
        })
      });

    case actions.GETDBW:
      return handle(state, action, {
        success: prevState => ({
          ...prevState,
          dbwKg: payload.dbwKg,
          dbwLbs: payload.dbwLbs
        })
      });

    case actions.SIGNUP:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isSigningUp: true
        }),
        success: prevState => ({
          ...prevState,
          choPerDay: payload.choPerDay,
          proPerDay: payload.proPerDay,
          fatPerDay: payload.fatPerDay,
          showConfirmModal: true
        }),
        finish: prevState => ({
          ...prevState,
          isSigningUp: false
        })
      });

    case actions.CONFIRM:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          isConfirming: true
        }),
        success: prevState => ({
          ...prevState,
          showConfirmModal: !state.showConfirmModal,
          successSigningUp: true
        }),
        finish: prevState => ({
          ...prevState,
          isConfirming: false
        })
      });

    case actions.TOGGLE_MODAL:
      return {
        ...state,
        showConfirmModal: !state.showConfirmModal
      };

    case actions.SIGNUP_LOGIN:
      return {
        ...state,
        existingUser: false,
        isCheckingExisting: false,
        dbwKg: null,
        dbwLbs: null,
        choPerDay: null,
        proPerDay: null,
        fatPerDay: null,
        isConfirming: false,
        isSigningUp: false,
        showConfirmModal: false,
        successSigningUp: false
      };

    default:
      return state;
  }
};

export default reducer;
