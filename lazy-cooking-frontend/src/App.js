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
import MenuItem from "antd/lib/menu/MenuItem";
import ShowRecipeScreen from "./pages/ShowRecipeScreen";
const { Search } = Input;
const { SubMenu } = Menu;
class App extends React.Component {
  state = {
    currentUser: {
      email: "",
      fullName: "",
      id: "",
      sessionCheck: false,
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
  };
  componentDidMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          if (
            window.localStorage.getItem("email") ||
            window.sessionStorage.getItem("email")
          ) {
            const email = window.localStorage.getItem(`email`);
            const fullName = window.localStorage.getItem(`fullName`);
            const id = window.localStorage.getItem(`id`);
            const avatarUrl = window.localStorage.getItem(`avatarUrl`);
            if (email && fullName && id) {
              this.setState({
                currentUser: {
                  sessionCheck: true,
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
                  sessionCheck: true,
                  email: email,
                  fullName: fullName,
                  id: id,
                  avatarUrl: avatarUrl
                }
              });
            }
          } else {
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

                // clear fullname + email in state
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          console.log(data);
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
    console.log(this.state);
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

          <Dropdown
            overlay={
              <Menu mode="inline">
                <SubMenu title="Thực đơn">
                  <Menu.Item ><a href="/recipe/?category=bua-sang">Bữa sáng</a></Menu.Item>
                  <Menu.Item ><a href="/recipe/?category=bua-trua">Bữa trưa</a></Menu.Item>
                  <Menu.Item ><a href="/recipe?category=bua-chieu">Bữa chiều</a></Menu.Item>
                </SubMenu>
                <Menu.Divider/>
                <SubMenu title="Nguyên liệu">
                  <Menu.Item >Thịt gà</Menu.Item>
                  <Menu.Item>Thịt bò</Menu.Item>
                  <Menu.Item>Thịt lợn</Menu.Item>
                  <Menu.Item>Thịt Cá</Menu.Item>
                  <Menu.Item>Thịt Cua</Menu.Item>
                  <Menu.Item>Thịt Tôm</Menu.Item>
                </SubMenu>
                <Menu.Divider/>
                <SubMenu title="Độ khó">
                  <Menu.Item>Dễ</Menu.Item>
                  <Menu.Item>Vừa</Menu.Item>
                  <Menu.Item>Khó</Menu.Item>
                </SubMenu>
                <Menu.Divider/>
                <SubMenu title="Thời gian làm">
                  <Menu.Item>0-10 phút</Menu.Item>
                  <Menu.Item>10-30 phút</Menu.Item>
                  <Menu.Item>30-60 phút</Menu.Item>
                  <Menu.Item>Trên 60 phút</Menu.Item>
                </SubMenu>
              </Menu>
            }
          >
            <Button size="large" href="/recipe" type="link" icon="file-done">
              Công thức
            </Button>
          </Dropdown>

          <Button size="large" href="/blog" type="link" icon ="book">
            Blogs{" "}
          </Button>
          <Button size="large" type="link" icon ="shopping-cart">
            Bữa ăn đơn giản{" "}
          </Button>

          <Search
            placeholder="Nhập công thức muốn tìm kiếm"
            enterButton
            size="large"
          />
          {this.state.currentUser.sessionCheck ? (
            <>
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
                <a className="ant-dropdown-link" href="/profile">
                  <Avatar
                    src={this.state.currentUser.avatarUrl}
                    style={{ marginLeft: "6px" }}
                    size={45}
                  />
                </a>
              </Dropdown>
            </>
          ) : (
            <>
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
            </>
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
          <Route path="recipe"
          component={ShowRecipeScreen}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
