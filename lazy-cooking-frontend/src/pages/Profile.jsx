import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,




  Button,


  Upload,
  message,
} from 'antd';
import {Helmet} from "react-helmet";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    fullName: '',
    email: '',
    phone: 0,
    avatarUrl: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_640.png',
    loading: false,
    avatarFile: undefined,
    load: false,
    pass:'',
    height: window.innerHeight,
      width: window.innerWidth
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, avatarUrl =>
        this.setState({
          avatarFile: info.file.originFileObj,
          avatarUrl,
          loading: false,
        }),
      );
    }
  }
  componentDidMount() {
    fetch('http://localhost:3001/users/check-session', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data.success) {
          window.localStorage.removeItem('email');
          window.localStorage.removeItem('fullName');
          window.localStorage.removeItem('avatarUrl');
          window.localStorage.removeItem('id');
          window.sessionStorage.removeItem('email');
          window.sessionStorage.removeItem('fullName');
          window.sessionStorage.removeItem('avatarUrl');
          window.sessionStorage.removeItem('id');
          window.location.assign(`http://localhost:3000/login`);
        }
        else {
          const id = window.localStorage.getItem('id');
          if (id) {
            fetch(`http://localhost:3001/users/profile/${id}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                console.log(data);
                this.setState({
                  fullName: data.data.fullName,
                  email: data.data.email,
                  phone: data.data.phone,
                  avatarUrl: data.data.avatarUrl
                })
              })
          }
          else {
            fetch(`http://localhost:3001/users/profile/${window.sessionStorage.getItem('id')}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                console.log(data);
                this.setState({
                  fullName: data.data.fullName,
                  email: data.data.email,
                  phone: data.data.phone,
                  avatarUrl: data.data.avatarUrl
                })
              })
          }
        }
      })
      .catch(error => { throw (error) })
      window.addEventListener("resize", this.updateDimensions);
  }
  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  };
  handleChangeEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }
  handlePassWord = (event)=>{
    this.setState({
      pass : event.target.value
    })
  }
  handleChangeFullName = (event) => {
    this.setState({
      fullName: event.target.value
    })
  }
  handlePhone = (event) => {
    this.setState({
      phone: event.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      load: true
    })
    if (this.state.avatarFile) {
      const formData = new FormData();
      formData.append('avatar', this.state.avatarFile);
      fetch(`http://localhost:3001/users/avatar`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data.data.imageUrl);
          if (window.localStorage.getItem('id')) {
            fetch(`http://localhost:3001/users/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                id: window.localStorage.getItem('id'),
                fullName: this.state.fullName,
                phone: this.state.phone,
                email: this.state.email,
                avatarUrl: data.data.imageUrl,
                pass : this.state.pass
              })
            })
              .then((res) => {
                return res.json();
              })
              .then((data2) => {
                console.log(data2);
                if (data2.success) {
                  this.setState({
                    load: false
                  })
                  window.localStorage.setItem('email', this.state.email);
                  window.localStorage.setItem('fullName', this.state.fullName);
                  window.localStorage.setItem('avatarUrl', data.data.imageUrl);
                  window.location.reload();
                }
                else {
                  this.setState({
                    load: false
                  })
                  message.error(data2.message);
                }
              })
          }
          else {
            fetch(`http://localhost:3001/users/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                id: window.sessionStorage.getItem('id'),
                fullName: this.state.fullName,
                phone: this.state.phone,
                email: this.state.email,
                avatarUrl: data.data.imageUrl,
                pass: this.state.pass
              })
            })
              .then((res) => {
                return res.json();
              })
              .then((data2) => {
                console.log(data2);
                if (data2.success) {
                  this.setState({
                    load: false
                  })
                  window.sessionStorage.setItem('email', this.state.email);
                  window.sessionStorage.setItem('fullName', this.state.fullName);
                  window.sessionStorage.setItem('avatarUrl', data.data.imageUrl);
                  window.location.reload();
                }
                else {
                  this.setState({
                    load: false
                  })
                  message.error(data2.message);
                }
              })
          }
        })
    }
    else {
      if (window.localStorage.getItem('id')) {
        fetch(`http://localhost:3001/users/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: window.localStorage.getItem('id'),
            fullName: this.state.fullName,
            phone: this.state.phone,
            email: this.state.email,
            avatarUrl: this.state.avatarUrl,
            pass : this.state.pass
          })
        })
          .then((res) => {
            return res.json();
          })
          .then((data2) => {
            console.log(data2);
            if (data2.success) {
              this.setState({
                load: false
              })
              window.localStorage.setItem('email', this.state.email);
              window.localStorage.setItem('fullName', this.state.fullName);
              window.location.reload();
            }
            else {
              this.setState({
                load: false
              })
              message.error(data2.message);
            }
          })
      }
      else {
        fetch(`http://localhost:3001/users/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: window.sessionStorage.getItem('id'),
            fullName: this.state.fullName,
            phone: this.state.phone,
            email: this.state.email,
            avatarUrl: this.state.avatarUrl,
            pass : this.state.pass
          })
        })
          .then((res) => {
            return res.json();
          })
          .then((data2) => {
            console.log(data2);
            if (data2.success) {
              this.setState({
                load: false
              })
              window.sessionStorage.setItem('email', this.state.email);
              window.sessionStorage.setItem('fullName', this.state.fullName);
              window.location.reload();
            }
            else {
              this.setState({
                load: false
              })
              message.error(data2.message);
            }
          })
      }
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {  avatarUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };


    return (
      <div className="container  mt-3">
        <Helmet>
          <title>Chỉnh sửa trang cá nhân</title>
        </Helmet>
        <div className="text-center">
          <h3 className="title-login">Chỉnh sửa trang cá nhân</h3>
        </div >
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login mt-3">

          <div style={{ marginLeft: this.state.width > 1000?"600px":"" }}>
            <Upload
              style={{ height: "120px" }}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </div>

          <Form.Item label="E-mail">

            {getFieldDecorator('email', {
              valuePropName: 'value',
              initialValue: this.state.email,
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input onChange={this.handleChangeEmail} disabled/>)}
          </Form.Item>
          <Form.Item label="Đổi mật khẩu" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password onChange={this.handlePassWord} />)}
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                Tên đầy đủ&nbsp;
                <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('nickname', {
              valuePropName: 'value',
              initialValue: this.state.fullName,
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(<Input onChange={this.handleChangeFullName} />)}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', {
              valuePropName: 'value',
              initialValue: this.state.phone,
              rules: [{ required: true, message: 'Please input your phone number!' }],
            })(<Input style={{ width: '100%' }} onChange={this.handlePhone} />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button loading={this.state.load} type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
export default WrappedRegistrationForm;