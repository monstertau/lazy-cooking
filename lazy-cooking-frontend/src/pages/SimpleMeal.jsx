import React, { Component } from 'react';
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
import { foodArr, typeArr } from "./data"
const { Option } = Select;
class Meal extends Component {
    state = {
        foods: foodArr,
        types: typeArr,
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((error,data)=>{
            console.log(data);
            fetch("http://localhost:3001/posts/simpleMeal", {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                 category: data.category,
                 level: data.level,
                 materials: data.materials,
                 timetodone: data.timetodone
              })
            })
        })
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
            })
            .catch(error => { throw (error) })

    }
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
            <div className="container">
                <h3>Tìm Bữa Ăn Đơn Giản</h3>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                        })(<Rate count={2} />)}
                    </Form.Item>

                    <Form.Item label="Thời gian làm:" extra="Thời gian làm phải nhỏ hơn 30 phút">
                        {getFieldDecorator("timetodone", {
                            initialValue: 1,
                            rules: [{ required: true, message: "Hãy chọn thời gian làm!" }]
                        })(<InputNumber min={1} max={30} />)}
                        <span className="ant-form-text"> Phút</span>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading} onClick={this.enterLoading}>
                            Tìm Bài Đăng
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
const SimpleMeal = Form.create({ name: 'simplemeal' })(Meal)
export default SimpleMeal;