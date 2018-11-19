// Requiring node modules
const express = require('express')
const parser = require('body-parser')
const morg = require('morgan')
const app = express()
const port = process.env.PORT || 3001

app.use(parser.json())
const { Kingdom } = require('galvanize-game-mechanics')

// initialzations
var id
const kingdoms = []
const error404 = { error: { message: 'TRY AGAIN LOSA, NO PAGE FOUND!'}}
const error400 = { error: { message: 'BAD REQUEST, NOOOO BAD REQUEST. VALIDATE YOUR SYNTAX OR GTFO'}}

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
        res.status(404).send(error404)
        next()
    }
    res.send({data: kingdom})
})

app.post('/kingdoms/:id/castles', (req, res) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom.castles.length > 2){
        let error = {
            message: 'BAD REQUEST, NOOOO BAD REQUEST. VALIDATE YOUR SYNTAX OR GTFO'
        }
        res.status(400).send({error})
        next()
    }
    else if(kingdom === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    req.body.name === undefined ? kingdom.createCastle() : kingdom.createCastle(`${req.body.name}`)
    let [ data ] = kingdom.castles.slice(-1)
    res.status(201).send({data})
})

app.get('/kingdoms/:id/castles', (req, res) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    let data = kingdom.castles
    res.status(200).send({data})
})

app.param('castleId', (req,res,next,value) => {
    req.castleId = value
    next()
})

app.get('/kingdoms/:id/castles/:castleId', (req,res) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    let [ castle ] = kingdom.castles.filter(castle => castle.id === req.castleId)
    if(castle === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    let data = castle
    res.status(200).send({data})
})

app.post('/kingdoms/:id/castles/:castleId', (req,res) => {
    let [ kingdom ] = kingdoms.filter(kingdom => kingdom.id === req.id)
    if(kingdom === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    let [ castle ] = kingdom.castles.filter(castle => castle.id === req.castleId)
    if(castle === undefined){
        let error = {
            message: 'TRY AGAIN LOSA, NO PAGE FOUND!'
        }
        res.status(404).send({error})
        next()
    }
    if(req.body.action === 'attack'){
        kingdom.attackCastle(req.castleId)
    }
    else if(req.body.action === 'build'){
        kingdom.buildCastle(req.castleId)
    }
    else{
        let error = {
            message: 'BAD REQUEST, NOOOO BAD REQUEST. VALIDATE YOUR SYNTAX OR GTFO'
        }
        res.status(400).send({error})
        next()
    }
    let data = castle
    res.status(200).send({data})
})

// start server
const listener = () => `Listening on port ${port}!`
app.listen(port, listener)



// Once you've set up your application, include the following line
// or something like it to run the tests:

module.exports = app
