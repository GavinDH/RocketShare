import React from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./field.css";

export default class field extends React.Component{



     constructor(props) {
         super(props);
         this.state = {
             download:false,
             rotation: 0,
             SelectedFile:null,
             returnMessage:null,
             MessageColor:"green",
             downloadURL:null,
             downloadFileUrl:null,
             uploadDone:false,
             url:"http://gavin.portfolio-hr.nl/rocket/",
         }

         this.rotate = this.rotate.bind(this);
     }

     async componentDidMount(){
         if (window.location.search.includes("?d=")) {
             var link = await window.location.search.split("?d=");
             await this.setState({ download: true, downloadURL: link[1] });
             await this.fileGetContextHandeler();

         }
     }
     rotate(loaded,total = this.state.SelectedFile.size) {
         let procentageNeded = (360 / total * loaded);
         let newRotation = procentageNeded;//this.state.rotation + 10;
         if (newRotation >= 360) {
             newRotation = 0;
         }
         this.setState({
             rotation: newRotation,
         })
     }


    fileSelectHandeler = event =>{
        this.setState({ uploadDone: false });
        this.setState({SelectedFile: event.target.files[0]});
    }

    fileDownloadHandeler = () =>{
        axios.get(this.state.downloadFileUrl, {
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
                this.rotate(progressEvent.loaded);
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.state.SelectedFile.name);
            document.body.appendChild(link);
            link.click();
        });
    }

    fileGetContextHandeler = () => {
        const fd = new FormData();
        fd.append("d", this.state.downloadURL);
        axios.post(`http://gavin.portfolio-hr.nl/upload/index.php`, fd)
            .then(res => {
                console.log(res);
                if (res.data.includes("|=|")) {
                    var splitString = res.data.split("|=|");
                    this.setState({ 
                        returnMessage: splitString[0], 
                        MessageColor: "green", 
                        downloadURL: splitString[2],
                        downloadFileUrl:   "http://gavin.portfolio-hr.nl/upload/derp/" + splitString[2] + splitString[1] + ".txt", 
                        SelectedFile: {
                            name: splitString[1],
                            type: splitString[3],
                            size: splitString[4],
                        }});

                } else {
                    this.setState({ returnMessage: res.data, MessageColor: "red" });
                }

            })  
    }


    fileUploadHandeler = () =>{
        if (this.state.SelectedFile !== null){
                  const fd = new FormData();
        fd.append('file',this.state.SelectedFile,this.state.SelectedFile.name);
        axios.post(`http://gavin.portfolio-hr.nl/upload/index.php`,  fd,{
            onUploadProgress: ProgressEvent => {
                this.rotate(ProgressEvent.loaded , ProgressEvent.total);

                if (ProgressEvent.loaded === ProgressEvent.total){
                    this.setState({uploadDone:true});
                }
            }
        })
            .then(res => {
                if (res.data.includes("|=|")){
                    var splitString = res.data.split("|=|");
                    this.setState({ returnMessage: splitString[0], MessageColor: "green", downloadURL: splitString[1] });
                    
                }else{
                    this.setState({ returnMessage: res.data, MessageColor: "red" });
                }
                
            })  
        }else{
            this.setState({returnMessage:"Please select a file",MessageColor:"red"});
        }

    }

    checkFileType(){
        if (this.state.SelectedFile !== null){
            if (this.state.SelectedFile.type === "text/php"){
                return this.state.SelectedFile.type + " Lets hope that isn't a c99 shell 😜";
            }else{
                return this.state.SelectedFile.type;
            }
        }
    }



makeReturnMessage(){
    if (this.state.returnMessage|| this.state.SelectedFile){
        var name = null;
        var message = null;
        if (this.state.SelectedFile){
            name = (<div>
                        <p> {"Selected File: " + this.state.SelectedFile.name} </p>
                <p className="hideOnMobile" >{"File Size: " + Math.round(this.state.SelectedFile.size / 1024 /1024) + "MB"} </p> 
                <p className="hideOnMobile" >{"File Type: " + this.checkFileType()} </p>
                    </div>);
        }
        if (this.state.returnMessage) {
            message = <p style={{ color: this.state.MessageColor }}>{this.state.returnMessage}</p>;
            if (this.state.downloadURL && !this.state.download){
                message = <div>{message}
 
                        <CopyToClipboard text={this.state.url + "?d=" + this.state.downloadURL} >
                        <input type="text" className="linkUrl" readOnly={true} value={this.state.url + "?d=" + this.state.downloadURL} />
                        </CopyToClipboard>
                </div>
            }
        }

        return(
            <div className="file-Selector-message">
                {name}
                {message}
            </div>);
    }
    return ;
}

downloadOrUpload(){
    if (!this.state.download){
        return (<div><div className="-class-50-50 FileSelector">
            <input type="file" name="file" id="file" onChange={this.fileSelectHandeler} className="fileInput" />
            <label htmlFor="file" className="fa fa-file fa-5x cursor-hand"></label>
            <p>
                <label htmlFor="file" className=" cursor-hand">Choose a file</label>
            </p>
        </div>
            <div className="-class-50-50 FileSelector">
                <label htmlFor="upload" className="fa fa-rocket fa-5x cursor-hand" onClick={this.fileUploadHandeler}></label>
                <p><label htmlFor="upload" className="cursor-hand" onClick={this.fileUploadHandeler}>Upload File</label></p>
            </div></div>);
    }else{
        return (<div><div className="-class-50-50 FileSelector">
            <label className="fa fa-file fa-5x cursor-hand" onClick={() => window.location = "/rocket/"}></label>
            <p>
                <label className=" cursor-hand">Upload a file</label>
            </p>
        </div>
            <div className="-class-50-50 FileSelector">
                <label className="fa fa-download fa-5x cursor-hand" onClick={this.fileDownloadHandeler}></label>
                <p><label className="cursor-hand" onClick={this.fileDownloadHandeler}>Download</label></p>
            </div></div>);
    }
}

    render(){

        const { rotation } = this.state;
    return (
        
        <div className="bodyContainer">
            <div className="-class-40-60">
                <div className="file-Selector">
                    {this.downloadOrUpload()}
                    <div className="clear"></div>
                </div>
                    {this.makeReturnMessage()}
            </div>
            
            <div className="-class-60-40">
                <div className="body-rocket">
                    <div className="MoonTextHolder">
                        {!this.state.download ? "Upload: " : "Download: "}{this.state.uploadDone ? "Done" :Math.round(100 / 360 * this.state.rotation)} %
                    </div>
                    <div className="MoonImageHolder">
                        <img src={require('../img/rocket.png')} width="100%" className="rocket-image" alt="" style={{ transform: `rotate(${rotation}deg)` }}  />
                        <img src={require('../img/moon.png')} width="100%" className="moon-image" alt=""/>
                    </div>
                    
                </div>
            </div>
            <div className="clear"></div>
        </div>
    );
    }

}
