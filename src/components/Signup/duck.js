import { handle } from 'redux-pack';
import { message } from 'antd';
import * as auth from '../../api/user';

const actions = {
  CHECK_EXISTING: 'SIGNUP/CHECK_EXISTING',
  CONFIRM: 'SIGNUP/CONFIRM',
  GETDBW: 'SIGNUP/GETDBW',
  SIGNUP: 'SIGNUP/SIGNUP',
  SUCCESS: 'SIGNUP/SUCCESS',
  TOGGLE_MODAL: 'SIGNUP/TOGGLE_MODAL'
};

export const getDBW = ({ sex, heightCm }) => ({
  type: actions.GETDBW,
  promise: auth.getDBW({ sex, heightCm })
});

export const checkExistingUser = ({ userName, sex, heightCm }) => (dispatch) => {
  dispatch({
    type: actions.CHECK_EXISTING,
    promise: auth.findUser({ userName }),
    meta: {
      onSuccess: () => {
        message.error('Username exists.');
      },
      onFailure: (response) => {
        if (response.response.data.status === 404) {
          dispatch(getDBW({ sex, heightCm }));
        }
      }
    }
  });
};

export const toggleModal = () => ({
  type: actions.TOGGLE_MODAL
});

export const signup = userInfo => ({
  type: actions.SIGNUP,
  promise: auth.getNutridist(userInfo)
});

export const confirmSignup = body => ({
  type: actions.CONFIRM,
  promise: auth.signup(body),
  meta: {
    onSuccess: () => {
      message.success('Successful sign up.');
    },
    onFailure: response => (
      response.response.data.status === 409
        ? message.error('Username exists.')
        : message.error('Server error.')
    )
  }
});


const initialState = {
  dbwKg: null,
  dbwLbs: null,
  isConfirming: false,
  isSigningUp: false,
  toggleModal: false,
  choPerDay: null,
  proPerDay: null,
  fatPerDay: null,
  existingUser: false,
  isCheckingExisting: false
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
        start: prevState => ({
          ...prevState
        }),
        success: prevState => ({
          ...prevState,
          dbwKg: payload.data.data.dbwKg,
          dbwLbs: payload.data.data.dbwLbs
        }),
        finish: prevState => ({
          ...prevState
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
          choPerDay: payload.data.data.choPerDay,
          proPerDay: payload.data.data.proPerDay,
          fatPerDay: payload.data.data.fatPerDay
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
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isConfirming: false
        })
      });

    case actions.TOGGLE_MODAL:
      return handle(state, action, {
        start: prevState => ({
          ...prevState,
          toggleModal: true
        }),
        success: prevState => ({
          ...prevState
        }),
        finish: prevState => ({
          ...prevState,
          isSigningUp: false
        })
      });


    default:
      return state;
  }
};

export default reducer;
