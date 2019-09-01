import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import { Button, Input, Menu, Dropdown, Icon, Avatar } from "antd";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import WrappedRegistrationForm from "./pages/Profile";
import WrappedCreatePostScreen from "./pages/CreatePostScreen";
import Blog from "./pages/Blog";
import MyPostScreen from "./pages/MyPostScreen";
import DetailPostScreen from "./pages/DetailPostScreen";
const { Search } = Input;

class App extends React.Component {
  state = {
    currentUser: {
      email: "",
      fullName: "",
      id: "",
      sessionCheck: "",
      avatarUrl: ""
    }
  };
  handleLogOut = e => {
    e.preventDefault();
    fetch("http://localhost:3001/users/logout", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        // clear window.localStorage
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("fullName");
        window.localStorage.removeItem("avatarUrl");
        window.localStorage.removeItem("id");
        window.location.reload();
        // clear fullname + email in state
      })
      .catch(error => {
        console.log(error);
      });
<<<<<<< HEAD
  };
  componentWillMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      credentials: "include"
=======
  }
  menu = (
    <Menu>
      <Menu.Item>
        {window.localStorage.getItem('fullName')? (
          <p>Welcome,{window.localStorage.getItem(`fullName`)} !</p>
        ): (<p>Welcome,{window.sessionStorage.getItem(`fullName`)} !</p>)}
        
      </Menu.Item>
      <Menu.Item>
        <a href={`/profile`}>
          Profile
        </a>
      </Menu.Item>
      <Menu.Item>
        <a  href={`/my-post/${window.localStorage.getItem('id')}`}>
          Bài đăng của tôi
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={this.handleLogOut}>
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  );
  componentDidMount() {
    const email = window.localStorage.getItem(`email`);
    const fullName = window.localStorage.getItem(`fullName`);
    const id = window.localStorage.getItem(`id`);
    const avatarUrl = window.localStorage.getItem(`avatarUrl`);
    if (email && fullName) {
      this.setState({
        currentUser: {
          email: email,
          fullName: fullName,
          id: id,
          avatarUrl: avatarUrl
        }
      });
    }
    fetch('http://localhost:3001/users/check-session',{
      method:'GET',
      credentials: 'include',
>>>>>>> d0f65ae34c9a854d83cbf91500736b3f1fbf1df8
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          const email = window.localStorage.getItem(`email`);
          const fullName = window.localStorage.getItem(`fullName`);
          const id = window.localStorage.getItem(`id`);
          const avatarUrl = window.localStorage.getItem(`avatarUrl`);
          if (email && fullName && id) {
            this.setState({
              currentUser: {
                sessionCheck: "true",
                email: email,
                fullName: fullName,
                id: id,
                avatarUrl: avatarUrl
              }
            });
          } else {
            const email = window.sessionStorage.getItem(`email`);
            const fullName = window.sessionStorage.getItem(`fullName`);
            const id = window.sessionStorage.getItem(`id`);
            const avatarUrl = window.sessionStorage.getItem(`avatarUrl`);
            this.setState({
              currentUser: {
                sessionCheck: "true",
                email: email,
                fullName: fullName,
                id: id,
                avatarUrl: avatarUrl
              }
            });
          }
        } else {
          window.localStorage.removeItem("email");
          window.localStorage.removeItem("fullName");
          window.localStorage.removeItem("avatarUrl");
          window.localStorage.removeItem("id");
          window.sessionStorage.removeItem("email");
          window.sessionStorage.removeItem("fullName");
          window.sessionStorage.removeItem("avatarUrl");
          window.sessionStorage.removeItem("id");
        }
      })
      .catch(error => {
        throw error;
      });
  }
  // checkSession = e =>{
  //   e.preventDefault();

  // }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Button
            icon="home"
            className="mr-6"
            type="danger"
            size="large"
            href="/"
          >
            Home
          </Button>
          <Button size="large" type="link">
            Công thức
          </Button>
          <Button size="large" href="/blog" type="link">
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
          {this.state.currentUser.sessionCheck ? (
            <ul className="navbar-nav mr-auto">
<<<<<<< HEAD
              <Button
                icon="form"
                style={{ marginLeft: "5px" }}
                size="large"
                href="/create-recipe"
              >
                Đăng công thức
              </Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <p>Welcome,{this.state.currentUser.fullName} !</p>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`/profile`}>Profile</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`/my-post/${this.state.currentUser.id}`}>
                        Bài đăng của tôi
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a onClick={this.handleLogOut}>Đăng xuất</a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <a className="ant-dropdown-link" href="#">
                  <Avatar
                    src={this.state.currentUser.avatarUrl}
                    style={{ marginLeft: "6px" }}
                    size={45}
                  />
                </a>
              </Dropdown>
            </ul>
=======
            <Button icon="form" style={{ marginLeft: "5px" }} size="large" href="/create-recipe">
              Đăng công thức
            </Button>
            <Dropdown overlay={this.menu}>
              <a className="ant-dropdown-link" href="#">
                {window.localStorage.getItem('avatarUrl')? (
                  <Avatar src={window.localStorage.getItem(`avatarUrl`)} style={{ marginLeft: "6px" }} size={45} />
                ):( <Avatar src={window.sessionStorage.getItem(`avatarUrl`)} style={{ marginLeft: "6px" }} size={45} />)}
                
              </a>
            </Dropdown>
          </ul>
>>>>>>> d0f65ae34c9a854d83cbf91500736b3f1fbf1df8
          ) : (
            <ul className="navbar-nav mr-auto">
              <Button
                size="large"
                style={{ marginLeft: "9px", marginRight: "9px" }}
                icon="login"
                href="/login"
              >
                Đăng nhập
              </Button>
              <Button size="large" type="danger" icon="logout" href="/register">
                Đăng kí
              </Button>
            </ul>
          )}
        </nav>
        <BrowserRouter>
          <Route path="/" exact={true} component={HomeScreen} />
          <Route path="/login" exact={true} component={LoginScreen} />
          <Route path="/register" exact={true} component={RegisterScreen} />
          <Route
            path="/profile"
            exact={true}
            component={WrappedRegistrationForm}
          />
          <Route
            path="/create-recipe"
            exact={true}
            component={WrappedCreatePostScreen}
          />
          <Route path="/blog" exact={true} component={Blog} />
          <Route
            path="/my-post/:userId"
            exact={true}
            component={MyPostScreen}
          />
          <Route
            path="/post/:postId"
            exact={true}
            component={DetailPostScreen}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
