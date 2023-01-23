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
