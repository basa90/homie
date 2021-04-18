'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const Joi = require('joi')
const db = require('homie-db')
const config = require('../config')
const { encrypt, isTimeValid, isValidHourRange, token } = require('../lib/utils')


const routes = asyncify(express.Router())

const searchBody = Joi.object().keys({
  conditions: Joi.object().keys({
    name: Joi.string(),
    username: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string(),
    active: Joi.boolean(),
    role_id: Joi.string()
  }).required()
})

const createBody = Joi.object().keys({
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string(),
  active: Joi.boolean(),
  phone: Joi.string().required(),
  role_id: Joi.string().required(),
  days_availability: Joi.any(),
  hour_init: Joi.string(),
  hour_end: Joi.string()
})

const updateBody = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string(),
  lastname: Joi.string(),
  password: Joi.string(),
  active: Joi.boolean(),
  role_id: Joi.string(),
  phone: Joi.string(),
  avatar: Joi.string(),
  days_availability: Joi.any(),
  hour_init: Joi.string(),
  hour_end: Joi.string()
})

const authenticationBody = Joi.object().keys({
  authentication: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).required()
})

let services, User, Role

routes.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }

    User = services.User
    Role = services.Role

  }

  next()
})

routes.post('/search', async (req, res, next) => {
  console.log(`POST /user/search`)

  const { body } = req

  try {

    await searchBody.validateAsync(body)

    if (body.conditions.role_id) {

      const existRole = await Role.findByRoleId(body.conditions.role_id)

      if (!existRole) return res.status(404).send({ error: true, errorMsg: 'Role not found.' })
      body.conditions.role_id = existRole.id

    }

    const results = await User.findAll(body.conditions)

    return res.status(200).send({ results })
  } catch (e) {
    return next(e)
  }
})

routes.post('/', async (req, res, next) => {
  console.log('POST /user/')
  try {

    let { body } = req
    await createBody.validateAsync(body)

    if (!isTimeValid(req.body.hour_init) || !isTimeValid(req.body.hour_end) || !isValidHourRange('07:59', '19:59', req.body.hour_init, req.body.hour_end))
      return res.status(404).send({ error: true, errorMsg: 'Availability out of date range' })

    const userExist = await User.findAll({ username: body.username, email: body.email })
    if (userExist.length > 0) return next(new Error('User already exists.'))

    body.username = body.username.toLowerCase()
    body.email = body.email.toLowerCase()

    const roleExist = await Role.findByRoleId(body.role_id)

    if (!roleExist) return res.status(404).send({ error: true, errorMsg: 'Role not found.' })
    body.role_id = roleExist.id

    const results = await User.create(body)

    return res.status(200).send({ results })
  } catch (e) {
    return next(e)
  }
})

routes.put('/', async (req, res, next) => {
  console.log('PUT user/')
  try {
    let { body } = req

    await updateBody.validateAsync(body)

    if (req.body.hour_init && !isTimeValid(req.body.hour_init) || !isTimeValid(req.body.hour_end) || !isValidHourRange('07:59', '19:59', req.body.hour_init, req.body.hour_end))
      return res.status(404).send({ error: true, errorMsg: 'Availability out of date range' })


    if (body.role_id) {
      const roleExist = await Role.findByRoleId(body.role_id)
      if (!roleExist) return res.status(404).send({ error: true, errorMsg: 'Role not found.' })
      body.role_id = roleExist.id
    }

    if (body.password)
      body.user.password = encrypt(body.password)

    const results = await User.update(body)

    return res.status(200).send({ results })
  } catch (e) {
    return next(e)
  }
})


routes.post('/login', async (req, res, next) => {
  console.log(`POST /user/login`)

  let { body } = req

  try {
    await authenticationBody.validateAsync(body)

    body.authentication.password = encrypt(body.authentication.password)

    const authentication = await User.authentication(body.authentication)

    if (authentication) {
      const result = token({
        name: authentication.name,
        lastname: authentication.lastname,
        username: authentication.username,
        active: authentication.ative,
        role: authentication.role.name
      })

      return res.status(200).send({
        mensaje: 'Authentication success.',
        token: result,
      })
    } else {
      return res.status(401).send({
        error: true,
        mensaje: 'Authentication failed.',
      })
    }
  
  }catch (e) {
  next(e)
}
})

module.exports = routes
