import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
    }
  }

  onFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const data = new FormData();
    data.append('file', file);
    const request = new XMLHttpRequest();
    request.upload.addEventListener('progress', (evt) => {

      const pc = (((evt.loaded / evt.total) * 100));
      this.setState({
        percent: Math.ceil(pc),
      })
    })
    request.open('POST', 'http://localhost:4000/upload');
    request.send(data);
    // Axios.post('http://localhost:4000/upload', data)
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(error => {
    //     console.log(error.response);
    //   })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <label htmlFor="avatar">
          <input onChange={this.onFileChange} name="avatar" id="avatar" type="file" />
        </label>
        <div style={{ fontSize: '30px' }}>Uploading {this.state.percent} %</div>
        <video width="320" height="240" controls>
          <source src="http://localhost:4000/video-stream" type="video/mp4" />
        </video>
      </div>
    );
  }
}

export default App;
