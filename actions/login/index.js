const jwt = require('jsonwebtoken')

const SECRET = 'capstone-secret'

async function main(params) {
  try {
    const { email, password } = params

    if (!email || !password) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Email and password are required'
        }
      }
    }

    // Temporary validation
    // Replace with App Builder DB query

    const token = jwt.sign({ email }, SECRET, { expiresIn: '12h' })

    return {
      statusCode: 200,
      body: {
        success: true,
        token
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        success: false,
        message: error.message
      }
    }
  }
}

exports.main = main
