import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import UserService from "../services/user.service";
import XLSX from 'xlsx';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import readXlsxFile from 'read-excel-file';
   
const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

// Data Exchange Portal

  class FileUpload extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        file: {},
        data: [],
        cols: [],
        selectedFile: {}
      }
      this.sendData = this.sendData.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
      debugger
      const files = e.target.files;
      if (files && files[0]) this.setState({ file: files[0] });

      e.preventDefault();

      this.setState({
          selectedFile: e.target.files[0]
      });    
      
            
    };

    sendData(){
      var input = document.getElementById('file')
      readXlsxFile(input.files[0]).then((rows) => {
        debugger
        // console.log("bcjcbkasjcsa", rows)
        let data = JSON.stringify(rows);

         fetch('http://localhost:3000/masterFileLoad', {
            method: 'post',
            body:  data
        }).then((res) => {
            if(res.ok) {
                console.log(res.data);
                alert("File uploaded successfully.")
            }
      })
    })


    }
    
    render(){
      return (
        <div className="container">
          <header className="jumbotron">
            <Card.Title style={{ height: '22px',textAlign: 'left', fontSize: '12px', letterSpacing: '0px', color: '#155F9B'}}>Upload File</Card.Title>
            <div>
              <Form.File id="formcheck-api-regular" style={{width: '459px',    height: '83px',    fontSize: '12px'}} >
                <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} style={{
                  top: '322px', left: '406px', width: '459px', background: '#F0F1F4 0% 0% no-repeat padding-box', border: '1px solid #D4D4D428', borderRadius: '4px', opacity:' 1', height: 'auto'
                }}/>
              </Form.File>
            </div>
          </header>
          <Row>
            <Col sm={8}></Col>
            <Col sm={4}>  
              <button className="btn btn-default" >Cancel</button>
              <button className="btn btn-primary" onClick={this.sendData}>Submit</button>
            </Col>
          </Row>
          

        </div>
      );
    };
    }

export default FileUpload;
