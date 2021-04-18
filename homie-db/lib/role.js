'use strict'

const { Op } = require('sequelize')

module.exports = function setupRole(RoleModel) {

    const ROLE_ATTRIBUTES = ['role_id', 'name', 'description']

    async function create(role) {
        const cond = { where: {} }
        cond.attributes = ROLE_ATTRIBUTES
        cond.raw = false

        const result = await RoleModel.create(role)

        cond.where.id = { [Op.eq]: result.id }

        return RoleModel.findAll(cond)
    }

    function findAll(conditions) {
        const cond = { where: {} }
        cond.order = [
            ['created_at', 'DESC']
        ]

        conditions.name ? cond.where.name = { [Op.eq]: conditions.name } : ''
        conditions.role_id ? cond.where.role_id = { [Op.eq]: conditions.role_id } : ''
        conditions.description ? cond.where.description = { [Op.eq]: conditions.description } : ''

        cond.attributes = ROLE_ATTRIBUTES
        cond.raw = false

        return RoleModel.findAll(cond)
    }

    async function update(role) {
        const cond = {
            attributes: ROLE_ATTRIBUTES,
            where: {
                role_id: {
                    [Op.eq]: role.role_id
                }
            },
            raw: true,
            nest: true
        }

        await RoleModel.update(role, cond)

        return RoleModel.findAll(cond)

    }


    async function deleteRole(role_id) {
        const cond = {
            where: {
                role_id: {
                    [Op.eq]: role_id
                }
            },
            raw: false
        }

        let deleted = RoleModel.destroy(cond)

        return deleted

    }

    function findByRoleId (role_id) {
        const cond = { where: {} }
    
        cond.where.role_id = { [Op.eq]: role_id }
    
        cond.raw = false
        
        return RoleModel.findOne(cond)
      }

    return {
        create,
        findAll,
        update,
        deleteRole,
        findByRoleId
    }
}