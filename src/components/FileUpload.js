import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

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
import './FileUpload.css';
import { saveAs } from 'file-saver';

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
      companyName: [],
      btntype:true,
      percentilebtntype:true,
      loading:false,
      percentileloading:false,
      finalArray: [],

    };
    // eslint-disable-next-line no-unused-expressions
    this.exceldownload;
    this.sendData = this.sendData.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.getCompanyData = this.getCompanyData.bind(this);
    this.handleChangeexcel = this.handleChangeexcel.bind(this)

    // this.getAllCompanies()
  }

  componentDidMount() {
    
    let jsonDownload = document.querySelector(".btn-json-download");
          if(jsonDownload){
            jsonDownload.disabled = true;
          }
          let excel_Download = document.querySelector(".btn-excel-download");
          if(excel_Download){
            excel_Download.disabled = true;
          }      
          

  }
  // file json structure has been changed since we used plugin
  handleChangeexcel = (e) => {
    console.log(e,"excels")
    if (!isNullOrUndefined(e.file)){
    console.log(e.file, "e")
    let namearray = [];
    let selectfilename = e.file;
    for (const name of selectfilename) {
      namearray.push(name.name)
    }
    this.setState({
      selectedFile: e.file,
      companyName: namearray
    })
    console.log(this.state.selectedFile, "filesupload");
  }
  else{
    this.setState({
      selectedFile: e.files,
    })
    alert("file deleted");
  }
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
  
  getAllcompany = () => {
    fetch("http://13.234.131.197:3019/getAllCompany", {
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
    console.log(this.state.selectedFile,"**");
    if(this.state.selectedFile && this.state.selectedFile.length > 0){
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x].rawFile);
    }
    //console.log(data.getAll('file'),"oooooo");
    for (var value of data.values()) {
      console.log(value,"checking values of formdata");
   }

    fetch("http://13.234.131.197:3019/taxonomy ", {
      method: "POST",
      body: data,
      
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          let jsonDownload = document.querySelector(".btn-json-download");
          if(jsonDownload){
            jsonDownload.disabled = true;
          }
          let excel_Download = document.querySelector(".btn-excel-download");
          if(excel_Download){
            excel_Download.disabled = true;
          }
          
          this.setState({
            btntype:true,
            percentilebtntype:true,
          })
          this.getAllcompany()
          console.log("Success:", data);
          alert(data.message)
        }
      })
      .catch((error) => {

        console.error("Error:", error);
        alert(error.message)
      });}
      else{
        alert("Please Attach Aleast One File");
      }

  }
  getjsondata =()=>{
    
    let companyname=this.state.selectedCompany;
    let url = `http://13.234.131.197:3019/getNewData/${companyname}`;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
     
      alert("Percentile Calculation Completed Successfully");
      let jsonDownload = document.querySelector(".btn-json-download");
      if(jsonDownload){
        jsonDownload.disabled = false;
      }
      let excel_Download = document.querySelector(".btn-excel-download");
      if(excel_Download){
        excel_Download.disabled = false;
      }
      
      console.log("Success:", data);

     
      this.setState({
        companyData: data,
        percentileloading:false
      })
      let jsonarray = [];
      for (let arr of this.state.companyData.data.fiscalYear) {
        for (let arrOne of arr) {
          for (let arrTwo of arrOne.Data) {
            // console.log(arrTwo);
            jsonarray.push(arrTwo)
          }
          // console.log(arrOne.Data);
        }

      }
      this.setState({ finalArray: jsonarray });
      console.log("JSON LIST", this.state.finalArray)
    })
    .catch((error) => {

      console.error("Error:", error);
      
    });
}

  
  getCompanyData(e) {

    if (e.target.value === "Select Company") {
      alert("Please Select companies to view data")
    } else {

      this.setState({
        selectedCompany: e.target.value,
        btntype : false
      })
      const { companyName } = {
        companyName: e.target.value
      }
  
      let url = `http://13.234.131.197:3019/getNewData/${companyName}`;
  
      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
  
          console.log("Success:", data);

         
          this.setState({
            companyData: data
          })
          let array = [];
          for (let arr of this.state.companyData.data.fiscalYear) {
            for (let arrOne of arr) {
              for (let arrTwo of arrOne.Data) {
                // console.log(arrTwo);
                array.push(arrTwo)
              }
              // console.log(arrOne.Data);
            }

          }
          this.setState({ finalArray: array });
          console.log("JSON LIST", this.state.finalArray)
        })
        .catch((error) => {
  
          console.error("Error:", error);
          
        });
    }
  }

  getCompanyCalculation=()=>{
    const { companyName } = {
      companyName: this.state.selectedCompany
    }
    this.setState({
      loading:true
    })
    let url = `http://13.234.131.197:3019/calculation/${companyName}`;

    fetch(url, {
      method: "POST",
      
    })
      .then((response) => response.json())
      .then((data) => {
       
        console.log("Success:", data);
        alert("Calculation Completed Successfully");
        this.setState({
          loading:false,
          percentilebtntype:false
        })
        
      })
      .catch((error) => {
        this.setState({
          loading:false
        })
        console.error("Error:", error);
        alert(error.message)
      });

  }

  getPercentileCalculation =()=>{
   let nameofcompany=this.state.selectedCompany;
    this.setState({
      percentileloading:true
    })
    
      
      let url = `http://13.234.131.197:3019/percentile/${nameofcompany}`;

      fetch(url, {
        method: "POST",
        
      })
      .then((response) => response.json())
      .then((data) => {
        this.getjsondata();
        console.log("percentileSuccess:", data);
        
        
       
      })
      .catch((error) => {
        this.setState({
          percentileloading:false
        })
        
        alert(error.message)
      });
    }
  
     

  downloadData = () => {
    
    console.log(this.state.companyData,"company data")
    const { companyData } = this.state
    const fileName = this.state.selectedCompany+".json";
    // Create a blob of the data
    const fileToSave = new Blob([JSON.stringify(companyData)], {
    type: 'text/plain;charset=utf-8',
    name: fileName
     });
    // Save the file
    saveAs(fileToSave, fileName);
  }
  downloadExcel=()=>{
    this.exceldownload.link.click();
  }
  
  render() {
    const fileName_excel = this.state.selectedCompany+".CSV";
    let loading = this.state.loading;
    let percentile_loader =this.state.percentileloading;
    

    const FileNameinfo = (arg) => {
      let filenames = arg.data;
      console.log(filenames, "filenames");
      if (!isNullOrUndefined(filenames)) {
        if (filenames.length > 1) {
          return (
            <div>
              <div>
                {filenames.map((filename) => (
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
            marginBottom: "50px"
          }}
        >
          Data Uploading
          </Card.Title>
        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",
                marginBottom: "50px"
              }}
            >
              STEP 1:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Excel</div>
          </Row>
          <header className="jumbotron" style={{ width: "100%" }}>
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
              Upload Environmental, Social And Governance File(s)
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
                <Col sm={5} style={{ marginTop: "20px" }}>

                  <button className="btn btn-primary" style={{ fontSize: "15px" }} onClick={this.sendData} >
                    Upload
                </button>
                </Col>
              </Row>
            </div>
          </header>
        </Row>
        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",

                marginBottom: "50px"
              }}
            >
              STEP 2:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Calculate Derived Data Points</div>
          </Row>
          <Col sm={12}>
            <div style={{ marginBottom: "50px" }}> <h5 style={{ color: "#155F9B" }}><select style={{height:"35px",margin:"0 5px",width: "25%", fontSize: "15px" }} onChange={this.getCompanyData} className="select">
              <option>Select Company</option>
              { !isNullOrUndefined(this.state.companies)?this.state.companies.map((company)=>(<option>{company}</option>)):alert("no data")}
              {/*{this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}*/}
            </select></h5></div>
          </Col>
          <Col sm={12}>
            <div style={{ marginBottom: "50px" }}> <h5 style={{ color: "#155F9B" }}><button className="btn btn-primary" onClick={this.getCompanyCalculation} style={{ width: "25%", fontSize: "15px", display:"inline-flex", alignItems:"center",justifyContent:"center"}} disabled={this.state.loading? true : this.state.btntype}>
            {loading && (<div><i className="btn-submit-spinner" style={{ marginRight: "5px" }} /></div>)}
                {loading && <div>Calculating</div>}
                {!loading && <div>Calculate Derived Data</div>}
                </button></h5></div>
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



        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",

                marginBottom: "50px"
              }}
            >
              STEP 3:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Calculate performance unit </div>
          </Row>
          <Col sm={12}>
            <div style={{ marginBottom: "50px" }}> <h5 style={{ color: "#155F9B" }}><button className="btn btn-primary" style={{ width: "25%", fontSize: "15px", display:"inline-flex", alignItems:"center",justifyContent:"center" }} onClick={this.getPercentileCalculation} disabled={this.state.percentile_loader? true : this.state.percentilebtntype}>
            {percentile_loader && (<div><i className="btn-submit-spinner" style={{ marginRight: "5px" }} /></div>)}
                {percentile_loader && <div>Calculating</div>}
                {!percentile_loader && <div>Calculate performance unit</div>} 
              
              </button></h5></div>
           
          </Col>
        </Row>

        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",

                marginBottom: "50px"
              }}
            >
              STEP 4:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Controversies  (optional)</div>
          </Row>
          <header className="jumbotron" style={{ width: "100%" }}>
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

                <Col sm={5} style={{ marginTop: "20px" }}>

                  <button className="btn btn-primary" style={{ fontSize: "15px" }} onClick={this.sendData}>
                    Upload
                </button>
                </Col>
              </Row>
            </div>
          </header>
        </Row>




        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",

                marginBottom: "50px"
              }}
            >
              STEP 5:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Download Json</div>
          </Row>
          <Col sm={12}>
            <button type="button" class="btn btn-secondary btn-json-download" onClick={this.downloadData} style={{ width: "20%", height: "40px",padding: "4px", fontSize: "2vh",marginBottom:"20px" }}>Download Data Json</button>
            <button type="button" class="btn btn-success btn-excel-download" onClick={this.downloadExcel} style={{ width: "25%",height: "40px", padding: "4px", fontSize: "2vh",marginBottom:"20px" }} >Download Data json as excels</button>
            <div>
                       <CSVLink 
                       data={this.state.finalArray} 
                        filename={fileName_excel}
                        className="hidden"
                        ref={(r) => this.exceldownload = r}
                        target="_blank"/>
                        </div>
            <button type="button" class="btn btn-secondary" style={{ width: "20%",height: "40px", padding: "4px", fontSize: "2vh" }} disabled={true}>Download Controversies</button>
          </Col>
        </Row>

        <Row style={{ marginTop:"50px",marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Row>
            <Card.Title
              style={{
                height: "22px",
                textAlign: "left",
                fontSize: "20px",
                letterSpacing: "0px",
                color: "#155F9B",
                fontWeight: "600",

                marginBottom: "50px"
              }}
            >
              STEP 6:
          </Card.Title>
            <div style={{ fontSize: "15px", color: "#155F9B", marginLeft: "10px", padding: "3px" }}>View Data</div>
          </Row>
          <Col sm={12}>
            <button type="button" class="btn btn-primary" onClick={()=>{this.props.history.push('/viewdata')}} style={{ width: "16%", padding: "4px", fontSize: "15px" }}>View Data Table</button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileUpload;