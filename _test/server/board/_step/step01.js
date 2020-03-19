// express : https://expressjs.com/ko/
// 1단계 : express 시작

// npm init -y
// npm install express
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`listening on port ${port}!`))