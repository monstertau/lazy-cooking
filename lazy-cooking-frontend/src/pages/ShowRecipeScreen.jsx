import React, { Component } from "react";
import "antd/dist/antd.css";
import { Empty, List, Avatar, Icon, Card, Row, Col } from "antd";
const { Meta } = Card;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class ShowRecipeScreen extends Component {
  state = {
    data: []
  };
  componentDidMount() {
    console.log(this.props.match.params.type);
    fetch(
      `http://localhost:3001/posts/get-recipe/${this.props.match.params.type}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          data: data.data
        });
      })
      .catch(error => {
        throw error;
      });
  }
  render() {
    return (
      <div className=" pt-5 pb-5" style={{marginLeft:'10%',marginRight:'10%'}}>
        <div className="text-center ">
          <h3 className="title-login">Công thức dành cho bạn</h3>
        </div>
        <List
        className="login"
          grid={{
            gutter: 20,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4
          }}
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 12
          }}
          dataSource={this.state.data}
          renderItem={item => (
            
            <List.Item>
              
              <a href={`/post/${item._id}`} >
                
                <Card
                className="item-inner"
                  hoverable
                  style={{ }}
                  cover={
                    
                    <img
                      alt={item.title}
                      src={item.imageUrl}
                      width="100"
                      height="255"
                      object-fit="cover"
                      
                    />
                    
                  }
                  actions={[
                    <IconText
                      type="like"
                      text={`${item.upvote.length}`}
                      key="upvote"
                    />,
                    <IconText
                      type="bulb"
                      text={"Độ khó: " + item.level}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      type="clock-circle"
                      text={item.timetodone + " phút"}
                      key="list-vertical-message"
                    />
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={item.author.avatarUrl} />}
                    title={item.title}
                    description={
                      "Người đăng: " + item.author.fullName.split(" ")[2]
                    }
                  />
                </Card>
                
              </a>
              
            </List.Item>
            
          )}
        />
      </div>
    );
  }
}

export default ShowRecipeScreen;
