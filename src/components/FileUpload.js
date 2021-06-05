
import React, { useState, useEffect } from "react";
import { isNullOrUndefined, removeChildInstance } from "@syncfusion/ej2-base";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVLink } from "react-csv";
import { DialogUtility } from '@syncfusion/ej2-popups';
import { ExportToCsv } from 'export-to-csv';
import Fileuploader from './FileUploader.tsx';
import './FileUpload.css';
import { saveAs } from 'file-saver';
import Controversyuploader from './ControversyUpload';
import { Container } from 'react-bootstrap';
import Select from 'react-select';
import { Spin,notification } from 'antd';
import 'antd/dist/antd.css';


class FileUpload extends React.Component {

 
  fileObj = [];
  fileArray = [];
  confirmPopup='';
  confirmPopup_controversy='';
  removeFile=[];
  removeFile_controversy=[];

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
      companyID: [],
      btntype:true,
      percentilebtntype:true,
      loading:false,
      spinner:false,
      controversyspinner:false,
      percentileloading:false,
      conroversycompanyData:[],
      status_dd:true,
      status_nic_dd:true,
      nicCodeList:'',
      status_selectControversy_dd:true,
      content_file_attached_status:"",
      content_file_attached_status_Controversy:"",
      selected_conFile:[],
      nicValue:'',
      status_delete:false,
      status_delete_controversy:false,
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
          let controversyexcel_Download = document.querySelector(".btn-controversyexcel-download");
          if(controversyexcel_Download){
            controversyexcel_Download.disabled = true;
          } 
         
  }

 
  handleControversyexcel =(args) =>{
    if (!isNullOrUndefined(args.fileData) ){
     
      const selectedControversyFiles= args.fileData;
    // start 
      const controversydata = new FormData();
      if(selectedControversyFiles && selectedControversyFiles.length > 0){
      for (var x = 0; x < selectedControversyFiles.length; x++) {
        controversydata.append("file", selectedControversyFiles[x].rawFile);
      }
      this.setState({
       controversyspinner:true,
      })
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
      fetch("http://65.1.140.116:9010/controversies/upload?access_token="+token, {
        method: "POST",
        body: controversydata,
        
      })
        .then((response) => response.json())
        
        .then((data) => {
          console.log(data, 'controversy data result');
          if (data.message === 'Files upload success') {
          
            const n =this.state.content_file_attached_status_Controversy;
            console.log(n,"selected file length");
            [...Array(n)].map((e, i) => {
              document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
            });
           
            [...Array(n)].map((e, i) => {
              document.getElementsByClassName('e-file-delete-btn')[i].style.display='none';
            });
            
            document.querySelector('.e-file-clear-btn').style.display='none';
            this.setState({
              btntype:true,
              percentilebtntype:true,
             controversyspinner:false,
              companyID:data.companies,
              status_selectControversy_dd:false,
              
            })
           
            notification.success({message: 'File Uploaded Successfully',duration:0})
          }else{
            
            const n =this.state.content_file_attached_status_Controversy;
            console.log(n,"selected file length");
            [...Array(n)].map((e, i) => {
              document.getElementsByClassName('e-file-status')[i].innerHTML="Remove and try again";
            });
            document.querySelector('.e-file-clear-btn').style.display='none';
          }
         
         
          
        })
        
        .catch((error) => {
          this.setState({controversyspinner:false,});
          console.error("Error:", error);
          notification.error({message:error.message,duration:0})
          
        });
    }
      else{
        
        notification.warning({message:"Please Attach Aleast One File",duration:0})
      }

// end
    }
    
  }
  getControversycompany=(arg)=>{
    console.log(arg, 'selected con company');
    this.setState({
      selected_conFile:arg,

    })
    this.getControversyjsondata(arg);
  }
  // get controversy json wrt years
  getControversyjsondata =(arg)=>{
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url = `http://65.1.140.116:9010/controversies/json/${arg.value}?access_token=`+token;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
     
     
      let controversyDownload = document.querySelector(".btn-controversy-download");
      if(controversyDownload){
        controversyDownload.disabled = false;
      }
      let controversyexcel_Download = document.querySelector(".btn-controversyexcel-download");
          if(controversyexcel_Download){
            controversyexcel_Download.disabled = false;
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
          const n =this.state.content_file_attached_status;
          console.log(n,"selected file length");
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
          });
         
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-delete-btn')[i].style.display='none';
          });
          document.querySelector('.e-file-clear-btn').style.display='none';
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
              companies:data.companies,
              nicCodeList:data.nicList,
              spinner:false,
              status_dd:false,
            })
          
            notification.success({message: 'File Uploaded Successfully',duration:0})
            //this.getAllcompany();
            console.log("Success:", data);
        }else{
         
          const n =this.state.content_file_attached_status;
          console.log(n,"selected file length");
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-status')[i].innerHTML="Remove and try again";
          });
          document.querySelector('.e-file-clear-btn').style.display='none';
        
          this.setState({
                   spinner:false
                 });
          
          notification.warning({message:data.message,duration:0})
        }
       })
      .catch((error) => {

        this.setState({
          spinner:false
        })
       
        notification.error({message:error.message,duration:0})
      });}
      else{
       
        notification.warning({message:"Please Attach Aleast One File",duration:0})
      }

// end
    }
  }


 
  
  getCompanyData(dropdowncompany) {

      console.log(dropdowncompany.value,'companyName')
      this.setState({
        selectedCompany: dropdowncompany,
         btntype : false,
      })
      const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+dropdowncompany.value+'?access_token='+token;
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
     
    
     
      const modifiedjsondata =data.data.fiscalYear;
     console.log(modifiedjsondata, 'modifiedjsondata');
      this.setState({
        companyData: modifiedjsondata,
       
        percentileloading:false
      })
    })
    .catch((error) => {
      console.error("Error:", error);
      
    });
  }
  getjsondata =()=>{
    
    const companyname=this.state.selectedCompany.value;
    
    console.log(companyname, 'companyname get json');
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+companyname+'?access_token='+token;
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
      const modifiedjsondata =[{ year:year1[0].year, Data:year1}, {year:year2[0].year, Data:year2}]
      this.setState({
        companyData: modifiedjsondata,
        percentileloading:false
      })
     
      notification.success({message:'percentile calculated successfully',duration:0})
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
        
        notification.success({message:"Derived Calculation Completed Successfully",duration:0})
        this.setState({
          loading:false,
          percentilebtntype:true,
          status_nic_dd:false,
        })
        
      })
      .catch((error) => {
        this.setState({
          loading:false
        })
        console.error("Error:", error);
       
        notification.error({message:error.message,duration:0})
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
        this.setState({
          percentileloading:false
        })
        notification.success({message:"Percentile Calculated Successfully",duration:0})
      })
      .catch((error) => {
        this.setState({
          percentileloading:false
        })
        
       
        notification.error({message:error.message,duration:0})
      });
    }
  
    downloadControversyData = () => {
    
      const { conroversycompanyData } = this.state;
      
      // Create a blob of the data
      conroversycompanyData.data.data.map((args)=>{
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

    this.state.companyData.map((arg)=>{
      const options = {
        filename:this.state.selectedCompany.label+"["+ arg.year+"]"+".xlsx" ,
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(arg.Data);
      })
    
  }
  downloadControversyExcel=()=>{
    const { conroversycompanyData } = this.state;
    conroversycompanyData.data.data.map((arg)=>{
      const options = {
        filename:arg.companyName+"["+ arg.year+"]"+".xlsx" ,
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(arg.Data);
      })
  }

  getNiccode=(arg)=>{
console.log(arg, 'nic arg');
this.setState({
  nicValue:arg.value,
  percentilebtntype:false,
})
  }

  changetext=()=>{
    const statusvariable =document.getElementsByClassName('e-file-status');
    console.log(statusvariable.length,"eeee");
    const n = statusvariable.length;
    this.setState({
      content_file_attached_status:n,
    });
    if(this.state.status_delete){
    [...Array(n)].map((e, i) => {
      document.getElementsByClassName('e-file-status')[i].innerHTML="remove and try again";
    })
  }
  else{
    [...Array(n)].map((e, i) => {
      document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
    })
  }
  }
  changetext_controversy=()=>{
    const statusvariable_con =document.getElementsByClassName('e-file-status');
    console.log(statusvariable_con.length,"eeee");
    const n = statusvariable_con.length;
    this.setState({
      content_file_attached_status_Controversy:n,
    });
    if(this.state.status_delete_controversy){
    [...Array(n)].map((e, i) => {
      document.getElementsByClassName('e-file-status')[i].innerHTML="Remove and try again";
    })
  }
  else{
    [...Array(n)].map((e, i) => {
      document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
    })
  }
  }
  removeexcels_controversy=(e)=>{
    e.cancel=true;
    
    this.setState({
      status_delete_controversy:true,
     })
     this.removeFile_controversy.push(e.filesData)
     this.confirmPopup_controversy =DialogUtility.confirm({
      animationSettings: { effect: 'Zoom' },
      cancelButton: { text: 'Cancel', click:this.CancelConClick},
      closeOnEscape: true,
      content: "Are you sure want to remove the file?",
      okButton: { text: 'OK', click:this.OkConClick  },
      showCloseIcon: true,
      title: ' Confirmation ',
  });
  }

 
   removeExcels=(arg)=>{
     console.log(arg, 'arg')
    arg.cancel=true;
     this.setState({
      status_delete:true,
     });
     this.removeFile.push(arg.filesData); 
     // Confirm popup
     this.confirmPopup =DialogUtility.confirm({
      animationSettings: { effect: 'Zoom' },
      cancelButton: { text: 'Cancel', click:this.CancelClick},
      closeOnEscape: true,
      content: "Are you sure want to remove the file?",
      okButton: { text: 'OK', click:this.OkClick  },
      showCloseIcon: true,
      title: ' Confirmation ',
  });
 
 }
    

    OkClick=()=>{
    
    
   this.confirmPopup.hide();
    var uploadObj = document.getElementById('fileUpload').ej2_instances[0]; 
    console.log(uploadObj,'uploadObj');
  uploadObj.remove(this.removeFile[0], false, true); 
    this.removeFile=[]; 
}
CancelClick=()=> {
    
    this.confirmPopup.hide();
}
OkConClick=()=>{

this.confirmPopup_controversy.hide();
var uploadObj = document.getElementById('controversyUpload').ej2_instances[0]; 
console.log(uploadObj,'uploadObj');
uploadObj.remove(this.removeFile_controversy[0], false, true); 
this.removeFile_controversy=[]; 
}
CancelConClick=()=> {

this.confirmPopup_controversy.hide();
}
  render() {
    let loading = this.state.loading;
    let spinner = this.state.spinner;
    let percentile_loader =this.state.percentileloading;
    const allCompanyList = this.state.companies && this.state.companies.map((company) => {
        const listObj={value:company.id,label:company.companyName};
        return listObj;
    });
    const allControversy_company = this.state.companyID && this.state.companyID.map((controversy)=>{
      const listObj={value:controversy.id, label:controversy.companyName};
      return listObj;
    })
    let status_dd= this.state.status_dd;
    let status_nic_dd = this.state.status_nic_dd;
    let nicCode = this.state.nicCodeList;
    const nicCodeOption =nicCode && nicCode.map((ele)=>{
      const modifiedNiccode ={value:ele, label:ele };
      return modifiedNiccode;
    })
    

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
                    <Fileuploader removing={this.removing} filenameHandle={this.handleChangeexcel}  changetext={this.changetext} removeexcels={this.removeExcels}></Fileuploader>
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
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 4:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Download JSON </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', marginLeft:'5%'}}>

            <button type="button" className="btn btn-secondary btn-json-download" onClick={this.downloadData} style={{ minWidth: "13rem", fontSize: "15px", margin:"0px", marginBottom:"20px" }}>Download Data Json</button>
             <button type="button" className="btn btn-success btn-excel-download" onClick={this.downloadExcel} style={{ width: "14rem", fontSize: "15px",margin:"0px", marginBottom:"20px" }} >Download Data json as excel</button>
                      
            </div>
        
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
          
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 5:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Controversies  (optional) </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <Spin size="large" spinning={this.state.controversyspinner} tip="Uploading..." >
                <header className="jumbotron" style={{ width: "100%" }}>
                <div style={{fontSize: "12px",color: "#155F9B",fontWeight: "600", marginBottom:'0.75rem'}}>Upload Controversies <span style={{color:"red"}}>(max limit 25 files)</span></div>
                  <div>
                    <Controversyuploader removeexcels_controversy={this.removeexcels_controversy} changetext_controversy={this.changetext_controversy}  controversyHandle={this.handleControversyexcel}></Controversyuploader>
                  </div>
                </header>
                </Spin>
                <div style={{display:"flex",flexDirection:"column",minHeight:"12rem",justifyContent:'space-between'}}>
                    <div  style={{fontSize: "12px",color: "#155F9B",fontWeight: "600"}}>Select Controversy Company*</div>
                    <div style={{maxWidth: '40%', minWidth:'300px'}}>
                      <Select 
                      options={allControversy_company}
                      onChange={this.getControversycompany}
                      isDisabled={this.state.status_selectControversy_dd}
                      />
                    </div>
                
                    <div>
                      <button type="button" className="btn btn-secondary btn-controversy-download" style={{ minWidth: "13rem", fontSize: "15px",margin:'0px' }} onClick={this.downloadControversyData} >Download Controversies</button>
                    </div>
                    <div>
                    <button type="button" className="btn btn-success btn-controversyexcel-download" onClick={this.downloadControversyExcel} style={{ minWidth: "16rem", fontSize: "15px",margin:"0px", marginBottom:"20px" }} >Download Controversies as excel</button>
                    </div>
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