import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import {isNullOrUndefined } from "@syncfusion/ej2-base";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserService from "../services/user.service";
import XLSX from "xlsx";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import readXlsxFile from "read-excel-file";
import $ from 'jquery';
import Table from 'react-bootstrap/Table'

import axios from 'axios'
import ReactTable from "react-table"; 
import 'react-table/react-table.css'
import Fileuploader from './FileUploader.tsx';

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

// Data Exchange Portal


class FileUpload extends React.Component {

  
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null],
      data: [],
      cols: [],
      selectedFile: undefined,
      selectedCompany: "",
      companies: [],
      companyData: {},
      companyName:[]
      
    };  
    this.sendData = this.sendData.bind(this);
   // this.handleChange = this.handleChange.bind(this);
    this.getCompanyData = this.getCompanyData.bind(this);
    this.handleChangeexcel = this.handleChangeexcel.bind(this)

    // this.getAllCompanies()
  }

  componentDidMount() {
   
    
  }
  // file json structure has been changed since we used plugin
  handleChangeexcel=(e)=>{
    console.log(e.file,"e")
    let namearray=[];
    let selectfilename=e.file;
    for (const name of selectfilename) {
      namearray.push(name.name)
    }
    this.setState({
      selectedFile:e.file,
      companyName:namearray
    })
    console.log(this.state.selectedFile,"filesupload");
  }
 
  // handleChange(e) {
  //  alert("handelchange")
  //  console.log(e.target.files,"handle files")
  //   let selectedFile=e.target.files;
  //   let namearray=[];
  //   for (const name of selectedFile) {
  //     namearray.push(name.name)
  //   }
  //   console.log(namearray,"namearray")

  //   this.setState({
  //     selectedFile: e.target.files,
  //     companyName:namearray
  //   });
  //   document.getElementById("fileUploadNames").style.display="block";
  // }
getAllcompany=()=>{
  fetch("http://0dc709431e27.ngrok.io/getAllCompany", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        
        console.log("Success:", data);
        this.setState({
          companies: data.data
        })
        // alert(data.message)
      })
      .catch((error) => {
        
        console.error("Error:", error);
        alert(error.message)
      });
}
  sendData(e) {
    
    e.preventDefault();
    var input = document.getElementById('file');
    const data = new FormData();
    console.log(this.state.selectedFile);
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x]);
    }
    console.log(data);
   
    fetch("http://0dc709431e27.ngrok.io/taxonomy ", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.status===200){
        this.getAllcompany()
        console.log("Success:", data);
        alert(data.message)
        }
      })
      .catch((error) => {
        
        console.error("Error:", error);
        alert(error.message)
      });

  }
  getCompanyData(e){
    
    if(e.target.value == "Select Company"){
      alert("Please Select companies to view data")
    }else{

      this.setState({
        selectedCompany: e.target.value
       })
       
       const { companyName } = {
        companyName : e.target.value
      }
    
       let url = `http://0dc709431e27.ngrok.io/getNewData/${companyName}`;
   
       fetch(url, {
         method: "GET"
       })
         .then((response) => response.json())
         .then((data) => {
           
           console.log("Success:", data.data);
         
   
           this.setState({
             companyData : data
           })
          //  alert(data.message)
         })
         .catch((error) => {
           
           console.error("Error:", error);
           alert(error.message)
         });

    }
   

  }
  



  render() {

    const columns = [{  
      Header: 'Year',  
      accessor: 'Year',
     }
     ,{  
      Header: 'DPCode',  
      accessor: 'DPCode' ,
      }
     
     ,{  
     Header: 'Response',  
     accessor: 'Response' ,
     }
     ,{  
     Header: 'unit',  
     accessor: 'unit',
     }
  ]

  const FileNameinfo=(arg)=>{
    let filenames=arg.data;
    console.log(filenames,"filenames");
    if(!isNullOrUndefined(filenames)){
      if(filenames.length>1){
      return(
        <div>
          <div>
          {filenames.map((filename)=>(
                <div>{filename}</div>
           ))}
          </div>
        </div>
      )
          }
    }
    return (<div></div>);
  }
   
    return (
      <div className="container">
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "25px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
              margin: "0 auto",
              width: "23%",
              marginBottom:"50px"
            }}
          >
              Data Uploading
          </Card.Title>
          <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
        <Row>
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "20px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
              marginBottom:"30px"
            }}
          >
             STEP 1: 
          </Card.Title>
          <div style={{fontSize:"15px",color:"#155F9B",marginLeft:"10px",padding: "3px"}}>Upload Excel</div>
          </Row>
        <header className="jumbotron" style={{width:"100%"}}>
          <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "12px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600"
            }}
          >
            Upload File
          </Card.Title>
          <div>
            <Row>
              <Col sm={12}>
                {/* <Form.File
                  id="formcheck-api-regular"
                  style={{ width: "459px", height: "83px", fontSize: "12px" }}>
                  <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} style={{ top: "322px", left: "406px", width: "459px", 
                  background: "#F0F1F4 0% 0% no-repeat padding-box",border: "1px solid #D4D4D428", borderRadius: "4px", opacity: " 1", height: "auto", }} multiple />
                </Form.File>  */}
                    <Fileuploader filenameHandle={this.handleChangeexcel}></Fileuploader>
              </Col>
            </Row>
            <Row>
              <Col sm={5} style={{marginTop:"20px"}}>
               
                <button className="btn btn-primary" style={{fontSize:"15px"}} onClick={this.sendData} >
                  Upload
                </button>
              </Col>
            </Row> 
          </div>
        </header>
        </Row>
        <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
          <Row>
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "20px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
              
              marginBottom:"30px"
            }}
          >
             STEP 2:
          </Card.Title>
          <div style={{fontSize:"15px",color:"#155F9B",marginLeft:"10px",padding: "3px"}}>Calculate Derived Data Points</div>
          </Row>
          <Col sm={12}>
            <div style={{marginBottom:"30px"}}> <h5 style={{color: "#155F9B"}}><button className="btn btn-primary" style={{width: "25%",fontSize:"15px"}} disabled={true}>Calculate derived data</button></h5></div>
            {/* <label>Company Name : {this.state.companyData.companyName }</label>*/}
          </Col>
          {/* <Col sm={4}>

            <h6 style={{  height: "22px", textAlign: "left", fontSize: "12px", letterSpacing: "0px", fontWeight: "600", marginBottom: "0px !important" }}>
              Select Company
            </h6> 
            <select  onChange={this.getCompanyData} className="select">
              <option>Select Company</option>
              {this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>

          </Col> */}
        </Row>
        

        
 <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
   <Row>
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "20px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
              
              marginBottom:"30px"
            }}
          >
             STEP 3:
          </Card.Title>
          <div style={{fontSize:"15px",color:"#155F9B",marginLeft:"10px",padding: "3px"}}>Calculate performance unit </div>
          </Row>
          <Col sm={12}>
           <div style={{marginBottom:"30px"}}> <h5 style={{color: "#155F9B"}}><button className="btn btn-primary" style={{ width:"25%",fontSize:"15px"}} disabled={true}>Calculate performance unit</button></h5></div> 
            
          </Col>
        </Row>

        <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
        <Row>
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "20px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
             
              marginBottom:"30px"
            }}
          >
             STEP 4:
          </Card.Title>
          <div style={{fontSize:"15px",color:"#155F9B",marginLeft:"10px",padding: "3px"}}>Upload Controversies</div>
          </Row>
          <header className="jumbotron" style={{width: "100%"}}>
          <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "12px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600"
            }}
          >
           Upload Controversies
          </Card.Title>
          <div>
            <Row>
              <Col sm={12}>
                {/* <Form.File
                  id="formcheck-api-regular"
                  style={{ width: "459px", height: "83px", fontSize: "12px" }}>
                  <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} style={{ top: "322px", left: "406px", width: "459px", 
                  background: "#F0F1F4 0% 0% no-repeat padding-box",border: "1px solid #D4D4D428", borderRadius: "4px", opacity: " 1", height: "auto", }} multiple />
                </Form.File>  */}
                    <Fileuploader filenameHandle={this.handleChangeexcel}></Fileuploader>
              </Col>
            </Row>
            <Row>
      
              <Col sm={5}  style={{marginTop:"20px"}}>
               
                <button className="btn btn-primary" style={{fontSize:"15px"}} onClick={this.sendData}>
                  Upload
                </button>
              </Col>
            </Row> 
          </div>
        </header>
        </Row>
        


       
        <Row style={{marginRight: '0px !important', marginLeft: '0px !important'}}>
          <Row>
        <Card.Title
            style={{
              height: "22px",
              textAlign: "left",
              fontSize: "20px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
             
              marginBottom:"30px"
            }}
          >
           STEP 5:
          </Card.Title>
          <div style={{fontSize:"15px",color:"#155F9B",marginLeft:"10px",padding: "3px"}}>Download Json</div>
          </Row>
          <Col sm={12}>
          <button type="button" class="btn btn-secondary" style={{width:"16%",padding:"4px",fontSize:"15px"}}>Download Response Unit</button>
          <button type="button" class="btn btn-secondary" style={{width:"16%",padding:"4px",fontSize:"15px"}}>Download Data json</button>
            </Col>
        </Row>
      </div>
    );
  }
}

export default FileUpload;