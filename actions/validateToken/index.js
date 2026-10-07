const jwt = require('jsonwebtoken')

const SECRET = 'capstone-secret'

async function main(params) {
  try {
    const { token } = params

    if (!token) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Token required'
        }
      }
    }

    const decoded = jwt.verify(
      token,
      SECRET
    )

    return {
      statusCode: 200,
      body: {
        success: true,
        valid: true,
        user: decoded
      }
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: {
        success: false,
        valid: false,
        message: 'Invalid token'
      }
    }
  }
}

exports.main = main