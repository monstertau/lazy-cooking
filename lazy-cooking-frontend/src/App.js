import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import { Button, Input, Menu, Dropdown, Icon, Avatar } from "antd";
import HomeScreen from "./pages/HomeScreen";
const { Search } = Input;
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/profile">
        Profile
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        Bài đăng của tôi
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/logout">
        Đăng xuất
      </a>
    </Menu.Item>
  </Menu>
);
class App extends React.Component {
  state = {
    currentUser: {
      email: "",
      fullName: ""
    }
  };
  componentWillMount() {
    const email = window.localStorage.getItem(`email`);
    const fullName = window.localStorage.getItem(`fullName`);

    if (email && fullName) {
      this.setState({
        currentUser: {
          email: email,
          fullName: fullName
        }
      });
    }
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Button icon="home" className="mr-6" type="danger" size="large">
            Lazy Cooking
          </Button>
          <Button size="large" type="link">
            Công thức
          </Button>
          <Button size="large" type="link">
            Blogs{" "}
          </Button>
          <Button size="large" type="link">
            Bữa ăn đơn giản{" "}
          </Button>
          <Search
            placeholder="Nhập công thức muốn tìm kiếm"
            enterButton
            size="large"
          />
          {this.state.currentUser.fullName ? (
            <ul className="navbar-nav mr-auto">
              <Button
                size="large"
                style={{ marginLeft: "9px", marginRight: "9px" }}
                icon="login"
              >
                Đăng nhập
              </Button>
              <Button size="large" type="danger" icon="logout">
                Đăng kí
              </Button>
            </ul>
          ) : (
            <ul className="navbar-nav mr-auto">
              <Button icon="form" style={{ marginLeft: "5px" }}>
                Đăng công thức
              </Button>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  <Avatar icon="user" style={{ marginLeft: "6px" }} size={45} />
                </a>
              </Dropdown>
            </ul>
          )}
        </nav>
        <BrowserRouter>
          <Route path="/" exact={true} component={HomeScreen} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
