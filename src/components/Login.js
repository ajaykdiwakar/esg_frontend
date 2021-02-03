import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-validation/build/form";
import Image from 'react-bootstrap/Image'
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { login } from "../actions/auth";

import backgroundImage from "../assets/images/login_image.png"
import logo from "../assets/images/logo.png"


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    props.history.push("/fileUpload");
    // e.preventDefault();

    // setLoading(true);

    // form.current.validateAll();

    // if (checkBtn.current.context._errors.length === 0) {
    //   dispatch(login(username, password))
    //     .then(() => {
    //       // props.history.push("/profile");
    //       props.history.push("/fileUpload");

    //       window.location.reload();
    //     })
    //     .catch(() => {
    //       setLoading(false);
    //     });
    // } else {
    //   setLoading(false);
    // }
  };

  if (isLoggedIn) {
    // return <Redirect to="/profile" />;
    return <Redirect to="/fileUpload" />;

  }

  return (
    

    <Container className="login_container">
      <Row style={{height: '610px !important', marginRight: '-15px', marginLeft: '-15px'}}>
        <Col sm={8} style={{paddingLeft:'0px !important', paddingRight:'0px !important'}}>
          <Container className="login-img">
              <Image className="b-image" src={backgroundImage} thumbnail />
          </Container>
        </Col>
        <Col sm={4}>
          <div className="card-container login_card">
            <img
              src={logo}
              alt="profile-img"
              className="logo"
            />
            <label style={{color:' #000000',     marginBottom:'0px !important'}}>Login</label>
            <label style={{color:' #A3A3A3',fontSize: '10px', marginTop: '2px !important'}}>Enter your email and password to login</label>
            <Form onSubmit={handleLogin} ref={form} style={{    marginTop: '30%'}}>
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-block" disabled={loading} style={{background: '#2199C8 0% 0% no-repeat padding-box', boxShadow: '0px 3px 6px #f3f7f8', borderRadius: '4px',
                  color: '#FFFFFF'}}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Sign in</span>
                </button>
              </div>
              <label style={{color:' #2199C8', fontSize: '10px', marginTop: '2px !important'}}>Forgot password?</label>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
