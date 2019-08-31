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
        return (
            <div className="container mt-5 mb-5" >
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                                <IconText type="clock-circle" text="156" key="list-vertical-like-o" />,
                                <IconText type="bulb" text="156" key="list-vertical-like-o" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    height={272}
                                    alt="logo"
                                    src={item.imageUrl}
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.author.avatarUrl} />}
                                title={<a href={item.href}>{item.title}</a>}
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