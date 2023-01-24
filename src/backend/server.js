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
  var slideId = parseInt(req.params.slideId)
  var fileId = parseInt(req.params.fileId) 
  var jsonFile = filterById(jsondb.files, fileId)
  var imageUrl = jsonFile.imageUrls[slideId]
  res.json({
    imageUrl: imageUrl
  });
})

function filterById(jsonObject, id) {
  return jsonObject.filter(function(jsonObject) {
    return (jsonObject['id'] === id);
  })[0];
}


server.get('/files/reduced/:fileId', (req, res) => {
  var fileId = parseInt(req.params.fileId)
  var jsonFile = filterById(jsondb.files, fileId)
  var slideCount = jsonFile.slideCount
  var filename = jsonFile.filename
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
