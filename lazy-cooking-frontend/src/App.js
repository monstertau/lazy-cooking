import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import "./App.css";
import "antd/dist/antd.css";
import { Button, Input, Menu, Dropdown, Icon, Avatar } from "antd";
import HomeScreen from "./pages/HomeScreen";
import WrappedLoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import WrappedRegistrationForm from "./pages/Profile";
import WrappedCreatePostScreen from "./pages/CreatePostScreen";
import Blog from "./pages/Blog";
import MyPostScreen from "./pages/MyPostScreen";
import DetailPostScreen from "./pages/DetailPostScreen";
import ShowRecipeScreen from "./pages/ShowRecipeScreen";
import SimpleMeal from "./pages/SimpleMeal";
import SearchScreen from "./pages/SearchScreen";
import EditPostScreen from "./pages/EditPostScreen";
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
    },
    keyword: "",
    isSearch: false,
    searchData: []
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
    // fetch("http://localhost:3001/users/check-session", {
    //   method: "GET",
    //   credentials: "include"
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.success === true) {

    //     } else {
    //       console.log(data);
    //       window.localStorage.removeItem("email");
    //       window.localStorage.removeItem("fullName");
    //       window.localStorage.removeItem("avatarUrl");
    //       window.localStorage.removeItem("id");
    //       window.sessionStorage.removeItem("email");
    //       window.sessionStorage.removeItem("fullName");
    //       window.sessionStorage.removeItem("avatarUrl");
    //       window.sessionStorage.removeItem("id");
    //     }
    //   })
    //   .catch(error => {
    //     throw error;
    //   });
  }
  // checkSession = e =>{
  //   e.preventDefault();

  // }

  handleSearch = keyword => {
    if (keyword.trim().length === 0) {
      window.alert("Vui lòng nhập tên món ăn");
    } else {
      window.location.replace(`http://localhost:3000/search/${keyword}`);
    }
  };
  render() {
    // console.log(this.state);
    return (
      <div>
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
                    <Menu.Item>
                      <a href="/recipe/bua-sang">Bữa sáng</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/bua-trua">Bữa trưa</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/bua-chieu">Bữa chiều</a>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Divider />
                  <SubMenu title="Nguyên liệu">
                    <Menu.Item>
                      <a href="/recipe/thit-ga">Thịt gà</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/thit-bo">Thịt gà</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/thit-lon">Thịt lợn</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/thit-ca">Thịt cá</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/thit-cua">Thịt cua</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/thit-tom">Thịt gà</a>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Divider />
                  <SubMenu title="Độ khó">
                    <Menu.Item>
                      <a href="/recipe/de">Dễ</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/trung-binh">Trung bình</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/kho">Khó</a>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Divider />
                  <SubMenu title="Thời gian làm">
                    <Menu.Item>
                      <a href="/recipe/duoi-10-phut">Dưới 10 phút</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/10-den-30-phut">10-30 phút</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/30-den-60-phut">30-60 phút</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="/recipe/tren-60-phut">Trên 60 phút</a>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              }
            >
              <Button
                size="large"
                href="/recipe/all"
                type="link"
                icon="file-done"
              >
                Công thức
              </Button>
            </Dropdown>

            <Button size="large" href="/blog" type="link" icon="book">
              Blogs{" "}
            </Button>
            <Button
              size="large"
              href="/simple-meal"
              type="link"
              icon="shopping-cart"
            >
              Bữa ăn đơn giản{" "}
            </Button>

            <Search
              placeholder="Nhập tên món ăn"
              enterButton
              size="large"
              onSearch={this.handleSearch}
            />
            {window.localStorage.getItem("email") ||
            window.sessionStorage.getItem("email") ? (
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
                <Button
                  size="large"
                  type="danger"
                  icon="logout"
                  href="/register"
                >
                  Đăng kí
                </Button>
              </>
            )}
          </nav>
        </div>

        <BrowserRouter>
          <Route path="/" exact={true} component={HomeScreen} />
          <Route path="/login" exact={true} component={WrappedLoginScreen} />
          <Route path="/register" exact={true} component={RegisterScreen} />
          <Route path="/search/:keyword" component={SearchScreen} />
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
          <Route
            path="/recipe/:type"
            exact={true}
            component={ShowRecipeScreen}
          />
          <Route path="/simple-meal" exact={true} component={SimpleMeal} />
          <Route
            path="/edit-post/:postId"
            exact={true}
            component={EditPostScreen}
          />
        </BrowserRouter>
        <div>
          <footer class="footer-area">
            <div class="container h-100">
              <div class="row h-100">
                <div class="col-12 h-100 d-flex flex-wrap align-items-center justify-content-between">
                  <div class="footer-logo">
                    {/* <a href="/">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQL6yfKuQ2S9MSqQ9w8DKTlR0SKin-aezRXgVjZgBJ4wcaKdZO"
                        alt=""
                        height="100"
                      ></img>
                    </a> */}
                  </div>
                  <p>
                    Copyright &copy;
                    <script>document.write(new Date().getFullYear());</script>{" "}
                    All rights reserved | Copyright by Lazy Cooking Team
                    Team
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
