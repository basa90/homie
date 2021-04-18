'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const db = require('homie-db')
const config = require('../config')
const Joi = require('joi')

const router = asyncify(express.Router())


let services
let User
let PropertyStatus
let Property


const searchBody = Joi.object().keys({
    conditions: Joi.object().keys({
        property_id: Joi.string(),
        user_email: Joi.string().email(),
        property_status_id: Joi.string(),
        rental_price: Joi.array().max(2)
    }).required()
})

const createBody = Joi.object().keys({
    user_email: Joi.string().email().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    rental_price: Joi.number().precision(2).required(),
    property_status_id: Joi.string().required()
})

const updateBody = Joi.object().keys({
    property_id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    rental_price: Joi.number().precision(2).required(),
    property_status_id: Joi.string()
})

router.use('*', async (req, res, next) => {
    if (!services) {

        try {
            services = await db(config.db)
        } catch (e) {
            return next(e)
        }

        User = services.User
        PropertyStatus = services.PropertyStatus
        Property = services.Property
    }

    next()
})


router.post('/search', async (req, res, next) => {
    console.log('POST property/search')
    try {
        let { body } = req

        await searchBody.validateAsync(body)

        if (body.conditions.property_status_id) {
            const propertyStatusExist = await PropertyStatus.getId(body.conditions.property_status_id)
            if (!propertyStatusExist) return res.status(404).send({ error: true, errorMsg: 'Property status not found.' })
            body.conditions.property_status_id = propertyStatusExist.id
        }

        if (body.conditions.user_email) {
            const userExist = await User.getIdByEmail(body.conditions.user_email)
            if (!userExist) return res.status(404).send({ error: true, errorMsg: 'User not found.' })
            body.conditions.user_email = userExist.id
        }

        let results = await Property.findAll(body.conditions)

        return res.status(200).send({ total: results.length, results })

    } catch (error) {
        next(error)
    }
})


router.post('/', async (req, res, next) => {
    console.log('POST property/')
    try {
        const { body } = req

        await createBody.validateAsync(body)

        if (body.property_status_id) {
            const propertyStatusExist = await PropertyStatus.getId(body.property_status_id)
            if (!propertyStatusExist) return res.status(404).send({ error: true, errorMsg: 'Property status not found.' })
            body.property_status_id = propertyStatusExist.id
        }

        if (body.user_email) {
            const userExist = await User.getIdByEmail(body.user_email)
            if (!userExist) return res.status(404).send({ error: true, errorMsg: 'User not found.' })
            body.user_id = userExist.id
            delete body.user_email
        }

        let results = await Property.create(body)

        return res.status(200).send({ results })

    } catch (error) {
        next(error)
    }
})



router.put('/', async (req, res, next) => {
    console.log('PUT property/')
    try {
        const { body } = req

        await updateBody.validateAsync(body)


        let propertyExist = await Property.findAll({ property_id: body.property_id })
        if (propertyExist.length === 0) return res.status(404).send({ error: true, errorMsg: "Property not found." })

        if (body.property_status_id) {
            const propertyStatusExist = await PropertyStatus.getId(body.property_status_id)
            if (!propertyStatusExist) return res.status(404).send({ error: true, errorMsg: 'Property status not found.' })
            body.property_status_id = propertyStatusExist.id
        }

        let results = await Property.update(body)

        return res.status(200).send({ results })
    } catch (error) {
        next(error)
    }
})

module.exports = router
