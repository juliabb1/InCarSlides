import React, { useState } from "react";
import axios from "axios";
import './FileUploadConversion.css';
const PDFJS = require("pdfjs-dist/webpack");


function FileUpload() {

  const [fileData, setFileData] = useState("");

  const getFile = (e) => {
    setFileData(e.target.files[0]);
  };

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };
  
  //param: file -> the input file (e.g. event.target.files[0])
  //return: images -> an array of images encoded in base64 
  const convertPdfToImages = async (file) => {
    const images = [];
    const data = await readFileData(file);
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas.toDataURL());
    }
    canvas.remove();
    return images;
  }



  const uploadFile = (e) => { 
    e.preventDefault();
    const data =convertPdfToImages(fileData)
    var filename = fileData.name
    filename = filename.slice(0, -4)
    data.then((data) =>
      axios.put("https://incar-slides-api.onrender.com/files/1", {
        filename: filename,
        img: data,
        imgCount: data.length
      }).then((res) => {
        if(res.status === 200){
          alert("File successfully Uploaded!")
        }
        else{
          alert("Oop! Something went wrong :(")
        }
      }))
  };

  return (
    <form name="uploadForm" onSubmit={uploadFile}>
      <input type="file" className="fileInput" name="file" onChange={getFile} accept=".pdf" required />
      <br></br>
      <input type="submit" className="upload" name="upload" value="Upload" />
    </form>    
  );
}

export default FileUpload;