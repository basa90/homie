'use strict'

const http = require('http')
const cors = require('cors')
const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const asyncify = require('express-asyncify')
const bearerToken = require('express-bearer-token')
const Authorization = require('./middleware/authorization')

const {
    role,
    user,
    property,
    partner
} = require('./routes')

const app = asyncify(express())
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

app.use(bearerToken())
app.use(Authorization)

app.use('/role', role)
app.use('/user', user)
app.use('/property', property)
app.use('/partner', partner)

app.use((err, req, res, next) => {
    return res.status(500).send({
        error: true,
        description: `${err.error ? err.error.message : err.message}`
    })
})

server.listen(PORT, () => {
    console.log(`${chalk.green('[Homie-api]')} server listening on port ${PORT}`)
})


