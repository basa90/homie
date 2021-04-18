'use strict'

const crypto = require('crypto')

module.exports = {
  encrypt(password) {
    let shasum = crypto.createHash('sha256')
    shasum.update(password)
    return shasum.digest('hex')
  }
}