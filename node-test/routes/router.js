const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const config = require('../config')
const db = mysql.createConnection(config)


router.get('/get', (req, res) => {
    const sqlSelect = 
    "select * from movie_review";

    db.query(sqlSelect, (err, result) => {
        console.log('result', result)
        res.send(result)
    })
} )

// Create

router.post('/insert', (req, res) => {

    const movieName = req.body.movieName
    const movieReview = req.body.movieReview

    const sqlInsert = "insert into movie_review (movieName, movieReview) values (?,?)"

    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log('result',result)
    })
})





module.exports = {
    routes: router
}