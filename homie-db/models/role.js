'use strict'

const Sequelize = require('sequelize')
const uuid = require('uuid-base62')
const setupDatabase = require('../lib/db')

module.exports = function setupRole(config) {
  const sequelize = setupDatabase(config)

  const role = sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  role.beforeCreate((r) => {
    r.role_id = `role_${uuid.v4().substr(9)}`
  })

  return role
}
