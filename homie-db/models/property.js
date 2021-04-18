'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')
const uuid = require('uuid-base62')

module.exports = function setupPropertyModel(config) {
  const sequelize = setupDatabase(config)

  const property = sequelize.define('property', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    rental_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1
      }
    }
  }, {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  property.beforeCreate((p) => {
    p.property_id = `prop_${uuid.v4().substr(9)}`
  })

  return property
}
