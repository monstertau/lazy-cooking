import React from "react";
import { Icon, Avatar, List,Tag } from "antd";
import "antd/dist/antd.css";
import "./HomeScreen.css";
import { Helmet } from "react-helmet";
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class SearchScreen extends React.Component {
  state = {
    keyword: "",
    searchData: "",
    emptyData: false
  };

  componentWillMount() {
    const pathName = window.location.pathname.split("/");
    var keyword = pathName[2];

    keyword = decodeURI(keyword);
    this.setState({
      keyword: keyword
    });

    fetch(`http://localhost:3001/posts/search/${keyword}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.data.length === 0) {
          this.setState({
            emptyData: true
          });
        } else {
          this.setState({
            emptyData: false,
            searchData: data.data
          });
        }
      })
      .catch(error => {
        console.log(error);
        window.alert(error.message);
      });
  }

  render() {
    return (
      <div className="abc">
        <Helmet>
          <title>Tìm kiếm</title>
        </Helmet>
        <div>
        <div className="text-center pt-3">
                <h3 className="title-login">Kết quả tìm kiếm cho '{this.state.keyword}'</h3>
              </div>
          {this.state.emptyData ? (
            <div className="container mt-5" style={{marginBottom:"500px"}}>
              <h3>
                <Icon type="meh" /> Không tìm thấy bài viết nào cho '
                {this.state.keyword}'
              </h3>
            </div>
          ) : (
            <div className="container detail-post mb-5">
              
              <div className="container" >
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: page => {
                      console.log(page);
                    },
                    pageSize: 7
                  }}
                  dataSource={this.state.searchData}
                  renderItem={item => (
                    <List.Item
                      key={item.title}
                      actions={[
                        <IconText
                          type="like-o"
                          text={item.upvote.length}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          type="clock-circle"
                          text={`Thời Gian: ${item.timetodone} phút`}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          type="bulb"
                          text={`Độ Khó: ${item.level} sao`}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          type="user"
                          text={`Người Đăng: ${item.author.fullName}`}
                          key="list-vertical-like-o"
                        />
                      ]}
                      extra={
                        <img
                          width={272}
                          height={272}
                          alt="logo"
                          src={item.imageUrl}
                          style={{ objectFit: "contain" }}
                        />
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.author.avatarUrl} />}
                        title={
                          <h6>
                            <a href={`/post/${item._id}`}>{item.title}</a>
                          </h6>
                        }
                        description={"Dạng bài đăng:" + item.type}
                      />
                      Nguyên liệu:&nbsp;&nbsp;
                {item.materials.map(i => (
                  <Tag color="blue">{i}</Tag>
                ))}
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchScreen;
