import React from "react";
import { Redirect } from "react-router-dom";
class LogOutScreen extends React.Component {
  componentDidMount(){
    fetch('http://localhost:3001/users/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // clear window.localStorage
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('fullName');
        window.localStorage.removeItem('avatarUrl');
        window.localStorage.removeItem('id');
        // clear fullname + email in state
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
       Wait for a minutes...
      <Redirect to="/"/>
      </div>
    );
  }
}

export default LogOutScreen;