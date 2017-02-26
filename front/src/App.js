  import React, { Component, Image } from 'react';
import './App.css';

var config = require("../../config.json");

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.state.images =  [];
  }

  componentDidMount(){
    var request = new Request(config.server + "/api/images/");
    fetch(request)
      .then(result=> {
        return result.json();
      }).then(data=> {
        this.setState({images: data});
      });
  }

  componentDidUpdate(){
    //console.log(this.state.images)
  }

  render() {
    console.log(this.state);
    return (
      <div>
        {this.state.images.map(function(image, i){
          return <img key={i} src={"http://localhost:8000/" + image.image}/>;
        })}

      </div>
    );
  }
}

export default App;
