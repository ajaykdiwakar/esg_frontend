import { createElement, remove } from '@syncfusion/ej2-base';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import * as React from 'react';




export default class fileUploader extends React.Component<any, any> {
  public uploadObj:any= UploaderComponent;
  public uploadEle: HTMLElement = createElement('span', { className: 'upload e-icons', innerHTML : 'Upload All' });
  public clearEle: HTMLElement = createElement('span', { className: 'remove e-icons', innerHTML : 'Clear All' });
  public path: object = {
      removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
      saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
  }
  private dropAreaRef:any= HTMLElement;
  public onCreated(): void {
      this.uploadObj.dropArea = this.dropAreaRef;
      this.uploadObj.dataBind();
  } 
  constructor(props:any) {
    super(props);
    this.state = {
        
    }}
    removing(arg:any){
console.log(arg,'removing');
    }
    public render(): JSX.Element {
        return (
            <div className = 'control-pane' ref={dropAreaEle => this.dropAreaRef = dropAreaEle!}>
                <div className='control-section row uploadpreview'>
                <div className='col-lg-12'>
                <div className='upload_wrapper'>
                <div id='preview'/>
                    {/* Render Uploader */}
                    <UploaderComponent id='fileUpload' type='file' ref = {upload => {this.uploadObj = upload !}}
                    asyncSettings = {this.path}
                    success={this.props.filesuccess}
                    autoUpload={false} allowedExtensions='.xls, .xlsx'
                    actionComplete={this.props.filenameHandle} 
                    change={this.props.changetext}
                    beforeRemove={this.props.removeexcels}
                    removing={this.removing}
                    buttons={ { browse: 'Choose file', clear: this.clearEle, upload: this.uploadEle}}  
                    created={this.onCreated = this.onCreated.bind(this)}/>
                </div>
                </div>
                </div>
        </div>);
    }
}

