const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const port = process.env.PORT || 3001
const config = require('./config')

const allGetRoutes = require('./routes/router')
const CreateRoutes = require('./routes/router')
// middleware
const app = express();
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({expanded: true}))

// -------------------DB------------------//
// DB create
const db = mysql.createConnection(config)

// DB connect
db.connect((err) => {
    if (err) {
        console.log('接続できませんでした。', err)
    } else {
        console.log('接続に成功しました。')
    }
})

// Insert test
// app.get('/', (req, res) => {
//     const sqlInsert = 
//     "insert into movie_review (movieName, movieReview) values ('inception', 'good movie');"

//     db.query(sqlInsert, (err, result) => {
//         res.send(result)
//         console.log(result)
//     })
// })

// --------------------routing & Insert-----------------//

// select文
// app.get('/api/get', (req, res) => {
//     const sqlSelect = 
//     "select * from movie_review";

//     db.query(sqlSelect, (err, result) => {
//         console.log('result', result)
//         res.send(result)
//     })
// })



app.use('/api', allGetRoutes.routes)
app.use('/api', CreateRoutes.routes)


app.listen(port, (req, res) => {
    console.log(`サーバーは${port}番で起動しました`)
})




