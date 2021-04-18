'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')
const { encrypt } = require('../utils')

module.exports = function setupUserModel(config) {
  const sequelize = setupDatabase(config)

  const user = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    },
    lastname: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(155),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    avatar: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    phone: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    days_availability: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    hour_init: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    hour_end: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
  }, {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  user.beforeCreate((u) => {
    u.password = encrypt(u.password)
  })

  return user
}
