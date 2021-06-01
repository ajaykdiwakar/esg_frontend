
import React, { useState, useEffect } from "react";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVLink } from "react-csv";
import Fileuploader from './FileUploader.tsx';
import './FileUpload.css';
import { saveAs } from 'file-saver';
import Controversyuploader from './ControversyUpload';
import { Container } from 'react-bootstrap';
import Select from 'react-select';
import { Spin, message } from 'antd';
import 'antd/dist/antd.css';
;


class FileUpload extends React.Component {

 
  fileObj = [];
  fileArray = [];

  constructor(props) {
    
    super(props);
    this.state = {
      file: [null],
      data: [],
      cols: [],
      selectedCompany: "",
      companies: [],
      companyData: [],
      companyName: [],
      companyID: "",
      btntype:true,
      percentilebtntype:true,
      loading:false,
      spinner:false,
      controversyspinner:false,
      percentileloading:false,
      finalArray: [],
      conroversycompanyData:[],
      controversyFinalArray:[],
      status_dd:true,
      status_nic_dd:true,
      selectedControversyname:"",
      nicCodeList:[],
      nicValue:'',
      mod_year1:[],
      mod_year2:[],
      firstyear:'',
      secyear:'',
    };
    // eslint-disable-next-line no-unused-expressions
    this.exceldownload;
    // eslint-disable-next-line no-unused-expressions
    this.exceldownload1;
    this.getCompanyData = this.getCompanyData.bind(this);
    this.handleChangeexcel = this.handleChangeexcel.bind(this)
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
          let controversy_Download = document.querySelector(".btn-controversy-download");
          if(controversy_Download){
            controversy_Download.disabled = true;
          }      
          //this.getNicCode();
          //this.getjsondata();
  }
  // success Message after uploading...
  success = () => {
    
    message.success({
      content: 'File Uploaded Successfully',
      className: 'custom-class',
     // duration:13467456,
      style: {
        marginTop: '6vh',
      },
    });
  };
  

  handleControversyexcel =(args) =>{
    if (!isNullOrUndefined(args.fileData) ){
     
      const selectedControversyFiles= args.fileData;
    // start 
      const controversydata = new FormData();
      //console.log(this.state.selectedFile,"**");
      if(selectedControversyFiles && selectedControversyFiles.length > 0){
      for (var x = 0; x < selectedControversyFiles.length; x++) {
        controversydata.append("file", selectedControversyFiles[x].rawFile);
      }
      this.setState({
        controversyspinner:true,
        //selectedControversyname:selectedControversyFiles.name,
      })

      fetch("http://13.234.131.197:3019/controversy", {
        method: "POST",
        body: controversydata,
        
      })
        .then((response) => response.json())
        
        .then((data) => {
          console.log(data, 'controversy data result');
          if (data.status === 200) {
          
            console.log(data.companyID,'data comp id')
            this.setState({
              btntype:true,
              percentilebtntype:true,
              controversyspinner:false,
              companyID:data.companyID,
            })
          }
          this.getControversyjsondata();
          this.success();
          
        })
        .catch((error) => {
          this.setState({controversyspinner:false,});
          console.error("Error:", error);
          message.error(error.message)
        });
    }
      else{
        message.warning("Please Attach Aleast One File");
      }

// end
    }
    
  }
  // get controversy json wrt years
  getControversyjsondata =()=>{
    
    let companyid=this.state.companyID;
    let url = `http://13.234.131.197:3019/getcontroversy/${companyid}`;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
     
     
      let controversyDownload = document.querySelector(".btn-controversy-download");
      if(controversyDownload){
        controversyDownload.disabled = false;
      }
  
      
      console.log("controversy get value Success:", data);

     
      this.setState({
        conroversycompanyData: data,
        percentileloading:false
      })
      
     })
    .catch((error) => {

      console.error("Error:", error);
      
    });
}


  handleChangeexcel = (e) => {
    console.log(e,"excels");
    if (!isNullOrUndefined(e.fileData)){
      const selectedFiles= e.fileData;

    // start 

    const data = new FormData();
    if(selectedFiles && selectedFiles.length > 0){
    for (var x = 0; x < selectedFiles.length; x++) {
      data.append("file", selectedFiles[x].rawFile);
    }
    this.setState({
      spinner:true
    })
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    
    fetch("http://65.1.140.116:9010/standalone_datapoints/upload-company-esg?access_token="+token, {
      method: "POST",
      body: data,
      
    })
      .then((response) => response.json())
      
      .then((data) => {
        
        if (data.message === "Files upload success") {
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
            this.success();
            this.getAllcompany();
            console.log("Success:", data);
        }
        if(data.message ==="Found invalid date format in undefined, please correct and try again!"){
          this.setState({
            spinner:false
          })
          message.warning(data.message);
        }
      })
      .catch((error) => {

        this.setState({
          spinner:false
        })
        message.error(error.message)
      });}
      else{
        message.warning("Please Attach Aleast One File");
      }

// end
    }
  }

  
  getAllcompany = () => {
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    fetch("http://65.1.140.116:9010/companies?access_token="+token, {
      method: "GET"
    })
      .then((response) =>
        response.json())
      .then((data) => {       
        this.setState({
          companies: data.rows,
          status_dd:false,
          spinner:false
        })
      
      })
      .catch((error) => {

        console.error("Error:", error);
        message.error(error.message)
      });
  }

 
  
  getCompanyData(dropdowncompany) {

      console.log(dropdowncompany.value,'companyName')
      this.setState({
        selectedCompany: dropdowncompany,
        btntype : false
      })
  }
  getjsondata =()=>{
    
    const companyname=this.state.selectedCompany.value;
    const val= "60b0e311b09656fa36da9fbe";
    console.log(companyname, 'companyname get json');
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+val+'?access_token='+token;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
      let jsonDownload = document.querySelector(".btn-json-download");
      if(jsonDownload){
        jsonDownload.disabled = false;
      }
      let excel_Download = document.querySelector(".btn-excel-download");
      if(excel_Download){
        excel_Download.disabled = false;
      }
      
      console.log("get data Success:", data);
      const year1 =data.year1;
      const year2 =data.year2;
      const mod_year1 = year1;
      const mod_year2= year2;
      const firstyear= year1 && year1[0].year;
      const secyear= year2 && year2[0].year;
      const modifiedjsondata =[{ year:year1[0].year, Data:year1}, {year:year2[0].year, Data:year2}]
     console.log(modifiedjsondata, 'modifiedjsondata');
      this.setState({
        companyData: modifiedjsondata,
        mod_year1:mod_year1,
        mod_year2:mod_year2,
        firstyear:firstyear,
        secyear:secyear,
        percentileloading:false
      })
      message.success("percentile calculated successfully");
    })
    .catch((error) => {

      console.error("Error:", error);
      
    });
}

  getCompanyCalculation=()=>{
    
     const companyName= this.state.selectedCompany.value;
    
    this.setState({
      loading:true
    })
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url = "http://65.1.140.116:9010/derived_datapoints/calculate/"+companyName+"?access_token="+token;

    fetch(url, {
      method: "GET",
      
    })
      .then((response) => response.json())
      .then((data) => {
        
        console.log("Derived Calc Success:", data);
         this.getNicCode();
        message.success("Derived Calculation Completed Successfully");
        this.setState({
          loading:false,
          percentilebtntype:true
        })
        
      })
      .catch((error) => {
        this.setState({
          loading:false
        })
        console.error("Error:", error);
        message.error(error.message)
      });

  }

  // GET NIC CODE //
  getNicCode= () =>{

    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url = "http://65.1.140.116:9010/companies/all_nic?access_token="+token;

    fetch(url, {
      method: "GET",
      
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          status_nic_dd:false,
        })
       
        this.setState({
          nicCodeList:data.rows,
        });
        
      })
      .catch((error) => {
        this.setState({
          status_nic_dd:true,
        })
        console.error("Error:", error);
        message.error(error.message)
      });

  }


  getPercentileCalculation =()=>{
   const nic=this.state.nicValue;
    this.setState({
      percentileloading:true
    })
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url =' http://65.1.140.116:9010/polarity_rules/calculate_percentile/'+nic+'?access_token='+token;
    

      fetch(url, {
        method: "GET",
        
      })
      .then((response) => response.json())
      .then((data) => {
        
        console.log("percentileSuccess:", data);
        this.getjsondata()
       
       
      })
      .catch((error) => {
        this.setState({
          percentileloading:false
        })
        
        message.error(error.message)
      });
    }
  
    downloadControversyData = () => {
    
      console.log(this.state.conroversycompanyData.data," controversy company data")
      const { conroversycompanyData } = this.state;
      
      // Create a blob of the data
      conroversycompanyData.data.map((args)=>{
        const fileName = args.companyName+"["+ args.year+"]"+".json";
        const fileToSave = new Blob([JSON.stringify(args.Data)], {
          type: 'text/plain;charset=utf-8',
          name: fileName,
           });
          // Save the file
          saveAs(fileToSave, fileName);
        })
     
    }  

  downloadData = () => {
    
      
    const { companyData } = this.state
   // const fileName = this.state.selectedCompany+".json";
    // Create a blob of the data
    companyData.map((args)=>{
      const fileName =this.state.selectedCompany.label+"["+ args.year+"]"+".json";
      const fileToSave = new Blob([JSON.stringify(args.Data)], {
        type: 'text/plain;charset=utf-8',
        name: fileName,
         });
        // Save the file
        saveAs(fileToSave, fileName);
      })
   
 
  }
  downloadExcel=()=>{
    this.exceldownload.link.click();
    this.exceldownload1.link.click();
  }

  getNiccode=(arg)=>{
console.log(arg, 'nic arg');
this.setState({
  nicValue:arg.value,
  percentilebtntype:false,
})
  }

  
  render() {
    const excel1= this.state.mod_year1;
    const excel2=this.state.mod_year2;
    console.log(excel1,'excel1');
    console.log(this.state.secyear,'secyear');
    const fileName_excel1 = this.state.selectedCompany.label+"["+this.state.firstyear+"]"+".CSV";
    const fileName_excel2 = this.state.selectedCompany.label+"["+this.state.secyear+"]"+".CSV";
    let loading = this.state.loading;
    let spinner = this.state.spinner;
    let percentile_loader =this.state.percentileloading;
    const allCompanyList = this.state.companies && this.state.companies.map((company) => {
        const listObj={value:company.id,label:company.companyName};
        return listObj;
    });
    let status_dd= this.state.status_dd;
    let status_nic_dd = this.state.status_nic_dd;
    let nicCode = this.state.nicCodeList;
    const nicCodeOption =nicCode && nicCode.map((ele)=>{
      const modifiedNiccode ={value:ele, label:ele };
      return modifiedNiccode;
    })
    console.log(nicCode,"nicCode");
    

    return (
      <div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:'6%'}}>
          <div style={{fontSize:'1.5rem', color: "#155F9B", fontWeight:'600'}}>Data Uploading</div>
        </div>
        
      <Container style={{padding:'3% 3% 0% 3%', background:'white', borderRadius:'8px'}}>
        <Row>
          <Col lg={12} style={{marginBottom:'5%'}}>
          <Spin size="large" spinning={spinner} tip="Uploading..." >
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
              </Spin>
          </Col>
          

          <Col lg={12} style={{marginBottom:'5%'}}>
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
                  isDisabled={status_dd}
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
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 3:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Calculate performance unit </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <div style={{display:'flex', flexDirection:'column',minHeight:'7rem',justifyContent:'space-between'}}>
                <div  style={{fontSize: "12px",color: "#155F9B",fontWeight: "600"}}>Select NIC code*</div>
                <div style={{maxWidth: '40%', minWidth:'300px'}}>
                  <Select 
                  options={nicCodeOption}
                  isDisabled={status_nic_dd}
                  onChange={this.getNiccode}
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
          <Spin size="large" spinning={this.state.controversyspinner} tip="Uploading..." >
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 4:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Controversies  (optional) </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
                <header className="jumbotron" style={{ width: "100%" }}>
                  <div style={{fontSize: "12px",color: "#155F9B",fontWeight: "600", marginBottom:'0.75rem'}}>Upload Controversies</div>
                  <div>
                    <Controversyuploader   controversyHandle={this.handleControversyexcel}></Controversyuploader>
                  </div>
                </header>
              
              <div>
              <button type="button" className="btn btn-secondary btn-controversy-download" style={{ minWidth: "13rem", fontSize: "15px", marginRight:'0px', marinRight:'0px' }} onClick={this.downloadControversyData} >Download Controversies</button>
              </div>
              </div>
              </Spin>
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 5:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Download JSON </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', marginLeft:'5%'}}>

            <button type="button" className="btn btn-secondary btn-json-download" onClick={this.downloadData} style={{ minWidth: "13rem", fontSize: "15px",marginBottom:"20px",marginRight:'0px', maringLeft:'0px' }}>Download Data Json</button>
             <button type="button" className="btn btn-success btn-excel-download" onClick={this.downloadExcel} style={{ width: "14rem", fontSize: "15px",marginBottom:"20px", marginRight:'0px', maringLeft:'0px' }} >Download Data json as excel</button>
             <div>
                        <CSVLink 
                        
                       data={excel1} 
                        filename={fileName_excel1}
                        className="hidden"
                        ref={(r) => this.exceldownload = r}
                        target="_blank"
                         />
                         <CSVLink 
                        
                        data={excel2} 
                         filename={fileName_excel2}
                         className="hidden"
                         ref={(r) => this.exceldownload1 = r}
                         target="_blank"
                          />
              </div>
                      
            </div>
        
          </Col>
          {/* <Col lg={12} style={{marginBottom:'5%'}}>
          <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 6:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>View Data </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <button type="button" className="btn btn-primary" onClick={()=>{this.props.history.push('/viewdata')}} style={{ minWidth: "10rem", padding: "4px", fontSize: "15px" }}>View Data Table</button>
            </div>
          </Col> */}

        </Row>
       
        
      </Container>
     
      </div>
    );
  }
}

export default FileUpload;