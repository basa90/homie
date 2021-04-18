'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const db = require('homie-db')
const Joi = require('joi')
const config = require('../config')

const router = asyncify(express.Router())

let Role, services

const bodySearch = Joi.object().keys({
  conditions: Joi.object().keys({
    role_id: Joi.string(),
    name: Joi.string(),
    description: Joi.string()
  }).required()
})

const bodyCreate = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required()
})

const bodyUpdate = Joi.object().keys({
  role_id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string()
})

const bodyDelete = Joi.object().keys({
  role_id: Joi.string().required()
})

router.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
    Role = services.Role
  }
  next()
})


router.post('/search', async (req, res, next) => {
  console.log('POST role/search')
  try {

    const { body } = req
    await bodySearch.validateAsync(body)

    let results = await Role.findAll(body.conditions)

    return res.status(200).send({ results })

  } catch (error) {
    next(error)
  }
})


router.post('/', async (req, res, next) => {
  console.log('POST role/')
  try {
    const { body } = req

    await bodyCreate.validateAsync(body)

    let results = await Role.create(body)

    return res.status(200).send({ results })

  } catch (error) {
    next(error)
  }
})

router.put('/', async (req, res, next) => {
  console.log('PUT role/')
  try {
    let { body } = req

    await bodyUpdate.validateAsync(body)

    let roleRes = await Role.findAll({ 'role_id': body.role_id })

    if (roleRes.length === 0) return res.status(404).send({ error: true, errorMsg: "Role not found." })

    let results = await Role.update(body)

    return res.status(200).send({ results })

  } catch (error) {
    next(error)
  }
})


router.delete('/', async (req, res, next) => {
  console.log('DELETE address/delete')
  try {
    let { body } = req

    await bodyUpdate.validateAsync(body)

    let roleExist = await Role.findAll({ 'role_id': body.role_id })

    if (roleExist.length === 0) return res.status(404).send({ error: true, errorMsg: "Role not found." })

    let results = await Role.deleteRole(body.role_id)
    console.log('results: ', results)
    let message = results ? 'Role deleted successfully' : 'Error deleting'
    let statusCode = results ? 200 : 404

    return res.status(statusCode).send({ results: [{ message }] })

  } catch (error) {
    next(error)
  }
})

module.exports = router
