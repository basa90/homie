'use strict'

const inquirer = require('inquirer')
const minimist = require('minimist')
const db = require('./')

const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()

const roles = require('./data/roles')


async function setup() {
  if (!args.yes) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened :)')
    }
  }

  const config = {
    database: process.env.DB_NAME || 'homie',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: true
  }

  const {
    Role
  } = await db(config).catch(handleFatalError)

  // ADDING DATA
  try {

    console.log(`Adding roles`)
    for (let value of roles) {
      await Role.create(value)
    }
  } catch (e) {
    handleFatalError(e)
  }

  console.log('Success!')
  process.exit(0)
}

function handleFatalError(err) {
  console.error(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
