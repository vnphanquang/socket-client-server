import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: '',
    }
  }

  componentDidMount() {

  }

  onTokenChange = (e) => {
    const token = e.target.value;
    this.setState({
      token: token,
    })
  }

  onSubmit = (e) => {
    const { token } = this.state;
    console.log(this.props.history);
    this.props.history.push('/home', { token });
  }

  render() {
    const { token } = this.state;
    return (
      <div className="App">
        <h1>Socket Client</h1>
        <div>
          <label htmlFor="token">Token:</label>
          <input id="token" type="text" value={token} onChange={this.onTokenChange} />
          <button onClick={this.onSubmit}>Login</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
