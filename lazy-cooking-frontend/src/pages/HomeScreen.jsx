import React from "react";
import { Carousel } from "antd";
import { Icon, Avatar, List, Card } from "antd";
import "antd/dist/antd.css";
import "./HomeScreen.css"

const { Meta } = Card;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

class HomeScreen extends React.Component {

  state = {
    dataFistSixNew: [],
    dataMostSixLike: [],
  };

  componentWillMount() {
    fetch(
      `http://localhost:3001/posts/get-six-new`,
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
        this.setState({
          dataFistSixNew: data.data,
        });
      })
      .catch(error => {
        throw error;
      });

    fetch(
      `http://localhost:3001/posts/get-most-like`,
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
        this.setState({
          dataMostSixLike: data.data,
        });
      })
      .catch(error => {
        throw error;
      });

  }

  render() {
    return (
      <div className='abc'>
        <div className="container detail-post">
          <Carousel autoplay>
            <div className="intro">
              <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
            </div>
            <div>
              <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
            </div>
            <div>
              <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
            </div>
            <div>
              <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
            </div>
          </Carousel>

          <div className="meal-time mt-5">
            <div className="title-meal">
              <h4>
                <hr />BẠN MUỐN TÌM GÌ?<hr />
              </h4>
            </div>

            <div className="row row-meal text-center">
              <div className="col-4 sang">
                <div>
                  <img className="image-meal" src="https://food-images.files.bbci.co.uk/food/recipes/veggie_breakfast_fry_up_66913_16x9.jpg" alt="" />
                </div>
                <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-sang">Bữa sáng</a></button>
              </div>

              <div className="col-4">
                <div>
                  <img className="image-meal" src="https://www.dineout.co.in/blog/wp-content/uploads/2018/07/blog-banner-copy-1-1030x538.png" alt="" />
                </div>
                <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-trua">Bữa trưa</a></button>
              </div>

              <div className="col-4">
                <div>
                  <img className="image-meal" src="https://www.rd.com/wp-content/uploads/2017/11/there-s-actually-a-difference-between-dinner-and-supper_440843308-pressmaster-760x506.jpg" alt="" />
                </div>
                <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-toi">Bữa tối</a></button>
              </div>
            </div>
          </div>
          <br /><br /><hr />

          <div className="new-post mt-5">
            <div className="title-new-post">
              <h4 className="ml-2">Bài viết mới nhất</h4>
            </div>
            <div className="new-post ml-4 mr-4">
              <div className="pt-3 pb-5">
                <List
                  grid={{
                    gutter: 10,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                  }}
                  dataSource={this.state.dataFistSixNew}
                  renderItem={item => (
                    <List.Item className="list-item-new">
                      <a href={`/post/${item._id}`} >
                        <Card
                          className="card-new-post"
                          size='small'
                          hoverable
                          style={{}}
                          cover={
                            <img
                              alt={item.title}
                              src={item.imageUrl}
                              width="100"
                              height="200"
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
                              "Người đăng: " + item.author.fullName
                            }
                          />
                        </Card>
                      </a>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          <hr />

          <div className="most-like mt-5">
            <div className="title-new-post">
              <h4 className="ml-2">Bài viết được yêu thích nhất</h4>
            </div>
            <div className="new-post ml-4 mr-4">
              <div className="pt-3 pb-5">
                <List
                  grid={{
                    gutter: 10,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                  }}
                  dataSource={this.state.dataMostSixLike}
                  renderItem={item => (
                    <List.Item className="list-item-new">
                      <a href={`/post/${item._id}`} >
                        <Card
                          className="card-new-post"
                          size='small'
                          hoverable
                          style={{}}
                          cover={
                            <img
                              alt={item.title}
                              src={item.imageUrl}
                              width="100"
                              height="200"
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
                              "Người đăng: " + item.author.fullName
                            }
                          />
                        </Card>
                      </a>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default HomeScreen;
