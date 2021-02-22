import React from 'react';
import ReactDOM from 'react-dom';
import Upload1 from '../images/upload1.png'
// import Upload2 from '../assets/images/upload2.png'
// import Upload3 from '../assets/images/upload3.png'
// import Upload4 from '../assets/images/upload4.png'
import './IndexView.css'
import View1 from '../images/view1.jpg'
import  { Redirect } from 'react-router-dom'
class IndexView extends React.Component {
    constructor(props) {
        super(props);
    }
    handlefileupload=()=>{
        this.props.history.push('/fileUpload')
    }
    handleviewdata=()=>{
        this.props.history.push('/viewdata')
    }
  render() {
    return (
        
        <div className="container" 
        style={{
            width: "100%",
            display:"inline-block",
            marginLeft:"70px"
        }}>
        <div className="row" style={{
            float:"left",
            width: "100%"
        }}>
            <div className="col-lg-6" style={{float: "left"}}>
                <div className="card card_effect" style={{display:"flex",alignItems:"center",backgroundColor:"white",padding:"20px",width: "80%"}} onClick={this.handlefileupload}>
                    <div className="content_pic" >
                       <img src={Upload1} height="180"></img>
                    </div>
                    <div className="card-body">
                    <div className="content_title"> <h4 class="card-title"> Data Upload</h4></div>
                    </div>
                </div>

            </div>


            <div className="col-lg-6" style={{float: "left"}}>
            
            
                <div className="card card_effect"   style={{display:"flex",alignItems:"center",backgroundColor:"white",padding: "20px",width: "80%"}} onClick={this.handleviewdata}>
                <div className="content_pic" >
                       <img src={View1} style={{height: "180px"}}></img>
                    </div>
                    <div className="card-body">
                    <div className="content-title"><h4 class="card-title">View Data</h4></div>

                    </div>
                    
                </div>

            </div>

        </div>

    </div>
        
    );
  }
}
export default IndexView;