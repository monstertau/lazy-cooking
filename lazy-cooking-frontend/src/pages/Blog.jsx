import React, { Component } from 'react';
import { List, Avatar, Icon } from 'antd';
import './Blog.css'

const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
)
class Blog extends Component {
    state = {
        data: [],
    }

    componentDidMount() {
        fetch(`http://localhost:3001/posts/getpost`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    data: data.data,
                })
            })
    }
    render() {
        // console.log(this.state.data)
        return (
            <div className="container mt-5 mb-5" >
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 7,
                    }}
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText type="like-o" text={item.upvote} key="list-vertical-like-o" />,
                                <IconText type="clock-circle" text={`Thời Gian: ${item.timetodone} phút`} key="list-vertical-like-o" />,
                                <IconText type="bulb" text={`Độ Khó: ${item.level} sao`} key="list-vertical-like-o" />,
                                <IconText type="user" text={`Người Đăng: ${item.author.fullName}`} key="list-vertical-like-o" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    height={272}
                                    alt="logo"
                                    src={item.imageUrl}
                                    style={{objectFit:"contain"}}
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.author.avatarUrl} />}
                                title={<a href={`/post/${item._id}`}>{item.title}</a>}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </div>

        );
    }
}

export default Blog;