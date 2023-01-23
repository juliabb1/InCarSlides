// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join("./backend/data", 'db.json'))
const middlewares = jsonServer.defaults()
server.use(middlewares)

server.get('/filenames', (req, res) => {
  res.send('welcome to the development api-server');
})


server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'PUT') {
    console.log("Success!")
  }
  // Continue to JSON Server router
  next()
})


server.use(router)
server.listen(8000, () => {
  console.log('JSON Server is running')
})
/*
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const app = express();
const path = require("path")
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));




const dirname = 'C:\\source_code-snippets\\web-service\\file-upload\\public\\uploads\\pdf_slides';

const storage = multer.diskStorage({
  // Destination to store image     
  destination: dirname, 
    filename: (req, file, cb) => {
      const new_name = file.originalname.split(".");
        cb(null, new_name[0] + "." + new_name[1])
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 *1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|png)$/)) { 
       // upload only png and jpg format
       return cb(new Error('Please upload a pdf file!'))
     }
   cb(undefined, true)
  }
}) 

app.get("/uploadConversion", upload.single("file"), async (req, res) => {
  try {    
    if (req.file) {
      res.send({
        status: true,
        message: "File Uploaded!",
        data: req.data,
      });
    } else {
      res.status(400).send({
        status: false,
        data: "File Not Found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

const routes = require('./routes/routes.js')(app, fs);
app.listen(8000, () => console.log("Server Running..."));
*/