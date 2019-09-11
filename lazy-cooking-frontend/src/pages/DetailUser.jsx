import React, { Component } from "react";
import "./DetailUser.css";
import { Icon, Avatar } from "antd";
import { Helmet } from "react-helmet";
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class DetailUser extends Component {
  state = {
    data: {}
  };
  componentDidMount() {
    const urlParts = window.location.pathname.split("/");
    const userId = urlParts[urlParts.length - 1];
    console.log(userId);
    fetch(`http://localhost:3001/users/profile/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          data: data.data
        });
      });
  }
  render() {
    return (
      <div class="container">
        <Helmet>
          <title>Chi tiết người đăng</title>
        </Helmet>
        <div className="text-center pt-5">
          <h3 className="title-login">Chi tiết người đăng</h3>
        </div>
        <div class="row mt-5" style={{ marginLeft: "350px" }}>
        
          <div style={{ marginRight: "10px" }}>
            <Avatar size={240} src={this.state.data.avatarUrl} />
          </div>
          <div id="clear">
            <h2>{this.state.data.fullName}</h2>
            <p style={{ fontSize: "20px" }}>
              <i class="glyphicon glyphicon-envelope"></i>
              {this.state.data.email}
              <br />
              <IconText
                type="phone"
                text={this.state.data.phone}
                key="list-vertical-like-o"
              />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailUser;
