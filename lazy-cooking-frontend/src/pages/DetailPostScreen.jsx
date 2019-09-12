import React, { Component } from 'react';
import { Icon, Button, Tag } from 'antd';
import renderHTML from 'react-render-html';
import {Helmet} from "react-helmet";
import "./DetailPostScreen.css"



class DetailPostScreen extends Component {

    state = {
        id: '',
        authorId: '',
        authorName: '',
        avatarUrl: '',
        avatarCurrentUser: '',
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
        comments: [],
        userComment: '',
        isError: false,
        message: '',
        width: window.innerWidth,
    }
    updateDimensions = () => {
        this.setState({
          
          width: window.innerWidth
        });
      };
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
                this.setState({
                    id: data.data.id,
                    authorId: data.data.authorId,
                    authorName: data.data.authorName,
                    avatarUrl: data.data.avatarUrl,
                    avatarCurrentUser: window.localStorage.getItem("avatarUrl"),
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
                    comments: data.data.comments,
                })
            })
            .catch((error) => {
                console.log(error);
                window.alert(error.message);
            })
            window.addEventListener("resize", this.updateDimensions);
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
                if (data.success === false && data.message === "Unauthenticated") {
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

    handleSubmitComment = (event) => {
        event.preventDefault();

        if (this.state.userComment.trim().length === 0) {
            this.setState({
                isError: true,
                message: 'Please input your comment!'
            })
        } else {
            fetch(`http://localhost:3001/posts/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: this.state.id,
                    content: this.state.userComment,
                }),
                credentials: 'include',
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === false && data.message === "Unauthenticated") {
                        window.alert('Please login for vote this!');
                    } else {
                        this.setState({
                            comments: data.data,
                            userComment: '',
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                    window.alert(error.message);
                })
        }
    }

    handleInput = () => {
        this.setState({
            isError: false,
        })
    }

    handleAClick = () => {
        window.location.replace(`http://localhost:3000/detailUser/${this.state.authorId}`);
    }

    render() {
        return (
            <div className="abc">
                <Helmet>
          <title>{this.state.title}</title>
        </Helmet>
                <br/>
                <div className="container detail-post">
                    <div className="headline">
                        <div className="title">
                            <h2>{this.state.title}</h2>
                        </div>
                        <div className="row mt-4">
                            <div className={this.state.width>1000?"media col-3":"media col-6"}>
                                <img src={this.state.avatarUrl} className="avatarImage"/>
                                <div className="media-body ml-1 ">
                                   <a onClick={this.handleAClick}><h6 className="mt-0">{this.state.authorName}</h6></a> 
                                    <small><Icon type="like" /> Thích: {this.state.totalVote}</small>
                                </div>
                            </div>
                            <div className={this.state.width>1000?"col-3":"col-6"}>
                                <h6><Icon type="clock-circle" /> Thời gian làm: {this.state.timeToDone} phút</h6>
                            </div>
                            <div className={this.state.width>1000?"col-3":"col-6"}>
                                <h6><Icon type="bulb" /> Độ khó: {this.state.level}</h6>
                            </div>
                            <div className={this.state.width>1000?"col-3":"col-6"}>
                                <h6><Icon type="profile" /> Nguyên Liệu: {this.state.materials.map((item) => {
                                    return (
                                        <Tag>{item}</Tag>
                                    )
                                })}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="main-content">
                        <div className="content">
                            <div className="image text-center mt-5">
                                <img className="postImage" src={this.state.imageUrl} style={{width:this.state.width<1000?"90%":"",objectFit:"cover"}}/>
                            </div>
                            <div className="detail-content mt-5">
                                {renderHTML(`${this.state.content}`)}
                            </div>
                        </div>
                    </div>
                    <div className="review-react-container mt-5 ">
                        {this.state.voted ? (
                            <div className="icons-list react">
                                <Button value="small" shape="round" type="primary" onClick={this.handleClickLike}><Icon type="dislike" />
                                </Button> • Bạn và {this.state.totalVote - 1} người khác thích bài viết này
                                {renderHTML(`&nbsp&nbsp&nbsp&nbsp`)} <Icon type="message" /> • {this.state.comments.length} bình luận
                            </div>
                        ) : (
                                <div className="icons-list react">
                                    <Button value="small" shape="round" type="primary" onClick={this.handleClickLike}><Icon type="like" /></Button> • {this.state.totalVote} thích bài viết này
                                    {renderHTML(`&nbsp&nbsp&nbsp&nbsp`)} <Icon type="message" /> • {this.state.comments.length} bình luận
                            </div>
                            )}
                        <div className="review">
                            <div className="comments">
                                {this.state.comments.map((item) => {
                                    return (
                                        <div className="media mt-2 user-comment" key={item.id}>
                                            <img className="align-self-center mr-2 ml-1 avatarImage" src={item.userAvatarUrl} />
                                            <div className="media-body mb-1">
                                                <h6 className="mt-1 user" >{item.userName}</h6>
                                                {item.content}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="input-comment mt-3">
                                <form onSubmit={this.handleSubmitComment}>
                                    <div className="media">
                                        <img src={this.state.avatarCurrentUser} className="align-self-center mr-3 avatarImage" />
                                        <textarea className="form-control" rows="2" placeholder="Thêm bình luận tại đây!" onInput={this.handleInput}
                                            value={this.state.userComment}
                                            onChange={(event) => {
                                                this.setState({
                                                    userComment: event.target.value,
                                                });
                                            }}></textarea>
                                    </div>
                                    {this.state.isError ? (
                                        <div className="form-field col-lg-12 mt-0 text-right">
                                            <p className="label-error">{this.state.message}</p>
                                        </div>
                                    ) : (
                                            null
                                        )}
                                    <div className="btn-comment text-right mt-1">
                                        <button className="btn btn-primary btn-sm" type='submit'>Bình luận</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailPostScreen;