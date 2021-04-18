'use strict'

const { Op } = require('sequelize')

module.exports = function setupUser(UserModel, RoleModel) {

  const USER_ATTRIBUTES = ['name', 'lastname', 'username', 'email', 'avatar', 'active', 'phone', 'days_availability', 'hour_init', 'hour_end', 'created_at', 'updated_at']
  const ROLE_ATTRIBUTES = ['role_id', 'name', 'description']

  async function create(user) {

    const cond = { where: {} }
    cond.where.username = { [Op.eq]: user.username }
    cond.attributes = USER_ATTRIBUTES
    cond.include = [
      { model: RoleModel, attributes: ROLE_ATTRIBUTES }
    ]
    cond.raw = false

    const result = await UserModel.create(user)
    cond.where.id = { [Op.eq]: result.id }
    return UserModel.findAll(cond)

  }

  async function update(user) {
    const cond = { where: {} }

    user.email ? cond.where.email = { [Op.eq]: user.email } : ''

    cond.include = [
      { model: RoleModel, attributes: ROLE_ATTRIBUTES }
    ]
    cond.attributes = USER_ATTRIBUTES
    cond.raw = false

    delete user.email

    await UserModel.update(user, cond)

    return UserModel.findAll(cond)
  }

  function findAll(conditions) {
    const cond = { where: {} }
    cond.order = [
      ['username', 'ASC']
    ]

    conditions.name ? cond.where.name = { [Op.eq]: conditions.name } : ''

    conditions.lastname ? cond.where.lastname = { [Op.eq]: conditions.fullname } : ''
    conditions.username ? cond.where.username = { [Op.eq]: conditions.username } : ''
    conditions.email ? cond.where.email = { [Op.eq]: conditions.email } : ''
    conditions.active ? cond.where.active = { [Op.eq]: conditions.active } : ''
    conditions.phone ? cond.where.phone = { [Op.eq]: conditions.phone } : ''
    conditions.role_id ? cond.where.role_id = { [Op.eq]: conditions.role_id } : ''

    cond.include = [
      { model: RoleModel, attributes: ROLE_ATTRIBUTES }
    ]
    cond.attributes = USER_ATTRIBUTES
    cond.raw = false

    return UserModel.findAll(cond)
  }


  async function getIdByEmail(email) {

    const cond = { where: {} }

    cond.where.email = { [Op.eq]: email }

    const result = await UserModel.findOne(cond)

    if (result) return result

    return null
  }

  async function authentication(authentication) {
    const cond = { where: {} }
    cond.where.email = { [Op.eq]: authentication.email }
    cond.where.password = { [Op.eq]: authentication.password }
    cond.where.active = { [Op.eq]: true }
    cond.include = [
      { model: RoleModel, attributes: ROLE_ATTRIBUTES }
    ]
    cond.attributes = ['name', 'lastname', 'username', 'email', 'avatar', 'active', 'created_at', 'updated_at']
    cond.raw = false

    return UserModel.findOne(cond)
  }

  return {
    create,
    findAll,
    update,
    getIdByEmail,
    authentication
  }
}
