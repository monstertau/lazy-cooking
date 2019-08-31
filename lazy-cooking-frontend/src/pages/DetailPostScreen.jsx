import React, { Component } from 'react';

class DetailPostScreen extends Component {

    state = {
        
    }


    render() {
        return (
            <div className="container">
                <div className="link-tag">
                    <a href="/blog">Blog</a>
                    <span>.</span>
                    <a href="">category</a>
                </div>
            </div>
        );
    }
}

export default DetailPostScreen;