import React from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Upload,
  Icon,
  Rate,
  Input,
  message
} from "antd";
import "antd/dist/antd.css";
const { Option } = Select;
const { TextArea } = Input;
const foodArr = ["Thịt Lợn", "Thịt Bò", "Thịt Gà"];
const typeArr = ["Bữa sáng", "Bữa trưa", "Bữa chiều"];
class CreatePostScreen extends React.Component {
  state = {
    foods: foodArr,
    types: typeArr,
    imageFile: undefined,
    loading: false,
  };
  enterLoading = () => {
    this.setState({ loading: true });
  };
  handleImageChange = event => {
    // event.preventDefault();
    // event.stopPropagation();
    if (event.file.status === "done") {
      const imageFile = event.file.originFileObj;
      // console.log(imageFile);
      if (imageFile) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile);
        fileReader.onloadend = data => {
          this.setState({
            imageFile: imageFile
          });
          // console.log(this.state);
        };
      }
    } else if (event.file.status === "removed") {
      this.setState({
        imageFile: ""
      });
      // console.log(this.state);
    }
  };
  dummyRequest({ file, onSuccess }) {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }
  beforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, data) => {
      if (!err) {
        console.log(data);
        const formData = new FormData();
        formData.append("image", this.state.imageFile);
        fetch(`http://localhost:3001/posts/image`, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          body: formData
        })
          .then(res => {
            return res.json();
          })
          .then(info => {
            console.log(info);
            fetch("http://localhost:3001/posts/create", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                content: data.content,
                title: data.title,
                imageUrl: info.data.imageUrl,
                category: data.category,
                materials: data.materials,
                level: data.level,
                timetodone: data.timetodone
              })
            })
              .then(res => res.json())
              .then(data1 => {
                console.log(data1);
                if(data1.success){
                  window.location.href = `/my-post/${window.localStorage.getItem('id')}`
                }
              });
          })
          .catch(error => {
            throw error;
          });
      } else {
        throw err;
      }
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      console.log(e);
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const foodItems = this.state.foods.map((item, key) => (
      <Option value={item}>{item}</Option>
    ));

    const typeItems = this.state.types.map((item, key) => (
      <Option value={item}>{item}</Option>
    ));

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    return (
      <div className="container" style={{ marginTop: "20px" }}>
        <h3>Tạo công thức</h3>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Tiêu đề">
            {getFieldDecorator("title", {
              rules: [{ required: true, message: "Please input your title!" },{
                max:50, message:"Title is below 50 characters"
              }]
            })(
              <Input
                prefix={
                  <Icon type="container" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Tiêu đề"
              />
            )}
          </Form.Item>

          <Form.Item label="Chọn nguyên liệu" hasFeedback>
            {getFieldDecorator("materials", {
              rules: [
                {
                  required: true,
                  message: "Please select your favourite colors!",
                  type: "array"
                }
              ]
            })(
              <Select mode="multiple" placeholder="Bấm vào để chọn nguyên liệu">
                {foodItems}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Chọn kiểu công thức" hasFeedback>
            {getFieldDecorator("category", {
              rules: [
                {
                  required: true,
                  message: "Please select your favourite colors!",
                  type: "array"
                }
              ]
            })(
              <Select
                mode="multiple"
                placeholder="Bấm vào để chọn kiểu công thức"
              >
                {typeItems}

                {/* <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option> */}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Độ khó">
            {getFieldDecorator("level", {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "Hãy chọn độ khó cho món ăn của bạn!"
                }
              ]
            })(<Rate />)}
          </Form.Item>

          <Form.Item label="Thời gian làm:">
            {getFieldDecorator("timetodone", {
              initialValue: 1,
              rules: [{ required: true, message: "Hãy chọn thời gian làm!" }]
            })(<InputNumber min={1} />)}
            <span className="ant-form-text"> Phút</span>
          </Form.Item>

          <Form.Item label="Ảnh ví dụ" extra="kích thước tối đa 2mb">
            {getFieldDecorator("fileupload", {
              valuePropName: "fileList",
              getValueFromEvent: this.normFile
            })(
              <Upload
                name="logo"
                customRequest={this.dummyRequest}
                listType="picture"
                beforeUpload={this.beforeUpload}
                accept=".png, .jpg"
                onChange={this.handleImageChange.bind(this)}
                onRemove={this.handleImageRemove}
              >
                <Button>
                  <Icon type="upload" /> Bấm để tải ảnh
                </Button>
              </Upload>
            )}
          </Form.Item>

          <Form.Item label="Nội dung ">
            {getFieldDecorator("content", {
              rules: [{ required: true, message: "Please input your content!" },]
            })(
              <TextArea
                rows={30}
                prefix={
                  <Icon type="container" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Điền nội dung vào đây (ghi rõ các bước)"
              />
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit" loading ={this.state.loading} onClick={this.enterLoading}>
              Đăng bài
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const WrappedCreatePostScreen = Form.create({ name: "validate_other" })(
  CreatePostScreen
);
export default WrappedCreatePostScreen;
