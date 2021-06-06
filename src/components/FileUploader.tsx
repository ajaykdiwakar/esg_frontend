import { createElement } from '@syncfusion/ej2-base';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import * as React from 'react';




export default class fileUploader extends React.Component<any, any> {
  public uploadObj:any= UploaderComponent;
//   public uploadEle: HTMLElement = createElement('span', { className: 'upload e-icons', innerHTML : 'Attach All' });
//   public clearEle: HTMLElement = createElement('span', { className: 'remove e-icons', innerHTML : 'Clear All' });
  public path: object = {
      removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
      saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
  }

//   buttonClick=()=> {
   
// }


  private dropAreaRef:any= HTMLElement;
  public onCreated(): void {
      this.uploadObj.dropArea = this.dropAreaRef;
      this.uploadObj.dataBind();
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
                    actionComplete={this.props.actionComplete}
                    change={this.props.changetext}
                    removing={this.props.removeexcels}
                    clearing={this.props.clearingexcels}
                    buttons={ { browse: 'Choose file', clear: 'Clear', upload:'Attach'}}  
                    created={this.onCreated = this.onCreated.bind(this)}/>
                </div>
                <div className="e-info" style={{color:'red'}}></div>
                </div>
                </div>
        </div>);
    }
}

