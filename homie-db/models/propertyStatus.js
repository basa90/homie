'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupPropertyStatusModel(config) {
    const sequelize = setupDatabase(config)

    return sequelize.define('property_status', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(70),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(140),
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
}
