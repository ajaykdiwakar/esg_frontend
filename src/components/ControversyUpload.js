import { render } from 'react-dom';
import './Controversyexcel.css';
import * as React from 'react';
import {  message } from 'antd';
import { SampleBase } from './Sample-base';
import { PropertyPane } from './PropertyPane';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
class Controversyuploader extends SampleBase {
  constructor(props) {
    super(props);
    this.dropContainerEle = null;
    this.dropContainerRef = element => {
      this.dropContainerEle = element;
    };
    
    this.count = 25;
    this.asyncSettings = {
      saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
      removeUrl:
        'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    };
  }
  rendereComplete() {
    this.uploadObj.dropArea = this.dropContainerEle;
    this.uploadObj.element.setAttribute('name', 'UploadFiles');
    this.uploadObj.dataBind();
  }
  onFileSelect(args) {
    
    console.log(args, 'main args');
    var fileLength =
      args.filesData.length + this.uploadObj.getFilesData().length;
      const currentfile=args.filesData;
      const selectedAlready=this.uploadObj.getFilesData();
       for (const file of currentfile) {
        for (const storedfile of selectedAlready) {
          
          if(file.name === storedfile.name ){
            console.log("match found")
            if(fileLength <= 25 ){
              console.log("len < 5")
            message.warning("Duplicates Not Allowed");
            args.cancel = true;
            }
          }
         }}
    if (fileLength > this.count) {
      args.cancel = true;
      document.getElementsByClassName('e-error')[0].innerHTML =
        'maximum of ' + this.count + ' files to upload';
    } 
    else{
      document.getElementsByClassName('e-error')[0].innerHTML = '';
    }
  }
  render() {
    return (
      <div className="control-pane" ref={this.dropContainerRef}>
        <div className="control-section row uploadpreview">
          <div className="col-lg-12">
            <div className="upload_wrapper">
              <UploaderComponent
                id="fileUpload"
                type="file"
                ref={scope => {
                  this.uploadObj = scope;
                }}
                asyncSettings={this.asyncSettings}
                selected={this.onFileSelect.bind(this)}
                change={this.props.changetext_controversy}
                actionComplete={this.props.controversyHandle}
                beforeRemove={this.props.removeexcels_controversy}
                autoUpload={false}
                allowedExtensions='.xls, .xlsx'
                buttons={{
                  browse: 'Choose file',
                  clear: this.clearEle,
                  upload: this.uploadEle
                }}
              />
              <div class="e-error" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controversyuploader;