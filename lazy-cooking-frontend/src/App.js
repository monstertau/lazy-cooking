import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import { Button, Input, Menu, Dropdown, Avatar, Badge } from "antd";
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
import DetailUser from "./pages/DetailUser";
import logo from "../src/logo.png";
import ScrollUpButton from "react-scroll-up-button";

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
    searchData: [],
    height: window.innerHeight,
    width: window.innerWidth
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
        window.sessionStorage.removeItem("email");
        window.sessionStorage.removeItem("fullName");
        window.sessionStorage.removeItem("avatarUrl");
        window.sessionStorage.removeItem("id");
        window.location.href = "/";
        // clear fullname + email in state
      })
      .catch(error => {
        console.log(error);
      });
  };
  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
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
    window.addEventListener("resize", this.updateDimensions);
    
  }
  

  handleSearch = keyword => {
    if (keyword.trim().length === 0) {
      window.alert("Vui lòng nhập tên món ăn");
    } else {
      window.location.replace(`http://localhost:3000/search/${keyword}`);
    }
  };
  render() {
    return (
      <div>
        <ScrollUpButton />
        <div>
          {this.state.width > 1000 ? (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a href="/">
                <img
                  src={logo}
                  height={55}
                  width={200}
                  style={{ objectFit: "cover" }}
                  alt="logo"
                />
              </a>
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
                      <Menu.Item>
                        <a href="/recipe/khai-vi">Khai vị</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/giam-can">Giảm cân</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/mon-chay">Món chay</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/an-vat">Ăn vặt</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/banh">Bánh</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/mon-nhau">Món nhậu</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/an-kieng">Ăn kiêng</a>
                      </Menu.Item>
                    </SubMenu>
                    <Menu.Divider />
                    <SubMenu title="Nguyên liệu">
                      <Menu.Item>
                        <a href="/recipe/thit-ga">Thịt gà</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/thit-bo">Thịt bò</a>
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
                        <a href="/recipe/thit-tom">Thịt tôm</a>
                      </Menu.Item>
                      
                      <Menu.Item>
                        <a href="/recipe/sua">Sữa</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/tra-che-thach">Trà-Chè-Thạch</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/trai-cay">Trái Cây</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/trung">Trứng</a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href="/recipe/thuc-uong">Thức Uống</a>
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
              <Badge count={"Hot"} className="mr-4">
                <Button
                  size="large"
                  href="/simple-meal"
                  type="link"
                  icon="shopping-cart"
                >
                  Bữa ăn đơn giản{" "}
                </Button>
              </Badge>
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
          ) : (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="/">
                <img
                  src={logo}
                  height={55}
                  width={200}
                  style={{ objectFit: "cover" }}
                  alt="logo"
                />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/recipe/all"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Công thức
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <h6>
                        Thực đơn
                        <a className="dropdown-item" href="/recipe/bua-sang">
                          Bữa sáng
                        </a>
                        <a className="dropdown-item" href="/recipe/bua-trua">
                          Bữa trưa
                        </a>
                        <a className="dropdown-item" href="/recipe/bua-chieu">
                          Bữa chiều
                        </a>
                        <a className="dropdown-item" href="/recipe/khai-vi">
                          Khai vị
                        </a>
                        <a className="dropdown-item" href="/recipe/giam-can">
                          Giảm cân
                        </a>
                        <a className="dropdown-item" href="/recipe/mon-chay">
                          Món chay
                        </a>
                        <a className="dropdown-item" href="/recipe/an-vat">
                          Ăn vặt
                        </a>
                        <a className="dropdown-item" href="/recipe/banh">
                          Bánh
                        </a>
                        <a className="dropdown-item" href="/recipe/mon-nhau">
                          Món nhậu
                        </a>
                        <a className="dropdown-item" href="/recipe/an-kieng">
                          Ăn kiêng
                        </a>
                      </h6>
                      <div className="dropdown-divider"></div>
                      <h6>
                        Nguyên liệu
                        <a className="dropdown-item" href="/recipe/thit-ga">
                          Thịt gà
                        </a>
                        <a className="dropdown-item" href="/recipe/thit-bo">
                          Thịt bò
                        </a>
                        <a className="dropdown-item" href="/recipe/thit-lon">
                          Thịt lợn
                        </a>
                        <a className="dropdown-item" href="/recipe/thit-ca">
                          Thịt cá
                        </a>
                        <a className="dropdown-item" href="/recipe/thit-cua">
                          Thịt cua
                        </a>
                        <a className="dropdown-item" href="/recipe/thit-tom">
                          Thịt tôm
                        </a>
                      </h6>
                      <div className="dropdown-divider"></div>
                      <h6>
                        Độ khó
                        <a className="dropdown-item" href="/recipe/de">
                          Dễ
                        </a>
                        <a className="dropdown-item" href="/recipe/trung-binh">
                          Trung bình
                        </a>
                        <a className="dropdown-item" href="/recipe/kho">
                          Khó
                        </a>
                      </h6>
                      <div className="dropdown-divider"></div>
                      <h6>
                        Thời gian làm
                        <a className="dropdown-item" href="/recipe/duoi-10-phut">
                          Dưới 10 phút
                        </a>
                        <a className="dropdown-item" href="/recipe/10-den-30-phut">
                          10-30 phút
                        </a>
                        <a className="dropdown-item" href="/recipe/30-den-60-phut">
                          30-60 phút
                        </a>
                        <a className="dropdown-item" href="/recipe/tren-60-phut">
                          Trên 60 phút
                        </a>
                      </h6>
                    </div>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="/blog">
                      Blog
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/simple-meal">
                      Bữa ăn đơn giản
                    </a>
                  </li>
                </ul>
                <Search
                  placeholder="Nhập tên món ăn"
                  enterButton
                  size="large"
                  onSearch={this.handleSearch}
                  classNameName="mb-2"
                />
                {window.localStorage.getItem("email") ||
                window.sessionStorage.getItem("email") ? (
                  <>
                    <ul className="navbar-nav mr-auto">
                      <Button
                        icon="form"
                        style={{ marginLeft: "5px" }}
                        size="large"
                        href="/create-recipe"
                      >
                        Đăng công thức
                      </Button>

                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="navbarDropdown"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Welcome,{this.state.currentUser.fullName} !
                        </a>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="navbarDropdown"
                        >
                          <a className="dropdown-item" href={`/profile`}>
                            Profile
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item"
                            href={`/my-post/${this.state.currentUser.id}`}
                          >
                            Bài đăng của tôi
                          </a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" onClick={this.handleLogOut}>
                            Đăng xuất
                          </a>
                        </div>
                      </li>
                    </ul>
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
              </div>
            </nav>
          )}
        </div>

        <div classNameName="body-content mb-5">
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
            <Route
              path="/detailUser/:userId"
              exact={true}
              component={DetailUser}
            ></Route>
          </BrowserRouter>
        </div>
        <div classNameName="pt-5">
          <section id="footer">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <ul className="list-unstyled list-inline social text-center">
                    <li className="list-inline-item">
                      <a >
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a >
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a >
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a >
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a>
                        <i className="fa fa-envelope"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <hr />
              </div>
              <div className="row">
                <a
                  className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center"
                  href=""
                >
                  <img src={logo} style={{ height: 120, objectFit: "cover" }} />
                </a>
              </div>

              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
                  <p>
                    Lazy Cooking là một dự án phi lợi nhuận của 1 nhóm 3 bạn trẻ
                    với mục đích hướng tới những bữa ăn đơn giản, dễ làm, dễ
                    học, với mong muốn góp phần giúp các bạn trẻ có 1 bữa ăn
                    lành mạnh, tránh những bữa ăn ở ngoài hàng quán vừa không
                    đảm bảo vừa đắt đỏ
                  </p>
                  <p className="h6">
                    &copy; 2019 All right Reserved Lazy Cooking Team
                  </p>
                </div>
                <hr />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
}

export default App;
