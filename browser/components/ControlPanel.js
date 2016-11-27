import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';

import { openConsole,
         closeConsole,
         setMode,
         setNickname,
         setEmail,
         setPassword,
         setError,
         resetError,
         startAsGuest } from '../reducers/controlPanel';

import { loginAsGuest, login, logout } from '../reducers/auth';

const authenticate = (email, password) => {
  socket.emit('authentication', { email, password });
};

class ControlPanel extends Component {
  render() {
    let { players,
          controlPanel,
          auth,
          open,
          close,
          guestClick,
          authClick,
          updateNickname,
          updateEmail,
          updatePassword,
          start,
          exit } = this.props;
    let { isOpen,
          mode,
          nickname,
          email,
          password,
          error } = controlPanel;
    let player = socket && players[socket.id];

    if (!auth) {
      return (
      <div style={{position: 'absolute', zIndex: 1, marginLeft: '64%'}}>
      { isOpen ?
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            { error && <div>{error}</div> }
            { mode === 'guest' &&
              <div className="input-field">
                <input type="text"
                       placeholder="Nickname"
                       value={nickname}
                       onChange={updateNickname}/>
              </div> }
            { mode === 'auth' &&
              <div>
                <div className="input-field">
                  <input type="text"
                         placeholder="Email"
                         value={email}
                         onChange={updateEmail}/>
                </div>
                <div className="input-field">
                  <input type="password"
                         placeholder="Password"
                         value={password}
                         onChange={updatePassword}/>
                </div>
              </div>}
            <input type="button"
                   value="Play As Guest"
                   className="btn"
                   onClick={guestClick} />
            <input type="button"
                   value={mode === 'auth' ? 'Authenticate' : 'Sign In'}
                   className="btn"
                   onClick={authClick}/>
            <input type="button"
                   value="Close Window"
                   className="btn"
                   onClick={close}/>
          </div>
        </div> :
        <div>
          {player && <p>{`Welcome ${nickname}`}</p>}
          <button className="btn" onClick={open}>Open</button>
        </div>}
        </div>
      );
    } else {
        return (
          <div style={{position: 'absolute', zIndex: 1, marginLeft: '64%'}}>
          { isOpen ?
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                { error && <div>{error}</div> }
                <input type="button"
                       value="Start Game"
                       className="btn"
                       onClick={start} />
                <input type="button"
                       value="Sign Out"
                       className="btn"
                       onClick={exit}/>
              </div>
            </div> :
            <div>
              {player && <p>{`Welcome ${nickname}`}</p>}
              <button className="btn" onClick={open}>Open</button>
            </div> }
          </div>
      );
    }
  }
}

const mapStateToProps = ({ players, controlPanel, auth }) => ({ players, controlPanel, auth });

const mapDispatchToProps = dispatch => ({
  open: () => dispatch(openConsole()),
  close: () => dispatch(closeConsole()),
  switchMode: mode => dispatch(setMode(mode)),
  updateNickname: e => dispatch(setNickname(e.target.value)),
  updateEmail: e => dispatch(setEmail(e.target.value)),
  updatePassword: e => dispatch(setPassword(e.target.value)),
  updateError: error => dispatch(setError(error)),
  clearError: () => dispatch(resetError()),
  signInAsGuest: nickname => dispatch(loginAsGuest(nickname)),
  signIn: (email, password) => dispatch(login(email, password)),
  start: () => socket.emit('start'),
  exit: () => dispatch(logout())
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let { mode, nickname, email, password } = stateProps.controlPanel;
  let { signInAsGuest, switchMode, signIn } = dispatchProps;
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    guestClick: () => {
      if (mode === 'guest') {
        signInAsGuest(nickname);
      } else {
        switchMode('guest');
      }
    },
    authClick: () => {
      console.log('auth click');
      if (mode === 'auth') {
        signIn(email, password);
      } else {
        switchMode('auth');
      }
    }
  });

};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ControlPanel);
