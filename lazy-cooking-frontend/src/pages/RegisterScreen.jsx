import React, { Component } from 'react';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^\d{10}$/;

class RegisterScreen extends Component {

    state = {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        isError: false,
        message: '',
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(!this.state.email || !emailRegex.test(this.state.email)){
            this.setState({
                isError: true,
                message: 'Invalid Email!',
            })
        } else if(!this.state.password || this.state.password.length < 6) {
            this.setState({
                isError: true,
                message: 'Password must be more than 6 characters!'
            })
        } else if(this.state.password !== this.state.confirmPassword){
            this.setState({
                isError: true,
                message: 'Wrong confirm password!',
            })
        } else if(!this.state.fullName){
            this.setState({
                isError: true,
                message: 'Please input full name!',
            })
        } else if(!this.state.phone || !phoneRegex.test(this.state.phone)){
            this.setState({
                isError: true,
                message: 'Phone number must contain 10 digits number!',
            })
        } else {
            this.setState({
                isError: false,
            })
            fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    fullName: this.state.fullName,
                    phone: this.state.phone,
                }),
                credentials: 'include',
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    //check mail exist
                    if (!data.success) {
                        console.log(data);
                        this.setState({
                            isError: true,
                            message: data.message
                        });
                    } else {
                        console.log(data);
                        //redirect to login page
                        window.location.replace("http://localhost:3000/login")
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

    render() {
        return (
            <div className="container">
                <div className="row mt-2">
                    <div className="col-2"></div>
                    <div className="col-8 get-in-touch">
                        <h2 className="title ">Register</h2>
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
                            <div className="form-field col-lg-12 ">
                                <h6>Confirm password:</h6>
                                <input className="input-text js-input" type="password" onInput={this.handleInput}
                                    value={this.state.confirmPassword}
                                    onChange={(event) => {
                                        this.setState({
                                            confirmPassword: event.target.value,
                                        });
                                    }} />
                            </div>
                            <div className="form-field col-lg-12 ">
                                <h6>Full name:</h6>
                                <input className="input-text js-input" type="text" onInput={this.handleInput}
                                    value={this.state.fullName}
                                    onChange={(event) => {
                                        this.setState({
                                            fullName: event.target.value,
                                        });
                                    }} />
                            </div>
                            <div className="form-field col-lg-12">
                                <h6>Phone:</h6>
                                <input className="input-text js-input" type="text" onInput={this.handleInput}
                                    value={this.state.phone}
                                    onChange={(event) => {
                                        this.setState({
                                            phone: event.target.value,
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
                            <div className="form-field col-lg-12 mt-0 text-right">
                                <button className="submit-btn">Register</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        );
    }
}

export default RegisterScreen;