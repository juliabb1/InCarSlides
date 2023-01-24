// server.js
const jsonServer = require('json-server')
const { type } = require('os')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join("./backend/data", 'db.json'))
const jsondb = require("./backend/data/db.json")
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 8000;
server.use(middlewares)

server.get('/files/:fileId/image/:slideId', (req, res) => {
  var slideId = parseInt(req.params.slideId)
  var fileId = parseInt(req.params.fileId)
  var imgUrl = jsondb.files[fileId].img[slideId]
  res.json({
    imgUrl: imgUrl
  });
})

server.get('/files/:fileId', (req, res) => {
  var fileId = parseInt(req.params.fileId)
  var slideNumber = jsondb.files[fileId].imgCount
  var filename = jsondb.files[fileId].filename
  res.json({
    fileId: fileId, 
    filename: filename,
    slideNumber: slideNumber
  });
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
server.listen(port, () => {
  console.log('JSON Server is running')
})
