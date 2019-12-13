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
let socket;

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    }
  }

  componentDidMount() {
    const { token, deviceId } = this.props.location.state;

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.refresh();

    }

    socket = ioClient(baseUrl, options);

    socket.connect();

    window.onbeforeunload = function() {
      console.log('test disconnect')
      socket.disconnect();
    }.bind(this);

    socket.on('connect', (pong) => {
      socket.emit('authentication', { token, deviceId});
    });

    socket.on('authenticated', (reason) => {

    });

    socket.on('unauthorized', (reason) => {
      console.log('Unauthorized:', reason);

      socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
      this.props.history.push('/');
    });

    socket.on('loggedIn', (userId) => {
      console.log(userId + ' logged in');

      const userStatus = this.state.users.map(u => {
        if (u.id === userId) {
          return {...u, status: 'online'};
        }

        return u;
      });

      this.setState({
        users: userStatus
      });

    });

    socket.on('loggedOut', (userId) => {
        console.log(userId + ' logged out');

        const userStatus = this.state.users.map(u => {
          if (u.id === userId) {
            return {...u, status: 'offline'};
          }

          return u;
        });

        this.setState({
          users: userStatus
        });
      });

    socket.on('syncedUsers', (users) => {
      const userStatus = this.state.users.map(u => {
        let temp;
        for (let i = 0; i < users.length; i++) {
          if (u.id === users[i].id) {
            temp = {...u, status: users[i].status};
            break;
          }

          temp = {...u, status: "offline"};
        }
        return temp;
      });

      this.setState({
        users: userStatus
      });
    });

  }

  refresh = () => {
    Axios.get(`${baseUrl}` + `/users/daily-suggestions`)
      .then((res) => {

        const userStatus = res.data.map(u => ({...u, status: 'offline'}));

        this.setState({
          users: userStatus
        });


        const userArr = res.data.map((u) => u.id);
        socket.emit('joinRooms', userArr);
        socket.emit('syncStatus', userArr);

      })
      .catch((error) => console.log(error));
  }

  renderUser = (users) => (<div>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>fullName</th>
          <th>email</th>
          <th>gender</th>
          <th>status</th>
          <th>action</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(u => (<tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.fullName}</td>
            <td>{u.email}</td>
            <td>{u.gender}</td>
            <td style={{ color: `${u.status == 'online' ? 'green' : 'red'}`, fontWeight: 'bold' }}>{u.status}</td>
          </tr>)
          )
        }
      </tbody>
    </table>
  </div>);

  login = () => {
    socket.connect();
  };

  disconnect = () => {
    socket.disconnect();
    this.props.history.push('/');
  };

  render() {
    const { users } = this.state;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1>User list</h1>
          <button onClick={this.login}>Log me in</button>
          <button onClick={this.disconnect}>Logout</button>
          {
            users.length && this.renderUser(users)
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
