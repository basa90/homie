'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = function setupPropertyStatus(propertyStatusModel) {

  async function getId(status) {
    console.log('status: ', status)
    const cond = {
      where: {
        name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), '=', status.toLowerCase())
      }
    }

    const result = await propertyStatusModel.findOne(cond)

    if (result) return result

    return null
  }

  return {
    getId
  }
}
