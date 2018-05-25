/* global localStorage */

import axios from 'axios';
import io from 'socket.io-client';
import {
  CLEAR_MISSED_MSG,
  CLEAR_NOTICES,
  FETCH_MESSAGES,
  FETCH_USERS,
  LOADING,
  LOGIN_ERROR,
  LOGGED_IN,
  LOGOUT,
  MESSAGE_SENT,
  STOPPED_TYPING,
  SOCKET_EVENTS,
  TYPING,
  USER_CONNECTED,
} from '../../constants';

const ROOT_URL = 'https://konnect-chat.herokuapp.com/';
// const ROOT_URL = 'http://localhost:3000';

// Socket actions
const socket = io(ROOT_URL);
const initSocket = (dispatch) => {
  socket.on('connect', () => {
    console.log('welcome to konnect!');
  });

  SOCKET_EVENTS.forEach(type =>
    socket.on(type, (payload) => {
      dispatch({ type, payload });
    }));
};

export const socketOff = () => () => {
  SOCKET_EVENTS.forEach(type => socket.off(type));
};

// User actions
export const fetchUsers = () => (dispatch) => {
  axios
    .get(`${ROOT_URL}/users`)
    .then(({ data }) => {
      dispatch({
        type: FETCH_USERS,
        payload: data.length <= 1 ? data
          : data.sort((a, b) => b.onlineStatus - a.onlineStatus),
      });
    })
    .catch((err) => {
      console.log(`fetching all users failed: ${err}`);
    });
};

const loginFailed = (error, dispatch) => {
  dispatch({
    type: LOGIN_ERROR,
    payload: error,
  });
};

const loginSuccess = ({ token, newUser, missedMsg }, dispatch) => {
  localStorage.setItem('token', token);
  initSocket(dispatch);
  dispatch({
    type: LOGGED_IN,
    payload: {
      user: newUser,
      missedMsg,
    },
  });
  socket.emit(USER_CONNECTED, newUser);
};

export const logInUser = ({ username, password }) => (dispatch) => {
  axios
    .post(`${ROOT_URL}/login`, { username, password })
    .then(({ data }) => {
      if (data.error) {
        loginFailed(data.error, dispatch);
      } else {
        loginSuccess(data, dispatch);
      }
    })
    .catch(() => {
      dispatch({
        type: LOGIN_ERROR,
        payload: 'log in failed, bad login info.',
      });
    });
};

export const signUpUser = ({
  username,
  password,
  passwordConfirmation,
}) => (dispatch) => {
  axios
    .post(`${ROOT_URL}/signup`, { username, password, passwordConfirmation })
    .then(({ data }) => {
      if (data.error) {
        loginFailed(data.error, dispatch);
      } else {
        loginSuccess(data, dispatch);
      }
    })
    .catch(() => {
      dispatch({
        type: LOGIN_ERROR,
        payload: 'sign up failed, bad login info.',
      });
    });
};

export const signOutUser = user => (dispatch) => {
  socket.emit(LOGOUT, user);
  dispatch({
    type: LOGOUT,
  });
  localStorage.removeItem('token');
};

// Message actions
export const fetchMessages = () => (dispatch) => {
  dispatch({ type: LOADING, payload: true });
  axios
    .get(`${ROOT_URL}/messages`)
    .then(({ data }) => {
      dispatch({
        type: FETCH_MESSAGES,
        payload: data,
      });

      setTimeout(() => dispatch({ type: LOADING, payload: false }), 500);
    })
    .catch((err) => {
      console.log(`fetch messages failed: ${err}`);
    });
};
export const removeErrorMessage = () => (dispatch) => {
  dispatch({
    type: LOGIN_ERROR,
    payload: '',
  });
};

export const sendMessage = ({ username, date, text }) => () => {
  axios
    .post(`${ROOT_URL}/send`, { username, date, text })
    .then(({ data }) => {
      socket.emit(MESSAGE_SENT, data);
    })
    .catch((err) => {
      console.log(`send message failed: ${err}`);
    });
};

export const clearMissedMsg = username => (dispatch) => {
  axios
    .post(`${ROOT_URL}/bookmark`, { username })
    .then(({ data }) => {
      if (data.error) {
        console.log(`unable to find the username: ${username} to remove`);
      } else {
        dispatch({
          type: CLEAR_MISSED_MSG,
        });
      }
    })
    .catch((err) => {
      console.log(`remove bookmark failed: ${err}`);
    });
};

// Notice actions
export const clearNotices = () => ({
  type: CLEAR_NOTICES,
});

export const isTyping = (username, bool) => () => {
  if (bool) {
    socket.emit(TYPING, username);
  } else {
    socket.emit(STOPPED_TYPING, username);
  }
};
