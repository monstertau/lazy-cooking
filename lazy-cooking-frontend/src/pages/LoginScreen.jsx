import React, { Component } from "react";
import firebase from "firebase";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import "./LoginScreen.css";
import { Helmet } from "react-helmet";

const phoneRegex = /^\d{10}$/;
const config = {
  apiKey: "AIzaSyCkrqRgSiubYxCkhBCbWHPQ27-tm3VnE2Y",
  authDomain: "login-with-gg-fdb99.firebaseapp.com"
  // ...
};
firebase.initializeApp(config);

class LoginScreen extends Component {
  state = {
    email: "",
    password: "",
    fullName: "",
    phone: "",
    rememberMe: false,
    isError: false,
    message: "",
    isLogin: false,
    isRegisted: false
  };

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        email: user.email,
        fullName: user.displayName
      });
      fetch("http://localhost:3001/users/login-with-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.state.email
        }),
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.isRegisted === false) {
            this.setState({
              isRegisted: true
            });
          } else {
            this.setState({
              isRegisted: false
            });

            window.localStorage.setItem("email", data.data.email);
            window.localStorage.setItem("fullName", data.data.fullName);
            window.localStorage.setItem("avatarUrl", data.data.avatarUrl);
            window.localStorage.setItem("id", data.data.id);

            window.location.replace("http://localhost:3000/");
          }
        });
    });
  }

  componentWillMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          this.setState({
            isLogin: true
          });
        } else {
          this.setState({
            isLogin: false
          });
        }
      });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Mật khẩu xác nhận không khớp!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch("http://localhost:3001/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          }),
          credentials: "include"
        })
          .then(res => {
            return res.json();
          })
          .then(data => {
            //check mail exist
            if (data.message === "Email does not exist!") {
              this.setState({
                isError: true,
                message: "Email does not exist!"
              });
            } else if (data.message === "Wrong password!") {
              this.setState({
                isError: true,
                message: "Wrong password!"
              });
            } else {
              // save current user to localStorage
              if (values.remember === true) {
                window.localStorage.setItem("email", data.data.email);
                window.localStorage.setItem("fullName", data.data.fullName);
                window.localStorage.setItem("avatarUrl", data.data.avatarUrl);
                window.localStorage.setItem("id", data.data.id);
              } else {
                window.sessionStorage.setItem("email", data.data.email);
                window.sessionStorage.setItem("fullName", data.data.fullName);
                window.sessionStorage.setItem("avatarUrl", data.data.avatarUrl);
                window.sessionStorage.setItem("id", data.data.id);
              }
              //redirect to home page
              window.location.replace("http://localhost:3000/");
            }
          })
          .catch(error => {
            if (error) {
              console.log(error);
              window.alert(error.message);
            }
          });
      }
    });
  };

  handleInput = () => {
    this.setState({
      isError: false
    });
  };
  handleRememberMe = () => {
    this.setState({
      rememberMe: !this.state.rememberMe
    });
  };

  handleGGLogin = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
        return;
      })
      .catch(function(error) {
        // Handle Errors here.
        
      });
  };

  handleSubmitGGRegister = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch("http://localhost:3001/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            fullName: values.fullName,
            phone: values.phone
          }),
          credentials: "include"
        })
          .then(res => {
            return res.json();
          })
          .then(data => {
            //check mail exist
            if (!data.success) {
              this.setState({
                isError: true,
                message: data.message
              });
            } else {
              //login and redirect to home
              fetch("http://localhost:3001/users/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  email: values.email,
                  password: values.password
                }),
                credentials: "include"
              })
                .then(res => {
                  return res.json();
                })
                .then(data => {
                  // save current user to localStorage
                  if (values.remember === true) {
                    window.localStorage.setItem("email", data.data.email);
                    window.localStorage.setItem("fullName", data.data.fullName);
                    window.localStorage.setItem(
                      "avatarUrl",
                      data.data.avatarUrl
                    );
                    window.localStorage.setItem("id", data.data.id);
                  } else {
                    window.sessionStorage.setItem("email", data.data.email);
                    window.sessionStorage.setItem(
                      "fullName",
                      data.data.fullName
                    );
                    window.sessionStorage.setItem(
                      "avatarUrl",
                      data.data.avatarUrl
                    );
                    window.sessionStorage.setItem("id", data.data.id);
                  }
                  //redirect to home page
                  window.location.replace("http://localhost:3000/");
                })
                .catch(error => {
                  if (error) {
                    console.log(error);
                    window.alert(error.message);
                  }
                });
            }
          })
          .catch(error => {
            if (error) {
              console.log(error);
              window.alert(error.message);
            }
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    return (
      <div>
        <Helmet>
          <title>Đăng nhập</title>
        </Helmet>
        {this.state.isRegisted ? (
          //login gg if it is the first time
          <div className="container">
            <div className="row mt-2">
              <div className="col-2"></div>
              <div className="col-8 get-in-touch login">
                <div className="text-center mb-5">
                  <h3 className="title-login" {...formItemLayout}>
                    Lần đầu đăng nhập
                  </h3>
                </div>
                <Form
                  {...formItemLayout}
                  onSubmit={this.handleSubmitGGRegister}
                  layout="vertical"
                >
                  <Form.Item label="E-mail">
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          type: "email",
                          message: "Email không hợp lệ!"
                        },
                        {
                          required: true,
                          message: "Vui lòng điền Email!"
                        }
                      ],
                      initialValue: this.state.email
                    })(<Input onChange={this.handleInput} />)}
                  </Form.Item>
                  <Form.Item label="Mật khẩu" hasFeedback>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng điền mật khẩu!"
                        },
                        {
                          validator: this.validateToNextPassword
                        },
                        {
                          min: 6,
                          message: "Mật khẩu bao gồm ít nhất 6 ký tự!"
                        }
                      ]
                    })(<Input.Password onChange={this.handleInput} />)}
                  </Form.Item>
                  <Form.Item label="Xác nhận mật khẩu" hasFeedback>
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu!"
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(
                      <Input.Password
                        onBlur={this.handleConfirmBlur}
                        onChange={this.handleInput}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<span>Tên đầy đủ</span>}>
                    {getFieldDecorator("fullName", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng điền họ tên đầy đủ của bạn!",
                          whitespace: true
                        }
                      ],
                      initialValue: this.state.fullName
                    })(<Input onChange={this.handleInput} />)}
                  </Form.Item>
                  <Form.Item label="Số điện thoại">
                    {getFieldDecorator("phone", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng điền số điện thoại của bạn!"
                        },
                        {
                          pattern: phoneRegex,
                          message: "Số điện thoại bao gồm chính xác 10 chữ số!"
                        }
                      ]
                    })(<Input onChange={this.handleInput} />)}
                  </Form.Item>
                  {this.state.isError ? (
                    <Form.Item {...tailFormItemLayout}>
                      <h6 className="label-error">{this.state.message}</h6>
                    </Form.Item>
                  ) : null}
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Lưu
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        ) : (
          // normal loggin
          <div>
            {this.state.isLogin ? (
              window.location.replace("http://localhost:3000/")
            ) : (
              <div className="container">
                <div className="row mt-2">
                  <div className="col-3"></div>
                  <div className="col-6 get-in-touch">
                    <div className="text-center">
                      <h3 className="title-login">Đăng nhập</h3>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                      <Form.Item>
                        {getFieldDecorator("email", {
                          rules: [
                            { required: true, message: "Vui lòng điền Email!" },
                            { type: "email", message: "Email không hợp lệ!" }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="user"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            placeholder="Email"
                            onChange={this.handleInput}
                          />
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator("password", {
                          rules: [
                            {
                              required: true,
                              message:
                                "Vui Lòng nhập mật khẩu lớn hơn 6 ký tự!",
                              min: 6
                            }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            type="password"
                            placeholder="Mật khẩu"
                            onChange={this.handleInput}
                          />
                        )}
                      </Form.Item>
                      {this.state.isError ? (
                        <div className="form-field col-lg-12 mt-0">
                          <h6 className="label-error">{this.state.message}</h6>
                        </div>
                      ) : null}
                      <Form.Item>
                        {getFieldDecorator("remember", {
                          valuePropName: "checked",
                          initialValue: true
                        })(<Checkbox>Ghi nhớ tôi</Checkbox>)}
                        <br />
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          block
                        >
                          Đăng nhập
                        </Button>
                        Hoặc <a href="/Register">Đăng ký ngay!</a>
                      </Form.Item>
                    </Form>
                    <div>
                      <Button block type="danger" onClick={this.handleGGLogin}>
                        <Icon type="google" /> Đăng nhập với tài khoản Google
                      </Button>
                    </div>
                  </div>
                  <div className="col-3"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const WrappedLoginScreen = Form.create({ name: "validate_other" })(LoginScreen);

export default WrappedLoginScreen;
