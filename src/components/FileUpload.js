
import React, { useState, useEffect } from "react";
import { enableVersionBasedPersistence, isNullOrUndefined, removeChildInstance } from "@syncfusion/ej2-base";
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
import { Spin,notification,message } from 'antd';
import 'antd/dist/antd.css';


class FileUpload extends React.Component {

 
  fileObj = [];
  fileArray = [];
  confirmPopup='';
  confirmPopup_controversy='';
  removeFile=[];
  removeFile_controversy=[];
  confirmPopupClearAll='';
  removeFileClearAll=[];
  reqArr=[];

  constructor(props) {
    
    super(props);
    this.state = {
      file: [null],
      data: [],
      cols: [],
      selectedCompany: "",
      companies: [],
      allListCompanies:[],
      companyData: [],
      companyDataexcel:[],
      selectedDerivedFile:'',
      
      companyName: [],
      companyID: [],
      btntype:true,
      percentilebtntype:true,
      loading:false,
      selectedFile: undefined,
      selectedControversyFiles:undefined,
      spinner:false,
      controversyspinner:false,
      percentileloading:false,
      conroversycompanyData:[],
      controversyDataExcels:[],
      status_dd:true,
      status_nic_dd:true,
      errjson:null,
      nicCodeList:'',
      status_selectControversy_dd:true,
      content_file_attached_status:"",
      content_file_attached_status_Controversy:"",
      selected_conFile:[],
      nicValue:'',
      status_delete:false,
      status_delete_controversy:false,
      getAllcomp_status:true,
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
          let uploadEGS = document.querySelector(".btn-upload-excel");
          if(uploadEGS){
            uploadEGS.disabled = true;
          }
         
          let uploadControversy = document.querySelector(".btn-upload-controversy");
          if(uploadControversy){
            uploadControversy.disabled = true;
          }
          
          let errorjson = document.querySelector(".err-json");
          if(errorjson){
            errorjson.style.display ='none';
          }
          this.getAllcompany();
          notification.info({message:"You can directly generate JSON for companies in STEP 4",duration:0})
         this.getNicList();
  }
  actionCompleteControversy=(ele)=>{
    document.querySelector('.e-file-clear-btn').style.display='none';
if(ele){
  let uploadControversy = document.querySelector(".btn-upload-controversy");
  if(uploadControversy){
    uploadControversy.disabled = false;
  }
}
  }
 
  getNicList = () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url = `http://65.1.140.116:9010/companies/all_nic?access_token=`+token;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        nicCodeList:data.rows,
      })
      console.log(data, 'full nic list');
    })
  }

  handleControversyexcel =(e) =>{
    console.log(this.state.selectedControversyFiles,'this.state.selectedControversyFiles');
    e.preventDefault();
    if (!isNullOrUndefined(this.state.selectedControversyFiles) ){
    // start 
      const controversydata = new FormData();
      if(this.state.selectedControversyFiles && this.state.selectedControversyFiles.length > 0){
      for (var x = 0; x < this.state.selectedControversyFiles.length; x++) {
        controversydata.append("file", this.state.selectedControversyFiles[x].rawFile);
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
           
            // [...Array(n)].map((e, i) => {
            //   document.getElementsByClassName('e-file-delete-btn')[i].style.display='none';
            // });

            let uploadControversy = document.querySelector(".btn-upload-controversy");
            if(uploadControversy){
              uploadControversy.disabled = true;
            }
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
            notification.error({message: data.message,duration:0});
            this.setState({
              controversyspinner:false,
            })
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
        
        notification.warning({message:"Please attach aleast one file",duration:0})
      }

// end
    }else{
      message.warning("Please attach atleast one file");
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
  
      
      console.log("controversy get value Success:", data.data);
      const cinforjsom = data.data && data.data.CIN;
      const jsonconData = [];
      for (const i of data.data.data) {
        jsonconData.push({companyName: i.companyName, CIN: cinforjsom, data: i.Data});
      }
      console.log(jsonconData,'jsonconData');
      const cin = data.data && data.data.CIN;
      data.data.data.map((ele)=>{
        console.log(ele,'ele');
      let subArr=[];
        for ( let v of ele.Data ) {
          if(v.controversy.length === 0){
            subArr.push({Year:v.Year, DPCode:v.DPCode, Response:v.Response, Controversy_Textsnippet:"",Controversy_sourceName:"",Controversy_sourcePublicationDate:"",Controversy_sourceURL:"",CIN:cin, Company:ele.companyName});
          } else {
              for ( let b in v.controversy){
                  if(b===0){
                    subArr.push({Year:v.Year, DPCode:v.DPCode, Response:v.Response,Controversy_Textsnippet:v.controversy[b].Textsnippet,Controversy_sourceName:v.controversy[b].sourceName,Controversy_sourcePublicationDate:v.controversy[b].sourcePublicationDate,Controversy_sourceURL:v.controversy[b].sourceURL,CIN:cin, Company:ele.companyName  });
                  } else {
                    subArr.push({Year:'',DPCode:'',Response:'',Controversy_Textsnippet:v.controversy[b].Textsnippet,Controversy_sourceName:v.controversy[b].sourceName,Controversy_sourcePublicationDate:v.controversy[b].sourcePublicationDate,Controversy_sourceURL:v.controversy[b].sourceURL,CIN:cin, Company:ele.companyName  });
                  }
              }
          }
      }
    this.reqArr.push({year:ele.year,companyName:ele.companyName,Data:subArr});
      });
      
      
console.log(this.reqArr,'mod_excel');
     
      this.setState({
        conroversycompanyData: jsonconData,
        controversyDataExcels:this.reqArr,
        percentileloading:false
      })
      
     })
    .catch((error) => {

      console.error("Error:", error);
      
    });
}

actionComplete=(arg)=>{
  document.querySelector('.e-file-clear-btn').style.display='none';
if(arg){
  let uploadEGS = document.querySelector(".btn-upload-excel");
  if(uploadEGS){
    uploadEGS.disabled = false;
  }
}
}
  handleChangeexcel = (e) => {
    e.preventDefault();
    console.log(e,"excels");
    if (!isNullOrUndefined(this.state.selectedFile)){
     

    // start 

    const data = new FormData();
    if(this.state.selectedFile && this.state.selectedFile.length > 0){
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x].rawFile);
    }
    this.setState({
      spinner:true
    })
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    
    fetch("http://65.1.140.116:9010/standalone_datapoints/upload-company-esg?access_token="+token, {
      method: "POST",
      body: data,
      
    })
      .then((response) => { 
        console.log(response, 'esg upload response');
        return response.json();
      })
      
      .then((data) => {
        
        if (data.status === "200") {
          const n =this.state.content_file_attached_status;
          console.log(n,"selected file length");
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
          });
         
          // [...Array(n)].map((e, i) => {
          //   document.getElementsByClassName('e-file-delete-btn')[i].style.display='none';
          // });
          document.querySelector('.e-file-clear-btn').style.display='none';
            // let jsonDownload = document.querySelector(".btn-json-download");
            // if(jsonDownload){
            //   jsonDownload.disabled = true;
            // }
            // let excel_Download = document.querySelector(".btn-excel-download");
            // if(excel_Download){
            //   excel_Download.disabled = true;
            // }
            let errorjson = document.querySelector(".err-json");
            if(errorjson){
              errorjson.style.display ='none';
            }
            let uploadEGS = document.querySelector(".btn-upload-excel");
            if(uploadEGS){
              uploadEGS.disabled = true;
            }
            this.getAllcompany();
            this.setState({
              btntype:true,
              percentilebtntype:true,
              // companies:data.companies,
              spinner:false,
              status_dd:false,
            })
          
            notification.success({message: 'File Uploaded Successfully',duration:0})
            
            console.log("Success:", data);
        }
        console.log(data.status,data.missingDatapoints, 'status','missed dps')
        if (data.status === "400") {
          if(data.missingDatapoints){
            this.setState({
              errjson: data.missingDatapoints
            });
            let errorjson = document.querySelector(".err-json");
          if(errorjson){
            errorjson.style.display ='block';
          }
          }
          const n =this.state.content_file_attached_status;
          console.log(n,"selected file length");
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-status')[i].innerHTML="file Attached";
          });
          document.querySelector('.e-file-clear-btn').style.display='none';
        document.getElementsByClassName('e-info')[0].innerHTML="Remove file and try again";
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
       
        notification.warning({message:"Please attach aleast one file",duration:0})
      }

// end
    }else{
      message.warning("Please attach alteast one file");
    }
  }

 
 
  
  getCompanyData(dropdowncompany) {

     
      this.setState({
        selectedDerivedFile:dropdowncompany,
         btntype : false,
      })
    //   const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    // let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+dropdowncompany.value+'?access_token='+token;
    // fetch(url, {
    //   method: "GET"
    // })
    // .then((response) => response.json())
    // .then((data) => {
    
      
    //   console.log("get data Success:", data);
     
    
     
    //   const modifiedjsondata =data.data.fiscalYear;
    //  console.log(modifiedjsondata, 'modifiedjsondata');
    //   this.setState({
    //     companyData: modifiedjsondata,
       
    //     percentileloading:false
    //   })
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
      
    // });
  }
//   getjsondata =()=>{
    
//     const companyname=this.state.selectedCompany.value;
    
//     console.log(companyname, 'companyname get json');
//     const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
//     let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+companyname+'?access_token='+token;
//     fetch(url, {
//       method: "GET"
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       let jsonDownload = document.querySelector(".btn-json-download");
//       if(jsonDownload){
//         jsonDownload.disabled = false;
//       }
//       let excel_Download = document.querySelector(".btn-excel-download");
//       if(excel_Download){
//         excel_Download.disabled = false;
//       }
      
//       console.log("get data Success:", data);
//       const year1 =data.year1;
//       const year2 =data.year2;
//       const modifiedjsondata =[{ year:year1[0].year, Data:year1}, {year:year2[0].year, Data:year2}]
//       this.setState({
//         companyData: modifiedjsondata,
//         percentileloading:false
//       })
     
//       notification.success({message:'percentile calculated successfully',duration:0})
//     })
//     .catch((error) => {

//       console.error("Error:", error);
      
//     });
// }

  getCompanyCalculation=()=>{
    
     const companyName= this.state.selectedDerivedFile.value;
    
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
        // this.getjsondata()
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
      conroversycompanyData.map((args)=>{
        const fileName = ` ${args.companyName}[ ${args.data[0].Year} ].json`;
        const fileToSave = new Blob([JSON.stringify(args)], {
          type: 'text/plain;charset=utf-8',
          name: fileName,
           });
          // Save the file
          saveAs(fileToSave, fileName);
        })
     
    }  
    errorjsonbtn = () => {
      const { errjson } = this.state;
      errjson && errjson.map((e)=>{
        const fileName =e.companyName+"["+ e.year+"]"+".json";
        const fileToSave = new Blob([JSON.stringify(e)], {
          type: 'text/plain;charset=utf-8',
          name: fileName,
           });
          // Save the file
          saveAs(fileToSave, fileName);
      });
    }
  downloadData = () => { 
    const { companyData } = this.state
    // Create a blob of the data
    companyData.map((args) => {
      const fileName = `${args.data.companyName}[ ${args.data.fiscalYear[0][0].year}].json`;
      const fileToSave = new Blob([JSON.stringify(args)], {
        type: 'text/plain;charset=utf-8',
        name: fileName,
         });
        // Save the file
        saveAs(fileToSave, fileName);
      })
   
 
  }
  downloadExcel=()=>{

    this.state.companyDataexcel.map((arg)=>{
      const options = {
        filename:arg[0].CompanyName+"["+ arg[0].Year+"]"+".xlsx" ,
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(arg);
      })
    
  }
  
  downloadControversyExcel=()=>{
    const { controversyDataExcels } = this.state;
    console.log(controversyDataExcels,'controversyDataExcels')
    controversyDataExcels.map((arg)=>{
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
  getAllCompanyData=(arg)=>{
    let jsonDownload = document.querySelector(".btn-json-download");
    if(jsonDownload){
      jsonDownload.disabled = true;
    }
    let excel_Download = document.querySelector(".btn-excel-download");
    if(excel_Download){
      excel_Download.disabled = true;
    }
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    let url ='http://65.1.140.116:9010/derived_datapoints/generate-json/'+arg.value+'?access_token='+token;
    fetch(url, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
    
      if(data.status === 200){

      
      console.log("get data Success:", data);
     
      let jsonDownload = document.querySelector(".btn-json-download");
        if(jsonDownload){
          jsonDownload.disabled = false;
        }
        let excel_Download = document.querySelector(".btn-excel-download");
        if(excel_Download){
          excel_Download.disabled = false;
        }
     console.log(data, 'copany data json')
     
    const modifiedjsondata =data.data.fiscalYear.map((e)=>{
          return {
            message: data.message,
            status: data.status,
            data: {
              companyName: data.data.companyName, 
              companyID: data.data.companyID, 
              NIC_CODE: data.data.NIC_CODE,
              NIC_industry: data.data.NIC_industry, 
              fiscalYear: [[e]]
            } 
          };
      })
      const CINexcel = data.data.companyID;
      const compNameexcel = data.data.companyName;
      console.log(compNameexcel ,'compNameexcel');
      const modifiedexceldata = data.data.fiscalYear.map((e)=>{
        const f =e.Data.map((i)=>{
          const t = {...i, CIN: CINexcel, CompanyName: compNameexcel};
          return t;
        })
        return f;
      })
     console.log(modifiedexceldata, 'modifiedexceldata');
      this.setState({
        companyData: modifiedjsondata,
        companyDataexcel :modifiedexceldata,
        selectedCompany: arg,
        percentileloading:false
      })
    }
    else{
      notification.error({message:data.message,duration:0});
    }
    })
  
    .catch((error) => {
      console.error("Error:", error);
      notification.error({message:error.message,duration:0});
      
    });
  }
  // get ALL Company 
    getAllcompany = () => {
    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI1MTBlMzU2ZDM2NjYwNWIwNDUzMyIsImlhdCI6MTYyMTY5MDQyMX0.52MKXMLD-A_QZxImaut5fpKFJ7MQQZB-so1ws5gVi0Q";
    fetch("http://65.1.140.116:9010/companies?access_token="+token, {
      method: "GET"
    })
      .then((response) =>
        response.json())
      .then((data) => {    
        
        this.setState({
          allListCompanies:data.rows,
          getAllcomp_status:false,
          
        })
      
      })
      .catch((error) => {

        console.error("Error:", error);
        message.error(error.message,5)
      });
  }


  changetext=(arg)=>{
    if(!isNullOrUndefined(arg.file)){
      document.getElementsByClassName('e-info')[0].innerHTML="";
      console.log(arg.file, 'onChange');
      const statusvariable =document.getElementsByClassName('e-file-status');
      if(statusvariable.length === 0){
       
        let uploadEGS = document.querySelector(".btn-upload-controversy");
        if(uploadEGS){
          uploadEGS.disabled = true;
        }
      }
      
      
      console.log(statusvariable,"eeee");
      const n = statusvariable.length;
      this.setState({
        content_file_attached_status:n,
        selectedFile: arg.file,

      });
    
      [...Array(n)].map((e, i) => {
        document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
      })
    
  }
  if(!isNullOrUndefined(arg.files)){
    document.getElementsByClassName('e-info')[0].innerHTML="";
    console.log(arg.files, 'onChange');
    const statusvariable =document.getElementsByClassName('e-file-status');
    if(statusvariable.length === 0){
     
      let uploadEGS = document.querySelector(".btn-upload-controversy");
      if(uploadEGS){
        uploadEGS.disabled = true;
      }
    }
    
    
    console.log(statusvariable,"eeee");
    const n = statusvariable.length;
    this.setState({
      content_file_attached_status:n,
      selectedFile: arg.files,

    });
 
    [...Array(n)].map((e, i) => {
      document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
    })
 
  }
  }
  changetext_controversy=(e)=>{
    document.getElementsByClassName('e-warn')[0].innerHTML = '';
    console.log(e, 'change conroversy')
    if(!isNullOrUndefined(e.file)){
          const statusvariable_con =document.getElementsByClassName('e-file-status');
          console.log(statusvariable_con.length,"eeee");
          if(statusvariable_con.length === 0){
            
            let uploadControversy = document.querySelector(".btn-upload-controversy");
            if(uploadControversy){
              uploadControversy.disabled = true;
            }
          }
          
          const n = statusvariable_con.length;
          this.setState({
            content_file_attached_status_Controversy:n,
            selectedControversyFiles:e.file,
          });
        
          [...Array(n)].map((e, i) => {
            document.getElementsByClassName('e-file-status')[i].innerHTML="File Attached";
          })
        
    }
    if(!isNullOrUndefined(e.files)){
      const statusvariable_con =document.getElementsByClassName('e-file-status');
      console.log(statusvariable_con.length,"eeee");
      if(statusvariable_con.length === 0){
       
        let uploadControversy = document.querySelector(".btn-upload-controversy");
        if(uploadControversy){
          uploadControversy.disabled = true;
        }
      }
      
      const n = statusvariable_con.length;
      this.setState({
        content_file_attached_status_Controversy:n,
        selectedControversyFiles:e.files,
      });
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

//   clearingexcels=(args)=>{
//      args.cancel=true;
//      const dummy=[];
//  console.log(args,'clear ALL');
// const allClearFiles = args.filesData.map((e)=>{
//       dummy.push(e);
//       return dummy;
// })
// console.log(allClearFiles,'allClearFiles');
// this.removeFileClearAll=allClearFiles[0];
// console.log(this.removeFileClearAll.length,'this.removeFileClearAll.length');
// this.confirmPopupClearAll = DialogUtility.confirm({
//   animationSettings: { effect: 'Zoom' },
//   cancelButton: { text: 'Cancel', click:this.clearAllCancel},
//   closeOnEscape: true,
//   content: "Are you sure want to remove All the file?",
//   okButton: { text: 'OK', click:this.clearAllOk  },
//   showCloseIcon: true,
//   title: ' Confirmation ',
// });
//    }

  
   removeExcels=(arg)=>{
     console.log(arg, 'arg')
    arg.cancel=true;
    //  this.setState({
    //   status_delete:true,
    //  });
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
    
// Remove Individual file for ESG
OkClick=()=>{
  
  
    
   this.confirmPopup.hide();
    var uploadObj = document.getElementById('fileUpload').ej2_instances[0]; 
    console.log(this.removeFile[0],'uploadObj');
  uploadObj.remove(this.removeFile[0], false, true); 
    this.removeFile=[]; 
}
CancelClick=()=> {
    
    this.confirmPopup.hide();
}
//clear All file in ESG
// clearAllOk=()=>{ 
//   this.confirmPopupClearAll.hide();
 
//    var uploadObj = document.getElementById('fileUpload').ej2_instances[0]; 
//    console.log(this.removeFileClearAll,'this.removeFileClearAll');
//    const n = this.removeFileClearAll.length;
//    [...Array(n)].map((e, i) => {
//      console.log(i,'i');
//     uploadObj.remove(this.removeFileClearAll[i], false, true); 
    
//   });
//    this.removeFileClearAll=[]; 
//    console.log(this.removeFileClearAll,' after this.removeFileClearAll');
   
// }
// clearAllCancel=()=> {
   
//    this.confirmPopupClearAll.hide();
// }

// Remove Individual file for Controversy
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
    // const CompanyList = this.state.companies && this.state.companies.map((company) => {
    //     const listObj={value:company.id,label:company.companyName};
    //     return listObj;
    // });
    const allControversy_company = this.state.companyID && this.state.companyID.map((controversy)=>{
      const listObj={value:controversy.id, label:controversy.companyName};
      return listObj;
    })
    const Allcompany = this.state.allListCompanies && this.state.allListCompanies.map((controversy)=>{
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
                    <Fileuploader  clearingexcels={this.clearingexcels} actionComplete={this.actionComplete}  changetext={this.changetext} removeexcels={this.removeExcels}></Fileuploader>
                  </div>
                </header>
                <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",minHeight:"5rem"}}>
    
                  <button type="button" className="btn btn-info btn-upload-excel" onClick={this.handleChangeexcel} style={{ minWidth: "16rem", fontSize: "15px", padding:'0px'}} >Upload</button>
                  <button type="button" className="btn btn-secondary err-json" onClick={this.errorjsonbtn} style={{ minWidth: "16rem", fontSize: "15px", padding:'0px'}} >Get missed DPs</button>
                </div>
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
                  options={Allcompany}
                  onChange={this.getCompanyData}
                  // isDisabled={status_dd}
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
                  // isDisabled={status_nic_dd}
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
            <div style={{marginLeft:'5%', display:'flex',flexDirection:'column',justifyContent:'space-evenly',minHeight:'10rem'}}>
            <div style={{maxWidth: '40%', minWidth:'300px'}}>
                  <Select 
                  options={Allcompany}
                  onChange={this.getAllCompanyData}
                  isDisabled={this.state.getAllcomp_status}
                  placeholder="Select companies"
                  />
                </div>
            
            <div>
            <button type="button" className="btn btn-secondary btn-json-download" onClick={this.downloadData} style={{ minWidth: "13rem", fontSize: "15px", margin:"0px", }}>Download Data Json</button>
            </div>
            <div>
             <button type="button" className="btn btn-success btn-excel-download" onClick={this.downloadExcel} style={{ width: "14rem", fontSize: "15px",margin:"0px", }} >Download Data json as excel</button>
             </div>          
            
            </div>
        
          </Col>
          <Col lg={12} style={{marginBottom:'5%'}}>
          
            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center', marginBottom:'2%',paddingBottom:'1%',borderBottom:'2px solid #efefef'}}>
              <div style={{fontSize:'1.2rem', color: "#155F9B",fontWeight:'600'}}> STEP 5:</div>
              <div style={{ fontSize: '1.2rem', color: "#155F9B", marginLeft: "10px", padding: "3px" }}>Upload Controversies  (optional) </div>
            </div>
            <div  style={{marginLeft:'5%'}}>
            <Spin size="large" spinning={this.state.controversyspinner} tip="Uploading..." >
                <header className="jumbotron" style={{ width: "100%",margin:"0%" }}>
                <div style={{fontSize: "12px",color: "#155F9B",fontWeight: "600",marginBottom:"0.75rem"}}>Upload Controversies <span style={{color:"red"}}>(max limit 25 files)</span></div>
                  <div>
                    <Controversyuploader actionCompleteControversy={this.actionCompleteControversy} removeexcels_controversy={this.removeexcels_controversy} changetext_controversy={this.changetext_controversy}  ></Controversyuploader>
                  </div>
                 
                </header>
                <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",minHeight:"5rem"}}>
                  <button type="button" className="btn btn-info btn-upload-controversy" onClick={this.handleControversyexcel} style={{ minWidth: "16rem", fontSize: "15px",margin:"0px" }} >Upload</button>
                  </div>
                </Spin>
                <div style={{display:"flex",flexDirection:"column",minHeight:"12rem",justifyContent:'space-between',marginTop: '3%'}}>
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