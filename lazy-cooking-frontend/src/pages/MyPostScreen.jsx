import React, { Component } from "react";
import "antd/dist/antd.css";
import { Empty, List, Avatar, Icon } from "antd";
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class MyPostScreen extends Component {
  state = {
    havePost: true,
    data: []
  };
  componentDidMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === false) {
          window.location.href = "/login";
        } else {
          fetch("http://localhost:3001/posts/mypost", {
            method: "GET",
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              this.setState({
                data:data.data
              })
            });
        }
      });
  }
  render() {
    return (
      <div className="container mt-5 mb-5">
        <h3>Công thức của tôi</h3>
        {this.state.havePost === false ? (
          <Empty />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 5
            }}
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText type="like" text="0" key="upvote" />,
                  <IconText
                    type="bulb"
                    text="Độ khó: 5"
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="clock-circle"
                    text="Thời gian: 10 phút"
                    key="list-vertical-message"
                  />
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://sites.google.com/site/khxmuleleasarsnthes/_/rsrc/1480953778509/watthuprasngkh/googlelogo_color_284x96dp.png"
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatarUrl} />}
                  title={<a href={item.href}>{item.title}</a>}
                  // description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default MyPostScreen;
