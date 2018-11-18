// Requiring node modules
const express = require('express')
const parser = require('body-parser')
const morg = require('morgan')
const app = express()
const port = process.env.PORT || 3001

app.use(parser.json())
const { Kingdom } = require('galvanize-game-mechanics')

// initialzations
const kingdoms = []

// routes

app.post('/kingdoms', (req, res) => {
    let data = req.body.name === undefined ? new Kingdom() : new Kingdom(`${req.body.name}`)
    res.status(201).send({data})
    kingdoms.push(data)
})

app.get('/kingdoms', (req, res) => {
    res.send({data: kingdoms})
})

app.param('id', (req,res,next,value) => {
    req.id = value
    next()
})

app.get('/kingdoms/:id', (req, res, next) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom === undefined){
        res.status(404).send({ error: { message: 'TRY AGAIN LOSA, NO PAGE FOUND!'}})
        next()
    }
    res.send({data: kingdom})
})

app.post('/kingdoms/:id/castles', (req, res) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom === undefined){
        res.status(404).send({ error: { message: 'TRY AGAIN LOSA, NO PAGE FOUND!'}})
        next()
    }
    req.body.name === undefined ? kingdom.createCastle() : kingdom.createCastle(`${req.body.name}`)
    let [ data ] = kingdom.castles.slice(-1)
    res.status(201).send({data})
})

// start server
const listener = () => `Listening on port ${port}!`
app.listen(port, listener)



// Once you've set up your application, include the following line
// or something like it to run the tests:

module.exports = app
