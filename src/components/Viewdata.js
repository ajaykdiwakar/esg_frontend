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
class ViewData extends React.Component {
    constructor(props) {
        super(props);
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
              width: "10%",
              marginBottom:"50px"
            }}
          >
              View Data
          </Card.Title>
          <header className="jumbotron">
              
              <Row>
                  <Col sm={4}>
                  <h6 style={{  height: "22px", textAlign: "left", fontSize: "12px", letterSpacing: "0px", fontWeight: "600", marginBottom: "0px !important" }}>
              Select Company
            </h6> 
            <select  onChange={this.getCompanyData} className="select">
              <option>Select Company</option>
              {/*{this.state.companies.map((company) => <option key={company} value={company}>{company}</option>)}*/}
            </select>
                  </Col>
                  <Col sm={8}></Col>
              </Row>
              
              <Row> 
          <Col sm={12} className="table-col jumbotron" style={{padding: '0px !important'}}>
              <ReactTable  columns={columns}  style={{ border: '0px solid rgba(0,0,0,0.1)'}}/>
          </Col>
        
              </Row>
          </header>

      </div>  
      
    );
  }
}
export default ViewData;