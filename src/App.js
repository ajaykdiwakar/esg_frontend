import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import FileUpload from "./components/FileUpload";
import IndexView from './components/IndexView';
import Viewdata from './components/Viewdata';



import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";
import logo from './assets/images/logo.png'
import Image from 'react-bootstrap/Image'
import { useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { Steps, Panel, ButtonGroup, Button   } from 'rsuite';

import { Placeholder } from 'rsuite'
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css'

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

 

function HeaderView() {
  debugger
  const location = useLocation();
  console.log(location.pathname);
  return <span>Path : {location.pathname}</span>
}

const [step, setStep] = React.useState(0);
const onChange = nextStep => {
  setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
};

const onNext = () => onChange(step + 1);
const onPrevious = () => onChange(step - 1);

  return (
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={Login} />
                <Route>
                <div>
                    {/* <div className="container mt-3"> */}
                    <nav className="navbar navbar-expand navbar-dark">
                        <div className="navbar-brand">
                            <Image className="nav-logo" src={logo} thumbnail />
                        </div>
                        <div className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <div  className="nav-link">
                                ESGDS Portal   
                                </div>
                            </li>
                        </div>

                
                        <div className="navbar-nav ml-auto">
                             <li className="nav-item">
                            <div  className="nav-link">
                            Welcome Super Admin!
                            </div>
                        </li>
                      
                       
                        </div>
                   
                </nav>
                <Container fluid style={{padding: '6% 0% 6% 0%', background:'#efefef'}}>
                {/* style={{margin: '60px', width: '95%'}} */}
                
                        {/* <Col sm={2}>
                        <div> 
                             <Steps vertical current={step}>
                                <Steps.Item title="Personal Details" description=""/>
                                <Steps.Item title="Bank Details" description=""/>
                                <Steps.Item title="Proof Upload" description=""/>
                                <Steps.Item title="Login Credentials" description=""/>
                            </Steps>
                            <hr />
                            <Panel header={`Step: ${step + 1}`}>
                                <Placeholder.Paragraph />
                            </Panel>
                            <hr />
                            <ButtonGroup>
                                <Button onClick={onPrevious} disabled={step === 0}>
                                Previous
                                </Button>
                                <Button onClick={onNext} disabled={step === 3}>
                                Next
                                </Button>
                            </ButtonGroup> 
                        </div>
                        </Col> */}
                        
                            <Switch>
                            <Route exact path={["/", "/login"]} component={Login} />
                            <Route exact path="/home" component={Home} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/profile" component={Profile} />
                            <Route path="/fileUpload" component={FileUpload} />
                            <Route path="/IndexView" component={IndexView} />
                            <Route path="/Viewdata" component={Viewdata} />

                            
                            {/* <Route path="/user" component={BoardUser} /> */}
                            </Switch>
                      
                    
                </Container>
            </div>
        </Route>
    </Switch>
</Router>
  );
};

export default App;
