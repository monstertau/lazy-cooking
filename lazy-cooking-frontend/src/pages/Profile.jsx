import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Avatar,
  Upload,
  message,
} from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
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
    avatarUrl: '',
    loading: false,
    emailOld: window.localStorage.getItem('email'),
    avatarFile: undefined
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
    fetch(`http://localhost:3001/users/profile/${window.localStorage.getItem('id')}`, {
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
  handleChangeEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }
  handleChangePass = (event) => {
    this.setState({
      repeatPass: event.target.value
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
    const formData = new FormData();
    formData.append('avatar', this.state.avatarFile);
    console.log(formData);
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
        fetch(`http://localhost:3001/users/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
              id : window.localStorage.getItem('id'),
              fullName: this.state.fullName,
              phone : this.state.phone,
              email: this.state.email,
              avatarUrl : data.data.imageUrl
          })
        })
          .then((res) => {
            return res.json();
          })
          .then((data2) => {
              console.log(data2);
          })
      })
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
    const { autoCompleteResult, fullName, avatarUrl } = this.state;
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
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>

        <div style={{ marginLeft: "600px" }}>
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
          })(<Input onChange={this.handleChangeEmail} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Fullname&nbsp;
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
        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            valuePropName: 'value',
            initialValue: "0" + this.state.phone,
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input style={{ width: '100%' }} onChange={this.handlePhone} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
            </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
export default WrappedRegistrationForm;