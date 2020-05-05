import React from "react";

import "./Auth.css";

import AuthContext from "../context/auth-context";

class AuthPage extends React.Component {
  constructor(props) {
    super();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  state = {
    isLogin: false
  };

  static contextType = AuthContext;

  submitHandler = e => {
    e.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    console.log(email, password);
    console.log(this.context);
    if (email.trim().lenght === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
      query{
        login(email:"${email}", password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation{
          createUser(userInput:{email:"${email}",password:"${password}"}){
            _id
            email
          }
        }`
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">submit</button>

          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
