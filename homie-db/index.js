'use strict'

const setupDatabase = require('./lib/db')

// Core models
const setupRoleModel = require('./models/role')
const setupRole = require('./lib/role')

const setupUserModel = require('./models/user')
const setupUser = require('./lib/user')


const setupPropertyStatusModel = require('./models/propertyStatus')
const setupPropertyStatus = require('./lib/propertyStatus')

const setupPropertyModel = require('./models/property')
const setupProperty = require('./lib/property')

const setupPartnerModel = require('./models/partner')
const setupPartner = require('./lib/partner')

const defaults = require('defaults')


module.exports = async function (config) {

  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },

    query: {
      raw: true
    }
  })


  const sequelize = setupDatabase(config)

  const RoleModel = setupRoleModel(config)
  const UserModel = setupUserModel(config)
  const PropertyStatusModel = setupPropertyStatusModel(config)
  const PropertyModel = setupPropertyModel(config)
  const PartnerModel = setupPartnerModel(config)

  // Associations:
  RoleModel.hasMany(UserModel, { foreignKey: 'role_id' })
  UserModel.belongsTo(RoleModel)


  PropertyStatusModel.hasMany(PropertyModel, { foreignKey: 'property_status_id' })
  PropertyModel.belongsTo(PropertyStatusModel)

  UserModel.hasMany(PropertyModel, { foreignKey: 'user_id' })
  PropertyModel.belongsTo(UserModel)


  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  // Models:
  const Role = setupRole(RoleModel)
  const User = setupUser(UserModel, RoleModel)
  const PropertyStatus = setupPropertyStatus(PropertyStatusModel)
  const Property = setupProperty(PropertyModel, PropertyStatusModel, UserModel)
  const Partner = setupPartner(PartnerModel)

  return {
    Role,
    User,
    Property,
    PropertyStatus,
    Partner
  }
}
