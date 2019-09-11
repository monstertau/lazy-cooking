import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  List,
  Avatar,
  Icon,
  Card,
  Button,
  Popconfirm,
  message
} from "antd";
import { Helmet } from "react-helmet";
const { Meta } = Card;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class ShowRecipeScreen extends Component {
  state = {
    data: []
  };
  componentDidMount() {
    console.log(this.props.match.params.type);
    fetch(
      `http://localhost:3001/posts/get-recipe/${this.props.match.params.type}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          data: data.data
        });
      })
      .catch(error => {
        throw error;
      });
  }
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
      <div className="pt-1 pb-5">
        <Helmet>
          <title>Công thức nấu ăn dành cho bạn</title>
        </Helmet>
        <div className="text-center pt-3">
          <h3 className="title-login">Công thức dành cho bạn!</h3>
        </div>
        <div style={{ marginLeft: "15%", marginRight: "15%" }}>
          {window.localStorage.getItem("email") === "superuser@gmail.com" ||
          window.sessionStorage.getItem("email") === "superuser@gmail.com" ? (
            <List
              // className="login"
              grid={{
                gutter: 20,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 4
              }}
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 12
              }}
              dataSource={this.state.data}
              renderItem={item => (
                <List.Item>
                  <a href={`/post/${item._id}`}>
                    <Card
                      className="item-inner"
                      hoverable
                      style={{}}
                      cover={
                        <img
                          alt={item.title}
                          src={item.imageUrl}
                          width="100"
                          height="200"
                          object-fit="cover"
                        />
                      }
                      actions={[
                        <IconText
                          type="like"
                          text={`${item.upvote.length}`}
                          key="upvote"
                        />,
                        <IconText
                          type="bar-chart"
                          text={"Độ khó: " + item.level}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          type="clock-circle"
                          text={item.timetodone + " phút"}
                          key="list-vertical-message"
                        />
                      ]}
                    >
                      <Meta
                        avatar={<Avatar src={item.author.avatarUrl} />}
                        title={item.title}
                        description={
                          "Người đăng: " + item.author.fullName.split(" ").pop()
                        }
                      />
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
                    </Card>
                  </a>
                </List.Item>
              )}
            />
          ) : (
            <List
              // className="login"
              grid={{
                gutter: 20,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 4
              }}
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 12
              }}
              dataSource={this.state.data}
              renderItem={item => (
                <List.Item>
                  <a href={`/post/${item._id}`}>
                    <Card
                      className="item-inner"
                      hoverable
                      style={{}}
                      cover={
                        <img
                          alt={item.title}
                          src={item.imageUrl}
                          width="100"
                          height="200"
                          object-fit="cover"
                        />
                      }
                      actions={[
                        <IconText
                          type="like"
                          text={`${item.upvote.length}`}
                          key="upvote"
                        />,
                        <IconText
                          type="bar-chart"
                          text={"Độ khó: " + item.level}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          type="clock-circle"
                          text={item.timetodone + " phút"}
                          key="list-vertical-message"
                        />
                      ]}
                    >
                      <Meta
                        avatar={<Avatar src={item.author.avatarUrl} />}
                        title={item.title}
                        description={
                          "Người đăng: " + item.author.fullName.split(" ").pop()
                        }
                      />
                    </Card>
                  </a>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ShowRecipeScreen;
