import React from 'react';
import ReactDOM from 'react-dom';
import Upload1 from '../images/upload1.png'
// import Upload2 from '../assets/images/upload2.png'
// import Upload3 from '../assets/images/upload3.png'
// import Upload4 from '../assets/images/upload4.png'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ReactTable from "react-table"; 
import { toast } from "react-toastify";
class ViewData extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          companies:[],
          selectedCompany:"",
          companyData:{},
          finalArray: [],
        }
    }
    componentDidMount(){
      toast.success("view");
      this.getAllcompany();
      
    }
    getAllcompany = () => {
      fetch("http://e9a23f17e1e4.ngrok.io/getAllCompany", {
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
    
    getViewCompanyData=(e)=>{

      if (e.target.value == "Select Company") {
        alert("Please Select companies to view data")
      } else {
  
        this.setState({
          selectedCompany: e.target.value,
        })

        const { companyName } = {
          companyName: e.target.value
        }
    
        let url = `http://e9a23f17e1e4.ngrok.io/getNewData/${companyName}`;
    
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
       Header: 'Response Unit',  
       accessor: 'Response',
       },
       {  
        Header: 'Performance Unit',  
        accessor: 'PerformanceResponse',
        }
    ]
    return (
      <div className="container">
            <Card.Title
            style={{
              height: "22px",
              fontSize: "25px",
              letterSpacing: "0px",
              color: "#155F9B",
              fontWeight: "600",
              display:"flex",
              justifyContent: "center",
              marginBottom:"50px"
            }}
          >
           <div style={{position:"absolute",left: "9%"}}><button className="btn btn-secondary" style={{width: "100%",fontSize:"15px"}} onClick={()=>{this.props.history.push('/fileUpload')}}>Back to Upload data page</button></div> <div>View Data</div>
              
          </Card.Title>
          <header className="jumbotron">
              
              <Row>
                  <Col sm={4}>
                  <h6 style={{ paddingLeft:"2px",height: "22px", textAlign: "left", fontSize: "12px", letterSpacing: "0px", fontWeight: "600", marginBottom: "0px !important" }}>
              Select Company
            </h6> 
            <select  onChange={this.getViewCompanyData} className="select">
              <option>Select Company</option>
              {this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>
                  </Col>
                  <Col sm={8}></Col>
              </Row>
              
              <Row> 
          <Col sm={12} className="table-col jumbotron" style={{padding: '0px !important'}}>
              {/* <ReactTable  columns={columns}  style={{ border: '0px solid rgba(0,0,0,0.1)'}}/> */}
              <ReactTable data={this.state.finalArray} columns={columns} filterable={true}  style={{ border: '0px solid rgba(0,0,0,0.1)' }} />
          </Col>
        
              </Row>
          </header>

      </div>  
      
    );
  }
}
export default ViewData;