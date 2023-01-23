// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join("./data", 'db.json'))
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 8000;
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
server.listen(port, () => {
  console.log('JSON Server is running')
})
