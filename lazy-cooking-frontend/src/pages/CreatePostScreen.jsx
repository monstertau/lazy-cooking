import React from "react";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Rate,
  Checkbox,
  Row,
  Col,
  Input
} from "antd";
import "antd/dist/antd.css";
const { Option } = Select;
const { TextArea } = Input;

class CreatePostScreen extends React.Component {

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { getFieldDecorator,getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const titleError = isFieldTouched('title') && getFieldError('title');
    
    return (
      <div className="container" style={{ marginTop: "20px" }}>
        <h3>Tạo công thức</h3>
        <Form {...formItemLayout}>
        <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''} label="Tiêu đề">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }],
          })(
            <Input
              prefix={<Icon type="container" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Tiêu đề"
            />,
          )}
        </Form.Item>

          <Form.Item label="Chọn nguyên liệu" hasFeedback>
          {getFieldDecorator('materials', {
            rules: [
              { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          })(
            <Select mode="multiple" placeholder="Bấm vào để chọn nguyên liệu">
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>,
          )}
          </Form.Item>

          <Form.Item label="Chọn kiểu công thức" hasFeedback>
          {getFieldDecorator('category', {
            rules: [
              { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          })(
            <Select mode="multiple" placeholder="Bấm vào để chọn kiểu công thức">
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>,
          )}
          </Form.Item>

          <Form.Item label="Độ khó">
          {getFieldDecorator('level', {
            initialValue: 1,
          })(<Rate />)}
        </Form.Item>

        <Form.Item label="Thời gian làm:">
          {getFieldDecorator('time-to-done', { initialValue: 1 })(<InputNumber min={1} />)}
          <span className="ant-form-text"> Phút</span>
        </Form.Item>

        <Form.Item label="Ảnh ví dụ" extra="kích thước tối đa 5mb">
          {getFieldDecorator('file-upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Bấm để tải ảnh
              </Button>
            </Upload>,
          )}
        </Form.Item>

        <Form.Item label="Nội dung ">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: 'Please input your content!' }],
          })(
            <TextArea rows={30}
              prefix={<Icon type="container" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Điền nội dung vào đây (ghi rõ các bước)"
            />,
          )}
        </Form.Item>
        </Form>
        
      </div>
    );
  }
}
const WrappedCreatePostScreen = Form.create({ name: 'validate_other' })(CreatePostScreen);
export default WrappedCreatePostScreen;
