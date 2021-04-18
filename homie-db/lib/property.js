'use strict'

const { Op } = require('sequelize')

module.exports = function setupUser(PropertyModel, PropertyStatusModel, UserModel) {

    const PROPERTY_ATTRIBUTES = ['property_id', 'name', 'description', 'rental_price']
    const PROPERTY_STATUS_ATTRIBUTES = ['name', 'description', 'created_at', 'updated_at']
    const ROLE_ATTRIBUTES = ['role_id', 'name', 'description']
    const USER_ATTRIBUTES = ['name', 'lastname', 'username', 'email', 'avatar', 'active', 'phone', 'days_availability', 'hour_init', 'hour_end','created_at', 'updated_at']

    async function create(property) {

        const cond = { where: {} }
        cond.attributes = PROPERTY_ATTRIBUTES
        cond.include = [
            { model: PropertyStatusModel, attributes: PROPERTY_STATUS_ATTRIBUTES },
            { model: UserModel, attributes: USER_ATTRIBUTES }
        ]
        cond.raw = false

        const result = await PropertyModel.create(property)
        cond.where.id = { [Op.eq]: result.id }
        return PropertyModel.findAll(cond)

    }

    async function update(property) {

        const cond = { where: {} }

        property.property_id ? cond.where.property_id = { [Op.eq]: property.property_id } : ''

        cond.include = [
            { model: PropertyStatusModel, attributes: PROPERTY_STATUS_ATTRIBUTES },
            { model: UserModel, attributes: USER_ATTRIBUTES }
        ]
        cond.attributes = PROPERTY_ATTRIBUTES
        cond.raw = false

        delete property.property_id

        await PropertyModel.update(property, cond)

        return PropertyModel.findAll(cond)
    }

    function findAll(conditions) {

        const cond = { where: {} }
        cond.order = [
            ['created_at', 'ASC']
        ]

        conditions.property_id ? cond.where.property_id = { [Op.eq]: conditions.property_id } : ''
        conditions.user_email ? cond.where.user_id = { [Op.eq]: conditions.user_email } : ''
        conditions.property_status_id ? cond.where.property_status_id = { [Op.eq]: conditions.property_status_id } : ''
        conditions.rental_price ? cond.where.rental_price = { [Op.between]: conditions.rental_price } : ''

        cond.include = [
            { model: PropertyStatusModel, attributes: PROPERTY_STATUS_ATTRIBUTES },
            { model: UserModel, attributes: USER_ATTRIBUTES }
        ]
        cond.attributes = PROPERTY_ATTRIBUTES
        cond.raw = false

        return PropertyModel.findAll(cond)
    }

    return {
        create,
        findAll,
        update
    }
}
