// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join("./data", 'db.json'))
const jsondb = require("./data/db.json");
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 8000;
server.use(middlewares)

server.get('/files/:fileId/image/:slideId', (req, res) => {
  console.log(parseInt(req.params.slideId))
  var slideId = parseInt(req.params.slideId)
  var fileId = parseInt(req.params.fileId) -1
  var imgUrl = jsondb.files[fileId].imageUrls[slideId]
  res.json({
    imgUrl: imgUrl
  });
})

server.get('/files/:fileId', (req, res) => {
  var fileId = parseInt(req.params.fileId) - 1
  var slideCount = jsondb.files[fileId].slideCount
  console.log(slideCount)
  console.log(typeof(slideCount))
  var filename = jsondb.files[fileId].filename
  res.json({
    filename: filename,
    slideCount: slideCount
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
