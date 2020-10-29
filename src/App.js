import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className="App">
        <Title />
        <Effects/>
        <Video />
      </div>
    );
  }
}

function Title() {
  return (
    <div>
      <div id="title">
        <h1>Webcam Effects</h1>
      </div>
      <video className="video"></video>
    </div>
  );
}

function Effects(props) {
  return (
    <form className="navBar">
      <label>
        Red
        <input className="red" name="choice" type="radio"></input>
      </label>
      <label>
        Blue
        <input className="blue" name="choice" type="radio"></input>
      </label>
      <label>
        Green
        <input className="green" name="choice" type="radio"></input>
      </label>     
      <label>
        Split
        <input className="split" name="choice" type="radio"></input>
      </label>
      <label>
        Ghost
        <input className="ghost" name="choice" type="radio"></input>
      </label>
      
    </form>
  );
}

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      video: ""
    };
    this.getVideo = this.getVideo.bind(this);
    this.drawToCanvas = this.drawToCanvas.bind(this);
    this.redEffect = this.redEffect.bind(this);
    this.blueEffect = this.blueEffect.bind(this);
    this.greenEffect = this.greenEffect.bind(this);
    this.splitEffect = this.splitEffect.bind(this);
    this.ghostEffect = this.ghostEffect.bind(this);
  }

  async getVideo () {
    const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
    let video = document.querySelector("video");
    video.srcObject = mediaStream;
    video.play();
    this.setState({isPlaying: true});
    this.setState({video: video});
    video.onloadedmetadata = () => {
      this.drawToCanvas();
    }
  }

  componentDidMount () {
    this.getVideo();
  }

  redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 150; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] - 50; // Blue
    }
    return pixels;
  }

  blueEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] - 50; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] + 150; // Blue
    }
    return pixels;
  }

  greenEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      if(pixels.data[i + 0] < 100 && pixels.data[i + 1] < 100 && pixels.data[i + 2] < 100) {
        pixels.data[i + 0] = 0;
        pixels.data[i + 1] = 255;
        pixels.data[i + 2] = 0;
      }
    }
    return pixels;
  }

  ghostEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 5;
      pixels.data[i + 1] = pixels.data[i + 1] + 5;
      pixels.data[i + 2] = pixels.data[i + 2] + 5;
    }
    return pixels;
  }

  splitEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 350] = pixels.data[i + 0];
      pixels.data[i + 500] = pixels.data[i + 1];
      pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
  }

  drawToCanvas () {
    let canvas = document.querySelector("canvas");
    let video = document.querySelector("video");
    const height = video.videoHeight;
    const width = video.videoWidth;
    canvas.height = height;
    canvas.width = width;
    let ctx = canvas.getContext("2d");
    setInterval( () => {
      ctx.drawImage(video, 0, 0, width, height);
      let pixels = ctx.getImageData(0, 0, width, height);
      let choice = document.querySelector("input[type=radio]:checked");
      if(choice !== null) {
        choice = choice.className;
      }
      if(choice === 'red'){
        this.redEffect(pixels);
        ctx.globalAlpha = 1;
      }
      if(choice === 'blue'){
        this.blueEffect(pixels);
        ctx.globalAlpha = 1;
      }
      if(choice === 'green'){
        this.greenEffect(pixels);
        ctx.globalAlpha = 1;
      }
      if(choice === 'ghost'){
        this.ghostEffect(pixels);
        ctx.globalAlpha = 0.05;
      }
      if(choice === 'split'){
        this.splitEffect(pixels);
      }
      ctx.putImageData(pixels, 0, 0);
    }, 16);
  }

  render () {
    return (
      <div className="videoContainer">
        <canvas className="canvas"></canvas>
      </div>
    );
  }
}


export default App;
