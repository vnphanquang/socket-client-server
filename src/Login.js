import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import './App.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOGUyMjVlZTAtMzlmMy00MTMwLWEzYzktOGFhMWM5NTRhMGI1IiwiZW1haWwiOm51bGwsImZ1bGxOYW1lIjoiVGhvbnNvbS1lbnYgaG91c2UiLCJiaXJ0aGRheSI6IjE5OTktMTItMzFUMTc6MDA6MDAuMDAwWiIsImdlbmRlcklkIjoxMzA1LCJwaG9uZSI6bnVsbCwic29jaWFsSWQiOiJhYmMxMjM0NTY3ODMyIiwibWV0aG9kIjoiYXBwbGUiLCJtZXRhZGF0YSI6eyJwZW5kaW5nU3RlcCI6IlBST0ZJTEVfSU1BR0UifX0sImRldmljZUlkIjoiZDEiLCJpYXQiOjE1NzYyMDc2MDIsImV4cCI6MTU3NjI5NDAwMn0.W3e_iNoHNWzQmGj4JNa4L1SMxbheud_Qu-bEuu1WidI',
      deviceId: 'd1',
    }
  }

  componentDidMount() {

  }

  onTokenChange = (e) => {
    const token = e.target.value;
    this.setState({
      token: token
    })
  };

  onDeviceIdChange = (e) => {
    const deviceId = e.target.value;
    this.setState({
      deviceId: deviceId
    })
  }

  onSubmit = (e) => {
    const { token, deviceId } = this.state;
    this.props.history.push('/home', { token, deviceId });
  };

  render() {
    const { token, deviceId } = this.state;
    return (
      <div className="App">
        <h1>Socket Client</h1>
        <div>
          <label htmlFor="token">Token:</label>
          <input id="token" type="text" value={token} onChange={this.onTokenChange} />
          <br/>
          <label htmlFor="deviceId">DeviceId:</label>
          <input id="deviceId" type="text" value={deviceId} onChange={this.onDeviceIdChange} />
          <br/>
          <button onClick={this.onSubmit}>Login</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
