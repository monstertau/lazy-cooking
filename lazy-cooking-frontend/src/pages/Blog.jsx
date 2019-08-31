import React, { Component } from 'react';
import { Card, Icon, Avatar } from 'antd';
import './Blog.css'
const { Meta } = Card;


class Blog extends Component {
    render() {
        return (

            <div>
                <Card
                    id="card"
                    style={{ width: 300 }}
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={[
                        <Icon type="setting" key="setting" />,
                        <Icon type="edit" key="edit" />,
                        <Icon type="ellipsis" key="ellipsis" />,
                    ]}
                >
                    <Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title="Card title"
                        description="This is the description"
                    />
                </Card>
            </div>
        );
    }
}

export default Blog;