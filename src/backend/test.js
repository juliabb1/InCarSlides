const jsondb = require("./data/db.json")
var slideCount = jsondb.files[0].slideCount


const findFileById = (id) => {
  const key = Object.keys(jsondb.files).find(f => jsondb.files[f].fileId === id)
  return jsondb.files[key]
}

console.log(findFileById('1'))
