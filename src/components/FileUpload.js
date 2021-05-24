
import React, { useState, useEffect } from "react";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVLink } from "react-csv";
import Fileuploader from './FileUploader.tsx';
import './FileUpload.css';
import { saveAs } from 'file-saver';


 import { Container } from 'react-bootstrap';
//import { toast } from "react-toastify";
// import { CSVLink } from "react-csv";
// import Fileuploader from './FileUploader.tsx';
// import './FileUpload.css';
import Select from 'react-select';
import { Spin, Space  } from 'antd';
import 'antd/dist/antd.css';
// import { saveAs } from 'file-saver';

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
      //selectedFile: undefined,
      selectedCompany: "",
      companies: [],
      companyData: {},
      companyName: [],
      btntype:true,
      percentilebtntype:true,
      loading:false,
      spinner:false,
      percentileloading:false,
      finalArray: [],

    };
    // eslint-disable-next-line no-unused-expressions
    this.exceldownload;
    // this.sendData = this.sendData.bind(this);
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
    console.log(e,"excels");
    if (!isNullOrUndefined(e.fileData)){
      const selectedFiles= e.fileData;

    // start 

    const data = new FormData();
    //console.log(this.state.selectedFile,"**");
    if(selectedFiles && selectedFiles.length > 0){
    for (var x = 0; x < selectedFiles.length; x++) {
      data.append("file", selectedFiles[x].rawFile);
    }
    this.setState({
      spinner:true
    })
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    console.log(this.state.spinner, 'before api call');
    fetch("http://65.1.140.116:9010/standalone_datapoints/upload-company-esg?access_token="+token, {
      method: "POST",
      body: data,
      
    })
      .then((response) => response.json())
      
      .then((data) => {
        console.log(data.message, 'message');
        if (data.message === "Files uploaded successfully") {
          alert(data.message);
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
            spinner:false
          })
          // this.getAllcompany()
          console.log("Success:", data);
        }
      })
      .catch((error) => {

        console.error("Error:", error);
        alert(error.message)
      });}
      else{
        alert("Please Attach Aleast One File");
      }

// end
    }
  }

  
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
  // sendData() {
  //   const data = new FormData();
  //   console.log(this.state.selectedFile,"**");
  //   if(this.state.selectedFile && this.state.selectedFile.length > 0){
  //   for (var x = 0; x < this.state.selectedFile.length; x++) {
  //     data.append("file", this.state.selectedFile[x].rawFile);
  //   }
  //   //console.log(data.getAll('file'),"oooooo");
  //   for (var value of data.values()) {
  //     console.log(value,"checking values of formdata");
  //  }

  //   fetch("http://13.234.131.197:3019/taxonomy ", {
  //     method: "POST",
  //     body: data,
      
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status === 200) {
  //         let jsonDownload = document.querySelector(".btn-json-download");
  //         if(jsonDownload){
  //           jsonDownload.disabled = true;
  //         }
  //         let excel_Download = document.querySelector(".btn-excel-download");
  //         if(excel_Download){
  //           excel_Download.disabled = true;
  //         }
          
  //         this.setState({
  //           btntype:true,
  //           percentilebtntype:true,
  //         })
  //         this.getAllcompany()
  //         console.log("Success:", data);
  //         alert(data.message)
  //       }
  //     })
  //     .catch((error) => {

  //       console.error("Error:", error);
  //       alert(error.message)
  //     });}
  //     else{
  //       alert("Please Attach Aleast One File");
  //     }

  // }
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

  
  getCompanyData(dropdpwncompany) {

      console.log(dropdpwncompany,'companyName')
      this.setState({
        selectedCompany: dropdpwncompany.value,
        btntype : false
      })
  
      let url = `http://13.234.131.197:3019/getNewData/${dropdpwncompany.value}`;
  
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
    let spinner = this.state.spinner;
    let percentile_loader =this.state.percentileloading;
    const allCompanyList = this.state.companies && this.state.companies.map((company) => {
        const listObj={value:company,label:company};
        return listObj;
    });
    console.log(allCompanyList, 'allCompanyList');
    console.log(this.state.selectedCompany,'this.state.selectedCompany');
    const allNICList =[
      { value:'NIC001', label:'NIC001'},
      { value:'NIC002', label:'NIC002'},
      { value:'NIC003', label:'NIC003'},
      { value:'NIC004', label:'NIC004'},
      { value:'NIC005', label:'NIC005'},
      { value:'NIC006', label:'NIC006'},
      { value:'NIC007', label:'NIC007'},
      { value:'NIC008', label:'NIC008'},
      { value:'NIC009', label:'NIC009'},
      { value:'NIC010', label:'NIC010'},
      { value:'NIC011', label:'NIC011'},

    ]
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
      <div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'6%'}}>
          <div style={{fontSize:'1.5rem', color: "#155F9B", fontWeight:'600'}}>Data Uploading</div>
        </div>
        
      <Container style={{padding:'3% 3% 0% 3%', background:'white', borderRadius:'8px'}}>
        {/* <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'5%'}}>
          <div style={{fontSize:'1.5rem', color: "#155F9B", fontWeight:'600'}}>Data Uploading</div>
        </div> */}
        <Space size="middle">
        <Spin size="large" spinning={spinner} tip="Uploading...">
        <Row>
          <Col lg={12} style={{marginBottom:'5%'}}>
              <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
                <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 1:</div>
                <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Excel</div>
              </div>
              <div style={{marginLeft:'5%'}}>
                <header className="jumbotron" style={{ width: "100%", margin:'0px' }}>
                  <div style={{fontSize: "12px",color: "#155F9B",fontWeight: "600", marginBottom:'0.75rem'}}>Upload Environmental, Social And Governance File(s)</div>
                  <div>
                    <Fileuploader filenameHandle={this.handleChangeexcel} ></Fileuploader>
                  </div>
                </header>
              </div>
          </Col>

          {/* <Col lg={12} style={{marginBottom:'5%'}}>
              <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
                <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 2:</div>
                <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Calculate Derived Data Points</div>
              </div>
              <div style={{display:'flex', flexDirection:'column',minHeight:'7rem',justifyContent:'space-between', marginLeft:'5%'}}>
                <div  style={{fontSize: "12px",color: "#155F9B",fontWeight: "600"}}>Select Company*</div>
                <div style={{maxWidth: '40%', minWidth:'300px'}}>
                  <Select 
                  options={allCompanyList}
                  onChange={this.getCompanyData}
                  />
                </div>
                <div>
                  <button className="btn btn-primary" onClick={this.getCompanyCalculation} style={{ fontSize: "15px", display:"inline-flex", alignItems:"center",justifyContent:"center", minWidth:'12rem',margin:'0px'}} disabled={this.state.loading? true : this.state.btntype}>
                    {loading && (<div><i className="btn-submit-spinner" style={{ marginRight: "5px" }} /></div>)}
                    {loading && <div>Calculating</div>}
                    {!loading && <div>Calculate Derived Data</div>}
                  </button>
                </div>
              </div>
          </Col> */}
          <Col lg={12} style={{marginBottom:'5%'}}>
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 2:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Calculate performance unit </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <div style={{display:'flex', flexDirection:'column',minHeight:'7rem',justifyContent:'space-between'}}>
                <div  style={{fontSize: "12px",color: "#155F9B",fontWeight: "600"}}>Select NIC code*</div>
                <div style={{maxWidth: '40%', minWidth:'300px'}}>
                  <Select 
                  options={allNICList}
                  // onChange={this.getCompanyData}
                  />
                </div>
              <button className="btn btn-primary" style={{ minWidth: "13rem", fontSize: "15px", display:"inline-flex", alignItems:"center",justifyContent:"center" ,margin:'0px'}} onClick={this.getPercentileCalculation} disabled={this.state.percentile_loader? true : this.state.percentilebtntype}>
                  {percentile_loader && (<div><i className="btn-submit-spinner" style={{ marginRight: "5px" }} /></div>)}
                  {percentile_loader && <div>Calculating</div>}
                  {!percentile_loader && <div> performance unit</div>} 
              </button>
            </div>
            </div>

          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 4:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Controversies  (optional) </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
                <header className="jumbotron" style={{ width: "100%" }}>
                  <div style={{fontSize: "12px",color: "#155F9B",fontWeight: "600", marginBottom:'0.75rem'}}>Upload Controversies</div>
                  <div>
                    <Fileuploader filenameHandle={this.handleChangeexcel}></Fileuploader>
                  </div>
                  {/* <div>
                      <button className="btn btn-primary" style={{ fontSize: "15px" }} onClick={this.sendData} >
                        Upload
                      </button>
                  </div> */}
                </header>
              
              <div>
              <button type="button" className="btn btn-secondary" style={{ minWidth: "13rem", fontSize: "15px", marginRight:'0px', marinRight:'0px' }} disabled={true}>Download Controversies</button>
              </div>
              </div>
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 5:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Download JSON </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', marginLeft:'5%'}}>

            <button type="button" className="btn btn-secondary btn-json-download" onClick={this.downloadData} style={{ minWidth: "13rem", fontSize: "15px",marginBottom:"20px",marginRight:'0px', maringLeft:'0px' }}>Download Data Json</button>
             <button type="button" className="btn btn-success btn-excel-download" onClick={this.downloadExcel} style={{ width: "13rem", fontSize: "15px",marginBottom:"20px", marginRight:'0px', maringLeft:'0px' }} >Download Data json as excel</button>
             <div>
                        <CSVLink 
                       data={this.state.finalArray} 
                        filename={fileName_excel}
                        className="hidden"
                        ref={(r) => this.exceldownload = r}
                        target="_blank"/>
              </div>
                      
            </div>
        
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
          <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 6:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>View Data </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <button type="button" className="btn btn-primary" onClick={()=>{this.props.history.push('/viewdata')}} style={{ minWidth: "10rem", padding: "4px", fontSize: "15px" }}>View Data Table</button>
            </div>
          </Col>

        </Row>
        </Spin>
        </Space>
      </Container>
     
      </div>
    );
  }
}

export default FileUpload;