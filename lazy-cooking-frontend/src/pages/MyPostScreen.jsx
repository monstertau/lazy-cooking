import React, { Component } from "react";
import "antd/dist/antd.css";
import { Empty, List, Avatar, Icon } from "antd";
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: "http://ant.design",
    title: `ant design part ${i}`,
    avatar: "https://i.stack.imgur.com/dr5qp.jpg",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
  });
}

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class MyPostScreen extends Component {
  state = {
    havePost: true
  };
  componentDidMount(){
    
  }
  render() {
    return (
      <div className="container mt-5 mb-5">
        <h3>Công thức của tôi</h3>
        {this.state.havePost == false ? (
          <Empty />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 5
            }}
            dataSource={listData}
            
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText
                    type="like"
                    text="0"
                    key="upvote"
                  />,
                  <IconText
                    type="bulb"
                    text="Độ khó: 5"
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="clock-circle"
                    text="Thời gian: 10 phút"
                    key="list-vertical-message"
                  />
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://sites.google.com/site/khxmuleleasarsnthes/_/rsrc/1480953778509/watthuprasngkh/googlelogo_color_284x96dp.png"
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

export default MyPostScreen;
