import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { Helmet } from "react-helmet";
const phoneRegex = /^\d{10}$/;

class RegisterScreen extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    isError: false,
    message: "",
    confirmDirty: false,
    autoCompleteResult: []
  };
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

    this.props.form.validateFieldsAndScroll((err, values) => {
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

  handleInput = () => {
    this.setState({
      isError: false
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
      <div className="container">
        <Helmet>
          <title>Đăng kí</title>
        </Helmet>
        <div className="row mt-2">
          <div className="col-2"></div>
          <div className="col-8 get-in-touch">
            <div className="text-center mb-5">
              <h3 className="title-login" {...tailFormItemLayout}>
                Đăng ký
              </h3>
            </div>
            <Form
              {...formItemLayout}
              onSubmit={this.handleSubmit}
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
                  ]
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
                  ]
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
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    );
  }
}

const WrappedRegisterScreen = Form.create({ name: "register" })(RegisterScreen);

export default WrappedRegisterScreen;
