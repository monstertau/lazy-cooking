import React from "react";
import {Icon, Avatar, List } from "antd";
import renderHTML from 'react-render-html';
import "antd/dist/antd.css";
import "./HomeScreen.css";

const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
)


class SearchScreen extends React.Component {

    state = {
        keyword: '',
        searchData: '',
        emptyData: false,
    }

    componentWillMount() {
        const pathName = window.location.pathname.split("/");
        var keyword = pathName[2];
        keyword = decodeURI(keyword);

        this.setState({
            keyword: keyword,
        })

        fetch(`http://localhost:3001/posts/search/${keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.data.length === 0){
                    this.setState({
                        emptyData: true,
                    })
                } else {
                    this.setState({
                        emptyData: false,
                        searchData: data.data,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                window.alert(error.message);
            })


    }

    render() {
        return (
            <div>
                {this.state.emptyData ? (
                    <div className="container mt-5">
                        <h3><Icon type="meh" /> Không tìm thấy bài viết nào cho '{this.state.keyword}'</h3>
                    </div>
                ) : (
                    <div className="container" style={{ marginTop: "20px" }}>
                <div className="mt-5">
                    <h3>Kết quả tìm kiếm cho '{this.state.keyword}'</h3>
                </div>
                <div className="container mt-3 mb-5" >
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 7,
                        }}
                        dataSource={this.state.searchData}
                        renderItem={item => (
                            <List.Item
                                key={item.title}
                                actions={[
                                    <IconText type="like-o" text={item.upvote.length} key="list-vertical-like-o" />,
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
                                        style={{ objectFit: "contain" }}
                                    />
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.author.avatarUrl} />}
                                    title={<a href={`/post/${item._id}`}>{item.title}</a>}
                                />
                                {renderHTML(`${item.content }`)}
                            </List.Item>
                        )}
                    />
                </div>

            </div>
                )}
            </div>
        );
    }
}

export default SearchScreen;
