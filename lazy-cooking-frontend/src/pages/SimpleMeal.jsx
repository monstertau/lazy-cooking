import React, { Component } from "react";
import { Carousel } from "antd";
import "./SimpleMeal.css";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Rate,
  Row,
  Col,
  Empty,
  Avatar,
  Card,
  Icon,
  List
} from "antd";
import "antd/dist/antd.css";
import { foodArr, typeArr } from "./data";
import {Helmet} from "react-helmet";
const { Option } = Select;
const { Meta } = Card;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class Meal extends Component {
  state = {
    foods: foodArr,
    types: typeArr,
    data: [],
    loading: false,
    height: window.innerHeight,
    width: window.innerWidth
  };
  ChangeToSlug = item => {
    let str = item.toLowerCase(); // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    str = str.replace(/(đ)/g, "d"); // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, ""); // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, "-"); // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, ""); // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, ""); // return
    return str;
  };
  arrayToString = (array1, array2) => {
    let tempString = "";
    for (let i = 0; i < array1.length - 1; i++) {
      tempString = tempString.concat(
        "slug=" + this.ChangeToSlug(array1[i]) + "&"
      );
    }

    tempString = tempString.concat(
      "slug=" + this.ChangeToSlug(array1[array1.length - 1]) + "&"
    );
    for (let i = 0; i < array2.length - 1; i++) {
      tempString = tempString.concat(
        "slug=" + this.ChangeToSlug(array2[i]) + "&"
      );
    }

    tempString = tempString.concat(
      "slug=" + this.ChangeToSlug(array2[array2.length - 1])
    );
    return tempString;
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((error, data) => {
      if (!error) {
        this.setState({
          loading: true
        });
      }
      console.log(data);
      const slugStr = this.arrayToString(data.materials, data.category);
      console.log(slugStr);
      fetch(
        `http://localhost:3001/posts/simpleMeal?${slugStr}&level=${data.level}&timetodone=${data.timetodone}`,
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
          if (data.success === true) {
            this.setState({
              data: data.data,
              loading: false
            });
          }
        })
        .catch(error => {
          throw error;
        });
    });
  };
  componentDidMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          window.localStorage.removeItem("email");
          window.localStorage.removeItem("fullName");
          window.localStorage.removeItem("avatarUrl");
          window.localStorage.removeItem("id");
          window.sessionStorage.removeItem("email");
          window.sessionStorage.removeItem("fullName");
          window.sessionStorage.removeItem("avatarUrl");
          window.sessionStorage.removeItem("id");
          window.location.assign(`http://localhost:3000/login`);
        }
      })
      .catch(error => {
        throw error;
      });
      window.addEventListener("resize", this.updateDimensions);
  }
  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  };
  render() {
    const foodItems = this.state.foods.map((item, key) => (
      <Option value={item}>{item}</Option>
    ));

    const typeItems = this.state.types.map((item, key) => (
      <Option value={item}>{item}</Option>
    ));

    const { getFieldDecorator } = this.props.form;

    return (
      <div className=" pt-3 pb-3" style={{marginLeft:'10%',marginRight:'10%'}}>
        <Carousel autoplay>
            <div className="intro">
              <img
                src="https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,h_594,q_60,w_1900/private-chef-385_1900x594_mueghs"
                className="imageCarousel simple-meal-image"
              />
            </div>
          </Carousel>
        <div className="mt-4">
        <Helmet >
          <title>Bữa ăn đơn giản</title>
        </Helmet>
        <div className="text-center">
            <h3 className="title-login">Tìm bữa ăn đơn giản</h3>
          </div>
        <Form className={this.state.width > 1000?"ant-advanced-search-form":""} onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Chọn nguyên liệu" hasFeedback>
                {getFieldDecorator("materials", {
                  rules: [
                    {
                      required: true,
                      message: "Hãy chọn nguyên liệu!",
                      type: "array"
                    }
                  ]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Hãy chọn nguyên liệu tìm thấy ở trong tủ của bạn!"
                  >
                    {foodItems}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chọn kiểu thực đơn" hasFeedback>
                {getFieldDecorator("category", {
                  rules: [
                    {
                      required: true,
                      message: "Hãy chọn kiểu thực đơn!",
                      type: "array"
                    }
                  ]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Bấm vào để chọn kiểu công thức"
                  >
                    {typeItems}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Độ khó:">
                {getFieldDecorator("level", {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: "Hãy chọn độ khó cho món ăn của bạn!"
                    }
                  ]
                })(<Rate count={2} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian làm dự kiến:"
                extra="Thời gian làm nhiều nhất là 30 phút!"
              >
                {getFieldDecorator("timetodone", {
                  initialValue: 1,
                  rules: [
                    { required: true, message: "Hãy chọn thời gian làm!" }
                  ]
                })(<InputNumber min={1} max={30} />)}
                <span className="ant-form-text"> Phút</span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              Tìm Bữa Ăn
            </Button>
          </Form.Item>
        </Form>
        </div>

        
        {this.state.data.length > 0 ? (
          <>
            <div className="mt-3 mb-2">
              Hiển thị {this.state.data.length} bữa ăn dành cho bạn
            </div>
            <List
            className="login"
              grid={{
                gutter: 16,
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
                      style={{ }}
                      cover={
                        <img
                          alt="example"
                          src={item.imageUrl}
                          width="100"
                          height="255"
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
          </>
        ) : (
          <>
            <div className="mt-4">
              Hiển thị 0 bữa ăn dành cho bạn
              <Empty />
            </div>
          </>
        )}
      </div>
    );
  }
}
const SimpleMeal = Form.create({ name: "simplemeal" })(Meal);
export default SimpleMeal;
