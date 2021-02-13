import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserService from "../services/user.service";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import ReactTable from "react-table";
import 'react-table/react-table.css'
import './FileUpload.css';


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

class FileUpload extends React.Component {


  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null],
      data: [],
      cols: [],
      selectedFile: null,
      selectedCompany: "",
      companies: [],
      companyData: {},
      finalArray: [],
      loading: false
    };
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCompanyData = this.getCompanyData.bind(this);

    // this.getAllCompanies()
  }

  componentDidMount() {
    let jsonDownload = document.querySelector(".btn-json-download");
          if(jsonDownload){
            jsonDownload.disabled = true;
          }
  }
  getAllCompanies() {
    fetch("http://0dc709431e27.ngrok.io/getAllCompany", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log("Success:", data);
          this.setState({
            companies: data.data
          })
          // alert(data.message)
          console.log(this.state.companies);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message)
      });
  }
  handleChange(e) {
    this.setState({
      selectedFile: e.target.files,
    });
  }

  sendData(e) {
    e.preventDefault();
    var input = document.getElementById('file');
    let submitButton = document.querySelector(".btn-files-submit");
    const data = new FormData();
    console.log(this.state.selectedFile);
    if(this.state.selectedFile && this.state.selectedFile.length > 0){
      this.setState({ loading: true });
      submitButton.disabled = true;
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x]);
    }
    console.log(data.getAll('file'));

    fetch("http://0dc709431e27.ngrok.io/taxonomy", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        submitButton.disabled = false;
        this.setState({ loading: false });
        this.getAllCompanies()
        alert(data.message)
      })
      .catch((error) => {
        console.error("Error:", error);
        submitButton.disabled = false;
        this.setState({ loading: false });
        alert(error.message)
      });
    }
    else{
      alert("Please select file(s) to upload.")
    }

  }

  getCompanyData(e) {
    if (e.target.value == "Select Company") {
      alert("Please Select companies to view data")
    } else {

      this.setState({
        selectedCompany: e.target.value
      })

      const { companyName } = {
        companyName: e.target.value
      }


      let url = `http://0dc709431e27.ngrok.io/getNewData/${companyName}`;

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data.data);

          let jsonDownload = document.querySelector(".btn-json-download");
          if(jsonDownload){
            jsonDownload.disabled = false;
          }

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
          alert(error.message)
        });

    }

  }

  downloadData = () => {
    const { finalArray } = this.state
    const fileName = 'Data.json';
    // Create a blob of the data
    const fileToSave = new Blob([JSON.stringify(finalArray)], {
      type: 'text/plain;charset=utf-8',
      name: fileName
    });
    // Save the file
    saveAs(fileToSave, fileName);
  }


  render() {

    const columns = [{
      Header: 'Year',
      accessor: 'Year',
    }
      , {
      Header: 'DPCode',
      accessor: 'DPCode',
    }

      , {
      Header: 'Response',
      accessor: 'Response',
    }
      , {
      Header: 'Response Unit',
      accessor: 'ResponseUnit',
    }
      , {
      Header: 'Performance Unit',
      accessor: 'PerformanceUnit',
    }

    ]

    let loading = this.state.loading;

    return (

      <div className="container">
        <header className="jumbotron">
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
                <Form.File
                  id="formcheck-api-regular"
                  style={{ width: "459px", height: "83px", fontSize: "12px" }}>
                  <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} style={{
                    top: "322px", left: "406px", width: "459px",
                    background: "#F0F1F4 0% 0% no-repeat padding-box", border: "1px solid #D4D4D428", borderRadius: "4px", opacity: " 1", height: "auto",
                  }} multiple />
                </Form.File>
              </Col>
            </Row>
            <Row>
              <Col sm={6}> </Col>
              <Col sm={6}>
                <button className="btn btn-default">Cancel</button>
                <button className="btn btn-primary btn-files-submit" style={{display:"inline-flex", width:140, alignItems:"center",justifyContent:"center"}} onClick={this.sendData}>
                {loading && (<div><i className="btn-submit-spinner" style={{ marginRight: "5px" }} /></div>)}
                {loading && <div>Uploading Files</div>}
                {!loading && <div>Submit</div>}
                </button>
              </Col>
            </Row>
          </div>
        </header>
        <Row style={{ marginRight: '0px !important', marginLeft: '0px !important' }}>
          <Col sm={6}>
            <h5 style={{ color: "#155F9B" }}>Data Exchange Portal</h5>
            <label>Company Name : {this.state.selectedCompany}</label>
          </Col>
          <Col sm={6}>
            <h6 style={{ height: "22px", textAlign: "left", fontSize: "12px", letterSpacing: "0px", fontWeight: "600", marginBottom: "0px !important" }}>
              Select Company
            </h6>
            <div style={{display:"inline-flex"}}>
            <select onChange={this.getCompanyData} className="select" style={{width:400}}>
              <option>Select Company</option>
              {this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>
            <button className="btn btn-success btn-json-download" style={{width:120,height:30,alignItems:"center"}} onClick={this.downloadData}>Download Json</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="table-col jumbotron" style={{ padding: '0px !important' }}>



            {this.state.finalArray.length > 0 &&
              <ReactTable data={this.state.finalArray} columns={columns} style={{ border: '0px solid rgba(0,0,0,0.1)' }} />
            }

          </Col>
        </Row>
      </div>
    );
  }
}

export default FileUpload;