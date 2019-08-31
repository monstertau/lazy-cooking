import React, { Component } from 'react';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class LoginScreen extends Component {

    state = {
        email: '',
        password: '',
        rememberMe: false,
        isError: false,
        message: '',
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (!this.state.email || !emailRegex.test(this.state.email)) {
            this.setState({
                isError: true,
                message: 'Invalid Email!',
            })
        } else if (!this.state.password || this.state.password.length < 6) {
            this.setState({
                isError: true,
                message: 'Password must be more than 6 characters!'
            })
        } else {
            this.setState({
                isError: false,
            })
            fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
                credentials: 'include',
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    //check mail exist
                    if (data.message === 'Email does not exist!') {
                        this.setState({
                            isError: true,
                            message: 'Email does not exist!'
                        });
                    } else if (data.message === 'Wrong password!') {
                        this.setState({
                            isError: true,
                            message: 'Wrong password!'
                        });
                    } else {
                        // save current user to localStorage
                        if (this.state.rememberMe === true) {
                            window.localStorage.setItem('email', data.data.email);
                            window.localStorage.setItem('fullName', data.data.fullName);
                            window.localStorage.setItem('avatarUrl', data.data.avatarUrl);
                            window.localStorage.setItem('id', data.data.id);
                        } else {
                            window.sessionStorage.setItem('email', data.data.email);
                            window.sessionStorage.setItem('fullName', data.data.fullName);
                            window.sessionStorage.setItem('avatarUrl', data.data.avatarUrl);
                            window.sessionStorage.setItem('id', data.data.id);
                        }
                        //redirect to home page
                        window.location.replace("http://localhost:3000/")
                    }
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        window.alert(error.message);
                    }
                })
        }
    }

    handleInput = () => {
        this.setState({
            isError: false,
        })
    }
    handleRememberMe = () => {
        this.setState({
            rememberMe: !this.state.rememberMe,
        })
    }

    render() {

        return (
            <div className="container">
                <div className="row mt-2">
                    <div className="col-2"></div>
                    <div className="col-8 get-in-touch">
                        <h2 className="title ">Login</h2>
                        <form className="contact-form row mt-0" onSubmit={this.handleSubmit}>
                            <div className="form-field col-lg-12">
                                <h6>Email:</h6>
                                <input className="input-text js-input" type="text" onInput={this.handleInput}
                                    value={this.state.email}
                                    onChange={(event) => {
                                        this.setState({
                                            email: event.target.value,
                                        });
                                    }} />
                            </div>
                            <div className="form-field col-lg-12 ">
                                <h6>Password:</h6>
                                <input className="input-text js-input" type="password" onInput={this.handleInput}
                                    value={this.state.password}
                                    onChange={(event) => {
                                        this.setState({
                                            password: event.target.value,
                                        });
                                    }} />
                            </div>
                            {this.state.isError ? (
                                <div className="form-field col-lg-12 mt-0">
                                    <h6 className="label-error">{this.state.message}</h6>
                                </div>
                            ) : (
                                    null
                                )}
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="customCheck1" onChange={this.handleRememberMe} />
                                <label class="custom-control-label" for="customCheck1">Remember me</label>
                            </div>
                            <div className="form-field col-lg-12 mt-0">
                                <button className="submit-btn">Login</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        );
    }
}

export default LoginScreen;