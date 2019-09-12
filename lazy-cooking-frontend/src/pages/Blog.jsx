import React, { Component } from "react";
import { List, Avatar, Icon, Tag, Button, Popconfirm,message } from "antd";
import "./Blog.css";
import { Helmet } from "react-helmet";
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class Blog extends Component {
  state = {
    data: [],
    height: window.innerHeight,
    width: window.innerWidth
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
  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
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
    window.addEventListener("resize", this.updateDimensions);
  }
  render() {
    console.log(this.state.width);
    return (
      <div>
        <Helmet>
          <title>Blog</title>
        </Helmet>
        <div className="text-center pt-3">
          <h3 className="title-login">Blogs mới nổi bật</h3>
        </div>
        <div
          className={
            this.state.width > 1000
              ? "detail-post mb-5"
              : "detail-post mb-5 container"
          }
          style={{
            marginLeft: this.state.width > 1000 ? "25%" : "",
            marginRight: this.state.width > 1000 ? "25%" : ""
          }}
        >
          {window.localStorage.getItem("email") === "superuser@gmail.com" ||
          window.sessionStorage.getItem("email") === "superuser@gmail.com" ? (
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
                  style={{ marginBottom: "30px" }}
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
                    />
                    // <IconText
                    //   type="user"
                    //   text={`Người Đăng: ${item.author.fullName}`}
                    //   key="list-vertical-like-o"
                    // />
                  ]}
                  extra={
                    <>
                      <img
                        width={272}
                        alt="logo"
                        src={item.imageUrl}
                        style={{ objectFit: "cover" }}
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
                    </>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <a href={`/detailUser/${item.author._id}`}>
                        <Avatar src={item.author.avatarUrl} />
                      </a>
                    }
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
                    description={"Người đăng:" + item.author.fullName}
                  />
                  Nguyên liệu:&nbsp;&nbsp;
                  {item.materials.map(i => (
                    <Tag color="blue">{i}</Tag>
                  ))}
                </List.Item>
              )}
            />
          ) : (
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
                  style={{ marginBottom: "30px" }}
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
                    />
                    // <IconText
                    //   type="user"
                    //   text={`Người Đăng: ${item.author.fullName}`}
                    //   key="list-vertical-like-o"
                    // />
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
                    avatar={
                      <a href={`/detailUser/${item.author._id}`}>
                        <Avatar src={item.author.avatarUrl} />
                      </a>
                    }
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
                    description={"Người đăng:" + item.author.fullName}
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

export default Blog;
