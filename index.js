const connectToMongo = require('./db');
const express = require('express')
connectToMongo();

const app = express()
const port = 5000

//Middleware that we have to use request body
app.use(express.json())

//Available routes
// app.get('/', (req, res) => {
//   res.send('Hello RIDA!')
// })
//Firs the router will search in index.js and then in the file mentioned in ./routes/auth
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
