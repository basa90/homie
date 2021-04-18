'use strict'

const crypto = require('crypto')
const moment = require('moment-timezone')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {

  encrypt(password) {
    let shasum = crypto.createHash('sha256')
    shasum.update(password)
    return shasum.digest('hex')
  },

  isTimeValid(hour) {

    return moment(hour, 'HH:mm', true).isValid()
  },

  isValidHourRange(beforeTime, afterTime, hourInit, hourEnd) {
    const HOUR_FORMAT = 'HH:mm'

    let initTime = moment(hourInit, HOUR_FORMAT)
    let endTime = moment(hourEnd, HOUR_FORMAT)

    let beforeTime_ = moment(beforeTime, HOUR_FORMAT)
    let afterTime_ = moment(afterTime, HOUR_FORMAT)

    if (initTime.isBetween(beforeTime_, afterTime_) && endTime.isBetween(beforeTime_, afterTime_)) {
      return true
    } else {
      return false
    }
  },

  token(infoPayload = {}) {
    const payload = infoPayload
    const token = jwt.sign(payload, config.key_jwt, {
      expiresIn: infoPayload.partner_id ? '90d' : 60 * 60 * 24 //24H
    })
    return token

  }
}