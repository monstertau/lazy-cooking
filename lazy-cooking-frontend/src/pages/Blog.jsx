import React, { Component } from "react";
import { List, Avatar, Icon, Tag } from "antd";
import "./Blog.css";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class Blog extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    fetch(`http://localhost:3001/posts/getpost`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
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
    // console.log(this.state.data)
    return (
      <div className="abc ">
        <div className="container mt-0 mb-5 detail-post">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 7
            }}
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item
                className="login"
                style={{ marginTop: "30px" }}
                key={item.title}
                actions={[
                  <IconText
                    type="like-o"
                    text={item.upvote.length}
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="clock-circle"
                    text={`Thời Gian: ${item.timetodone} phút`}
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="bar-chart"
                    text={`Độ Khó: ${item.level} sao`}
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="user"
                    text={`Người Đăng: ${item.author.fullName}`}
                    key="list-vertical-like-o"
                  />
                ]}
                extra={
                  <img
                    width={272}

                    alt="logo"
                    src={item.imageUrl}
                    style={{ objectFit: "cover" }}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.author.avatarUrl} />}
                  title={<h5><a href={`/post/${item._id}`} style={{ color: "black" }}>{item.title}</a></h5>}
                />
                Nguyên liệu:&nbsp;&nbsp;
              {item.materials.map(i => (
                  <Tag color="blue">{i}</Tag>
                ))}
              </List.Item>
            )}
          />
        </div>
      </div>

    );
  }
}

export default Blog;
