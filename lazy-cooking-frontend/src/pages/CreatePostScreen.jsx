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
import CKEditor from "ckeditor4-react";
import "antd/dist/antd.css";
import { foodArr, typeArr } from "./data";
import { Helmet } from "react-helmet";
const { Option } = Select;
CKEditor.editorUrl = "http://localhost:3000/ckeditor/ckeditor.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
class CreatePostScreen extends React.Component {
  state = {
    foods: foodArr,
    types: typeArr,
    imageFile: undefined,
    loading: false,
    materialSlug: [],
    categorySlug: [],
    levelSlug: "",
    timeSlug: "",
    content: "",
    imageUrl: ""
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

  onEditorChange = e => {
    console.log(e.editor.getData());
    this.setState({
      content: e.editor.getData()
    });
  };
  onChange = editorState => this.setState({ editorState });
  handleLevelChange = value => {
    console.log(value);
    if (value === 1 || value === 2 || value === 0) {
      this.setState({
        levelSlug: "de"
      });
    } else if (value === 3 || value === 4) {
      this.setState({
        levelSlug: "trung-binh"
      });
    } else {
      this.setState({
        levelSlug: "kho"
      });
    }
  };
  handleTimeChange = value => {
    console.log(value);
    if (value <= 10) {
      this.setState({
        timeSlug: "duoi-10-phut"
      });
    } else if (value <= 30) {
      this.setState({
        timeSlug: "10-den-30-phut"
      });
    } else if (value <= 60) {
      this.setState({
        timeSlug: "30-den-60-phut"
      });
    } else {
      this.setState({
        timeSlug: "tren-60-phut"
      });
    }
  };
  handleCategoryChange = value => {
    console.log(value);
    const array = [];
    value.forEach(i => {
      const slugging = this.ChangeToSlug(i);
      array.push(slugging);
    });
    this.setState({
      categorySlug: array
    });
  };
  handleFoodChange = value => {
    console.log(value);
    const array = [];
    value.forEach(i => {
      const slugging = this.ChangeToSlug(i);
      array.push(slugging);
    });
    this.setState({
      materialSlug: array
    });
  };
  enterLoading = () => {
    this.setState({ loading: true });
  };
  handleImageChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      console.log(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageFile: info.file.originFileObj,
          imageUrl,
          loading: false
        })
      );
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
        data.slug = this.state.categorySlug.concat(this.state.materialSlug);
        data.slug = data.slug.concat(this.state.levelSlug);
        data.slug = data.slug.concat(this.state.timeSlug);
        data.content = this.state.content;
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
                timetodone: data.timetodone,
                slug: data.slug,
                type:data.type
              })
            })
              .then(res => res.json())
              .then(data1 => {
                console.log(data1);
                if (data1.success) {
                  if (window.localStorage.getItem("id")) {
                    window.location.href = `/my-post/${window.localStorage.getItem(
                      "id"
                    )}`;
                  } else {
                    window.location.href = `/my-post/${window.sessionStorage.getItem(
                      "id"
                    )}`;
                  }
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
  componentDidMount() {
    fetch("http://localhost:3001/users/check-session", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          window.location.assign(`http://localhost:3000/login`);
        }
      })
      .catch(error => {
        throw error;
      });
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
      <div className="container mt-3 mb-5">
        <Helmet>
          <title>Tạo công thức</title>
        </Helmet>
        <div className="text-center">
          <h3 className="title-login">Tạo công thức</h3>
        </div>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          layout="horizontal"
          className="login"
        >
          <Form.Item label="Tiêu đề">
            {getFieldDecorator("title", {
              rules: [{ required: true, message: "Please input your title!" }]
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
                  message: "Please select your food!",
                  type: "array"
                }
              ]
            })(
              <Select
                mode="multiple"
                placeholder="Bấm vào để chọn nguyên liệu"
                onChange={this.handleFoodChange}
              >
                {foodItems}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Chọn kiểu công thức" hasFeedback>
            {getFieldDecorator("category", {
              rules: [
                {
                  required: true,
                  message: "Hãy chọn kiểu công thức!",
                  type: "array"
                }
              ]
            })(
              <Select
                mode="multiple"
                placeholder="Bấm vào để chọn kiểu công thức"
                onChange={this.handleCategoryChange}
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
            })(<Rate onChange={this.handleLevelChange} />)}
          </Form.Item>

          <Form.Item label="Thời gian làm:">
            {getFieldDecorator("timetodone", {
              initialValue: 1,
              rules: [{ required: true, message: "Hãy chọn thời gian làm!" }]
            })(<InputNumber min={1} onChange={this.handleTimeChange} />)}
            <span className="ant-form-text"> Phút</span>
          </Form.Item>

          <Form.Item label="Ảnh ví dụ" extra="kích thước tối đa 2mb">
            {getFieldDecorator("fileupload", {
              valuePropName: "fileList",
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: "Hãy chọn ảnh ví dụ!" }]
            })(
              <Upload
                name="logo"
                customRequest={this.dummyRequest}
                listType="picture-card"
                beforeUpload={this.beforeUpload}
                accept=".png, .jpg,.jpeg"
                onChange={this.handleImageChange.bind(this)}
                showUploadList={false}
              >
                {this.state.imageUrl ? (
                  <img
                    src={this.state.imageUrl}
                    alt="upload"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="Blog/ Công thức " hasFeedback>
            {getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "Hãy chọn dạng bài viết!",
                  
                }
              ]
            })(
              <Select placeholder="Bấm vào để chọn dạng bài viết">
                <Option value="Công thức">Công thức</Option>
                <Option value="Blog">Blog</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nội dung ">
            {getFieldDecorator("content", {
              rules: [{ required: true, message: "Please input your content!" }]
            })(
              <CKEditor
                onChange={this.onEditorChange}
                config={{
                  height: "700",

                  toolbarGroups: [
                    {
                      name: "document",
                      groups: ["mode", "document", "doctools"]
                    },
                    { name: "clipboard", groups: ["clipboard", "undo"] },
                    {
                      name: "editing",
                      groups: ["find", "selection", "spellchecker", "editing"]
                    },
                    { name: "forms", groups: ["forms"] },
                    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
                    {
                      name: "paragraph",
                      groups: [
                        "list",
                        "indent",
                        "blocks",
                        "align",
                        "bidi",
                        "paragraph"
                      ]
                    },
                    { name: "links", groups: ["links"] },
                    { name: "insert", groups: ["insert"] },
                    { name: "styles", groups: ["styles"] },
                    { name: "colors", groups: ["colors"] },
                    { name: "tools", groups: ["tools"] },
                    { name: "others", groups: ["others"] },
                    { name: "about", groups: ["about"] }
                  ],
                  removeButtons:
                    "NewPage,Preview,Print,Templates,Save,Source,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Image,Flash,PageBreak,Iframe,About"
                }}
              />
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              // loading={this.state.loading}
              onClick={this.enterLoading}
            >
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
