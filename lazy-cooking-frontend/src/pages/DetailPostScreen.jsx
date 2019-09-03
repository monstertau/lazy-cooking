import React, { Component } from 'react';
import { Icon, Button, Typography, Input } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

class DetailPostScreen extends Component {

    state = {
        id: '',
        authorName: '',
        avatarUrl: '',
        title: '',
        content: '',
        imageUrl: '',
        level: '',
        timeToDone: '',
        category: [],
        materials: [],
        createdAt: '',
        totalVote: '',
        voted: false,
    }

    componentWillMount() {
        fetch(`http://localhost:3001/posts/get-post-by-id/${this.props.match.params.postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    id: data.data.id,
                    authorName: data.data.authorName,
                    avatarUrl: data.data.avatarUrl,
                    title: data.data.title,
                    content: data.data.content,
                    imageUrl: data.data.imageUrl,
                    level: data.data.level,
                    timeToDone: data.data.timetodone,
                    category: data.data.category,
                    materials: data.data.materials,
                    createdAt: data.data.createdAt,
                    totalVote: data.data.totalVote,
                    voted: data.data.voted,
                })
            })
            .catch((error) => {
                console.log(error);
                window.alert(error.message);
            })
    }

    handleClickLike = () => {
        fetch(`http://localhost:3001/posts/update-vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.id,
            }),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success == false) {
                    window.alert('Please login for vote this!');
                } else {
                    this.setState({
                        totalVote: data.data.totalVote,
                        voted: data.data.voted,
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
            <div className="container mt-5">
                <div className="headline">
                    <div className="title">
                        <h2>{this.state.title}</h2>
                    </div>
                    <div className="row">
                        <div className="media col-3">
                            <img src={this.state.avatarUrl} className="align-self-center mr-3 avatarImage" />
                            <div className="media-body">
                                <h6 className="mt-0">{this.state.authorName}</h6>
                                <small><Icon type="like" /> Thích: {this.state.upVote}</small>
                            </div>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6><Icon type="clock-circle" /> Thời gian làm: {this.state.timeToDone}</h6>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6><Icon type="bulb" /> Độ khó: {this.state.level}</h6>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6><Icon type="profile" /> Nguyên Liệu: {this.state.materials.map((item) => {
                                return (
                                    <small className="materials" key={item}>{item}, </small>
                                )
                            })}</h6>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="image text-center mt-5">
                        <img className="postImage" src={this.state.imageUrl} />
                    </div>
                    <div className="detail-content mt-5">
                        <Text>{this.state.content}</Text>
                    </div>
                </div>
                <div className="review-react-container mt-5">
                    {this.state.voted ? (
                        <div className="icons-list react">
                            <Button value="small" shape="round" type="primary" onClick={this.handleClickLike}><Icon type="dislike" /></Button> • You and {this.state.totalVote - 1} people like this
                    </div>
                    ) : (
                            <div className="icons-list react">
                                <Button value="small" shape="round" type="primary" onClick={this.handleClickLike}><Icon type="like" /></Button> • {this.state.totalVote} people like this
                    </div>
                        )}
                    <div className="review">
                        <div>
                            <TextArea placeholder="Write your comment here!" autosize={{ minRows: 4 }}></TextArea>
                        </div>
                        <div className="btn-comment">
                            <Button type="primary" className="btn-comment">Send</Button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default DetailPostScreen;