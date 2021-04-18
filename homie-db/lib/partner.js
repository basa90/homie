'use strict'

const { Op } = require('sequelize')

module.exports = function setupPartner(PartnerModel) {

  const PARTNER_ATTRIBUTES = ['partner_id', 'name', 'description', 'active', 'created_at', 'updated_at']


  function findAll(conditions) {
    const cond = { where: {} }
    cond.order = [
      ['created_at', 'ASC']
    ]

    conditions.partner_id ? cond.where.partner_id = { [Op.eq]: conditions.partner_id } : ''
    conditions.name ? cond.where.name = { [Op.eq]: conditions.name } : ''
    conditions.active ? cond.where.active = { [Op.eq]: conditions.active } : ''

    cond.attributes = PARTNER_ATTRIBUTES
    cond.raw = false

    return PartnerModel.findAll(cond)
  }

  return {
    findAll
  }
}
