import React, { Component } from 'react';
import { Icon} from "antd";
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
        upVote: '',
    }

    componentWillMount() {
        fetch(`http://localhost:3001/posts/get-post-by-id/${this.props.match.params.postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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
                    upVote: data.data.upvote,
                })
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
                            <img src={this.state.avatarUrl} className="align-self-center mr-3" />
                            <div className="media-body">
                                <h6 className="mt-0">{this.state.authorName}</h6>
                                <small>Thích: {this.state.upVote}</small>
                            </div>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6>Thời gian làm: {this.state.timeToDone}</h6>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6>Độ khó: {this.state.level}</h6>
                        </div>
                        <div className="col-3 align-self-center">
                            <h6>Nguyên Liệu: {this.state.materials.map((item) => {
                                return (
                                    <small className="materials" key={item}>{item}, </small>
                                )
                            })}</h6>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="image text-center mt-5">
                        <img src={this.state.imageUrl} />
                    </div>
                    <div className="detail-content mt-5">
                        <p>{this.state.content}</p>
                    </div>
                </div>
                <div className="review-react-container mt-5">
                    <div className="react">
                        <button className="btn"><i><Icon type="like" /></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailPostScreen;