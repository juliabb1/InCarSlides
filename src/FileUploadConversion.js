import React, { useState } from "react";
import axios from "axios";
import './FileUploadConversion.css';
const PDFJS = require("pdfjs-dist/webpack");


function FileUpload() {

  const [fileData, setFileData] = useState("");
  const [prevSlideCount, setPrevSlideCount] = useState("1");
  const chunkNumber = 3;

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

      // SPLIT DATA URL IN 2 CHUNKS
      let stringLength = canvas.toDataURL().length
      let splitIndex = Math.round(stringLength/chunkNumber)
      let url = canvas.toDataURL()
      let url_1 = url.slice(0, splitIndex)
      let url_2 = url.slice(splitIndex, splitIndex*2)
      let url_3 = url.slice(splitIndex*2, stringLength)
      // images.push(canvas.toDataURL());
      images.push(url_1)
      images.push(url_2)
      images.push(url_3)
      // SPLIT DATA URL IN 2 CHUNKS
      // images.push(canvas.toDataURL())
     // console.log("Url length: " + stringLength)
     // console.log("Url1 length: " + url_1.length)
     // console.log("Url2 length: " + url_2.length)

    }
    canvas.remove();
    return images;
  }

// const files_url ="http://localhost:8000/files/1";
// const images_url ="http://localhost:8000/images/";

const files_url = "https://incar-slides-api.onrender.com/files/1";
const images_url = "https://incar-slides-api.onrender.com/images/";
  const uploadFile = (e) => { 
    e.preventDefault();
    const data =convertPdfToImages(fileData)
    var filename = fileData.name
    filename = filename.slice(0, -4)
    data.then((data) => {
      axios.put(files_url, {
        filename: filename,
        slideCount: data.length / chunkNumber
      })}).then((res) => {
        if(res.status !== 200){
          alert("Oop! Something went wrong with the upload :(")}
        })
  
      var maxSlide = parseInt(prevSlideCount)
      for (var i = 1; i < maxSlide+1; i++){
        axios.delete(images_url + i.toString())
      }
      console.log("prevSlideCount: " + maxSlide)
  /*
      let imgUrls = []
      data.then((data) => {
        setPrevSlideCount(data.length);
        data.forEach(url => {
          imgUrls.push(url)
        })
      });
      const promises = imgUrls.map((imgUrl) => axios.post(images_url, {
        fileId: 1,
        imgUrl: imgUrl
      }));*/

      let axiosArray = []
      let id = 1;
      let chunkId = 1;
      let imageId = 1;
      let colorCode = 8; // blue
      data.then((data) => data.forEach((imgUrl) => {
        let postData = {};
        postData["fileId"] = 1;
        postData["imageUrl"] = imgUrl;
        postData["id"] = id
        postData["imageId"] = imageId
        postData["chunkId"] = chunkId
        postData["colorCode"] = colorCode
      let newPromise = axios({
        method: 'post',
        url: images_url,
        data: postData
      })
      chunkId++
      id++
      if(chunkId === 4) {
        imageId++
        chunkId = 1;}
      axiosArray.push(newPromise)
      setPrevSlideCount((axiosArray.length).toString())
    }))
    

      axios
      .all(axiosArray)
      .then(axios.spread((...responses) => {
        responses.forEach(res => console.log('Success'))
        console.log('submitted all axios calls');
        alert("Succesfully submitted!")
      }))
      .catch(error => {
        alert("Something went Wrong :(")
        console.log(error)
      })
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