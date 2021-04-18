'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupPartnerModel(config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('partner', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    partner_id: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(155),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
}
