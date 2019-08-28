import React from "react";
import { Carousel,Row } from "antd";
import "antd/dist/antd.css";
import "./HomeScreen.css"

class HomeScreen extends React.Component {
  render() {
    return (
      <div className="container" style={{marginTop:"20px"}}>
        <Carousel autoplay>
          <div className="intro">
            <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel"/>
          </div>
          <div>
          <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel"/>
          </div>
          <div>
          <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel"/>
          </div>
          <div>
          <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel"/>
          </div>
        </Carousel>
        </div>
    );
  }
}

export default HomeScreen;
