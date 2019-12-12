import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import Axios from 'axios';
import ioClient from 'socket.io-client';

const baseUrl = 'http://localhost:4000';
const axios = Axios.create();
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const baseSocketUrl = 'http://localhost';

const options = {
  reconnection: true,
  rememberUpgrade: true,
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false,
  ws: true,
}
const socket = ioClient.connect(baseUrl, options);
socket.on('connect', () => {
  console.log('connected');
  socket.emit('authentication', {
    token: '5f59:7817:ec37:076d:1e8d:5522:827f:89e2',
  });
});

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    }
  }

  // componentWillMount() {
  //   this.refresh();
  // }

  componentDidMount() {
    const { token } = this.props.location.state;

    if (token) {
      console.log('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.refresh();
    }

    socket.on('unauthorized', (reason) => {
      console.log('Unauthorized:', reason);

      socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    socket.on('ping', (ping) => {
      console.log(`Sever receive ping: ${ping}`);
    });

    socket.on('pong', (pong) => {
      console.log(`Sever respond pong: ${pong}`);
    });

    // socket.on('someoneLogined', (payload) => {
    //   console.log(`${payload} logined.`);
    //   this.refresh();
    // });

    // socket.on('someoneLogouted', (payload) => {
    //   console.log(`${payload} logouted.`);
    //   this.refresh();
    // });

    // socket.on('connect_error', (err) => {
    //   console.log('error', err);
    // });

    // socket.on('connect_timeout', (time) => {
    //   console.log('timeout', time);
    // });
  }

  refresh = () => {
    Axios.get(`${baseUrl}` + `/users/daily-suggestions`)
      .then((res) => {
        this.setState({
          users: res.data
        });
        // socket.emit('sync', users)
      })
      .catch((error) => console.log(error));
  }

  renderUser = (users) => (<div>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>status</th>
          <th>action</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(u => (<tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.fullName}</td>
            <td style={{ color: `${u.status == 'online' ? 'green' : 'red'}`, fontWeight: 'bold' }}>{u.status}</td>
            {
              // u.id == userId ? <td style={{ cursor: 'pointer' }} onClick={(e) => this.logout(u.id)}> Logout me from this fucking app!!!</td> : null
            }
          </tr>)
          )
        }
      </tbody>
    </table>
  </div>);

  login = () => {
    // socket.emit('login', { id: userId });
  }

  logout = (userId) => {
    socket.disconnect();
  }

  disconnect = () => {
    socket.disconnect();
  }

  render() {
    const { users } = this.state;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1>User list</h1>
          <button onClick={this.login}>Log me in</button>
          <button onClick={this.disconnect}>Disconnect me</button>
          {
            users.length && this.renderUser(users)
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Home);;