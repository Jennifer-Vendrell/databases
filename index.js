const express = require('express')
const app = express()
const port = 3000
const rootRouter = require('./routes/root')

app.use(express.json())

app.use('/api/v1', rootRouter)

// http://localhost:3000/

app.listen(port, () => {
    console.log('listening on port ${port}')
}) 