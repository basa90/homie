'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')

const free_access = [
    '/user/login',
    '/partner/token'

]

module.exports = async function (req, res, next) {

    if (free_access.indexOf(req.path) !== -1) {
        return next()
    }

    if (!req.headers.authorization) {

        return res.status(401).send({
            error: true,
            stack: {},
            description: `Authorization failed .`,
            results: null
        })
    }

    try {
        if (req.token) {
            jwt.verify(req.token, config.key_jwt, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ mensaje: 'Token invalid.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(400).send({
                mensaje: 'Authorization failed .'
            });
        }

    } catch (e) {
        next(e)
    }

}