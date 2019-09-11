import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Empty,
  List,
  Avatar,
  Icon,
  Button,
  Popconfirm,
  message,
  Tag
} from "antd";
import {Helmet} from "react-helmet";
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
const urlParts = window.location.pathname.split("/");
const userId = urlParts[urlParts.length - 1];
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
          fetch(`http://localhost:3001/posts/mypost/${userId}`, {
            method: "GET",
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              this.setState({
                data: data.data
              });
            });
        }
      });
      window.addEventListener("resize", this.updateDimensions);
  }
  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  };
  handleEditChange = itemId => {
    if (itemId) {
      window.location.href = `/edit-post/${itemId}`;
    }
  };
  confirm = itemId => {
    console.log(itemId);

    // message.success("Xóa thành công!");
    // setTimeout("window.location.reload();",1000);
    fetch(`http://localhost:3001/posts/delete/${itemId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          message.success("Xóa thành công!");
          setTimeout("window.location.reload();", 1000);
        } else {
          message.error("Xóa thất bại!");
        }
      })
      .catch(error => {
        throw error;
      });
  };

  cancel = e => {
    console.log(e);
  };
  render() {
    return (
      <div className="abc pt-2 pb-5">
        <Helmet>
          <title>Bài đăng của tôi</title>
        </Helmet>
        <div className="text-center pt-3">
          <h3 className="title-login">Công thức của tôi</h3>
        </div>
        <div
          className={this.state.width > 1000?("detail-post"):("detail-post container")}
          style={{marginLeft:this.state.width > 1000?"25%":"",marginRight:this.state.width > 1000?"25%":""}}
        >
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
                pageSize: 10
              }}
              dataSource={this.state.data}
              renderItem={item => (
                <List.Item
                  className=""
                  style={{ marginBottom: "30px" }}
                  key={item.title}
                  actions={[
                    <IconText
                      type="like"
                      text={item.upvote.length}
                      key="upvote"
                    />,
                    <IconText
                      type="bar-chart"
                      text={`Độ khó: ${item.level}`}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      type="clock-circle"
                      text={`Thời gian: ${item.timetodone} phút`}
                      key="list-vertical-message"
                    />
                  ]}
                  extra={
                    <>
                      <img width={272} alt="logo" src={item.imageUrl} />

                      <div className="mt-2" style={{ textAlign: "right" }}>
                        <Button.Group>
                          <Button
                            icon="edit"
                            onClick={() => this.handleEditChange(item._id)}
                          >
                            Chỉnh sửa
                          </Button>
                          <Popconfirm
                            title="Bạn có muốn xóa post này không?"
                            onConfirm={() => this.confirm(item._id)}
                            onCancel={this.cancel}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Button icon="delete">Xóa</Button>
                          </Popconfirm>
                        </Button.Group>
                      </div>
                    </>
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.author.avatarUrl} />}
                    title={
                      <h5>
                        <a
                          href={`/post/${item._id}`}
                          style={{ color: "black" }}
                        >
                          {item.title}
                        </a>
                      </h5>
                    }
                    description={"Dạng bài đăng: " + item.type}
                  />
                  Nguyên liệu:&nbsp;&nbsp;
                  {item.materials.map(i => (
                    <Tag color="blue">{i}</Tag>
                  ))}
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MyPostScreen;
