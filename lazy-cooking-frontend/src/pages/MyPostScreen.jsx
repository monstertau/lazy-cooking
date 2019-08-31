import React, { Component } from 'react';
import "antd/dist/antd.css";
import { Empty } from "antd";
class MyPostScreen extends Component {
  state = {
    havePost: false,
  }
  render() {
    return (
      <div className="container mt-5">
        <h3>Công thức của tôi</h3>
        {(this.state.havePost==false)?(
          <Empty/>
        ):(
          <div>have some</div>
        )}
      </div>
    );
  }
}

export default MyPostScreen;