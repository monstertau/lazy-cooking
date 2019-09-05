import React, { Component } from "react";
import "antd/dist/antd.css";
import { Empty, List, Avatar, Icon, Card,Row,Col } from "antd";
const { Meta } = Card;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
const data = [
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 5"
  },
  {
    title: "Title 6"
  }
];
class ShowRecipeScreen extends Component {
  state={
    data:[],
  }
  componentDidMount() {
    console.log(this.props.match.params.type);
    fetch(`http://localhost:3001/posts/get-recipe/${this.props.match.params.type}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      this.setState({
        data:data.data,
      })
    })
    .catch(error=>{
      throw(error)
    })
  }
  render() {
    return (
      <div className="container mt-5 mb-5">
        <h3 className="mt-2">Công thức</h3>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
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
              
              <Card 
                hoverable
                style={{ height:400 }}
                cover={
                  <img
                    alt="example"
                    src={item.imageUrl}
                    width="100"
                    height="255"
                    object-fit="cover"
                  />
                }
                
                actions={[
                  <IconText type="like" text={1} key="upvote" />,
                  <IconText
                    type="bulb"
                    text={"Độ khó: "+item.level}
                    key="list-vertical-like-o"
                  />,
                  <IconText
                    type="clock-circle"
                    text={item.timetodone+" phút"}
                    key="list-vertical-message"
                  />,
                  
                ]}
              >
                <Meta
                  avatar={
                    <Avatar src={item.author.avatarUrl} />
                  }
                  title={item.title}
                  description={"Người đăng: "+ item.author.fullName.split(" ")[2]}
                  
                />
                
              </Card>
              
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default ShowRecipeScreen;
