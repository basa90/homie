'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const Joi = require('joi')
const db = require('homie-db')
const config = require('../config')

const { token } = require('../lib/utils')


const routes = asyncify(express.Router())

const authenticationBody = Joi.object().keys({
  authentication: Joi.object().keys({
    partner_id: Joi.string().required()
  }).required()
})

let services, Partner

routes.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }

    Partner = services.Partner

  }
  next()
})

routes.post('/token', async (req, res, next) => {
  console.log('POST /partner/token')
  try {

    let { body } = req
    await authenticationBody.validateAsync(body)

    const partnerExist = await Partner.findAll({ partner_id: body.authentication.partner_id, active: true })

    if (partnerExist.length === 0)
      return res.status(404).send({ error: true, errorMsg: 'Partner not found.' })


    let results = [{ token: token({ partner_id: body.authentication.partner_id }) }]

    return res.status(200).send({ results })
  } catch (e) {
    return next(e)
  }
})


module.exports = routes
