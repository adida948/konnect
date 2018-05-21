import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logInUser, signUpUser, removeErrorMessage } from '../../actions';
import Form from './Form';

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      passwordConfirmation: '',
      toggleLogin: 'signup',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleLogin = this.handleToggleLogin.bind(this);
  }

  handleChange(inputName) {
    return (e) => {
      e.preventDefault();
      this.setState({ [inputName]: e.target.value });
      this.props.removeErrorMessage();
    };
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password, passwordConfirmation } = this.state;

    if (this.state.toggleLogin === 'signup') {
      this.props.signUpUser({ username, password, passwordConfirmation });
    } else {
      this.props.logInUser({ username, password });
    }
  }

  handleToggleLogin(toggleLogin) {
    this.props.removeErrorMessage();
    this.setState({ toggleLogin });
  }

  render() {
    const {
      username,
      password,
      passwordConfirmation,
      toggleLogin,
    } = this.state;
    const { err } = this.props;

    return (
      <div className="login-page">
        <section className="login-header">
          <h1 className="konnect-title">Let's Konnect!</h1>
          <div className="login-btns">
            <button
              className={`login-btn-${toggleLogin === 'signup' ? 'on' : 'off'}`}
              onClick={() => this.handleToggleLogin('signup')}
            >
              Sign up
            </button>
            <button
              className={`login-btn-${toggleLogin !== 'signup' ? 'on' : 'off'}`}
              onClick={() => this.handleToggleLogin('login')}
            >
              Log in
            </button>
          </div>
        </section>
        <Form
          err={err}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          password={password}
          passwordConfirmation={passwordConfirmation}
          toggleLogin={toggleLogin}
          username={username}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  err: state.err,
});

LogIn.propTypes = {
  err: PropTypes.string.isRequired,
  logInUser: PropTypes.func.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  signUpUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  logInUser,
  removeErrorMessage,
  signUpUser,
})(LogIn);
