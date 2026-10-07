async function main(params) {
  try {
    const {
      username,
      email,
      password
    } = params

    if (!username?.trim()) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Username is required'
        }
      }
    }

    if (!email?.trim()) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Email is required'
        }
      }
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Invalid email format'
        }
      }
    }

    if (!password) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Password is required'
        }
      }
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message:
            'Password must be at least 6 characters'
        }
      }
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        username,
        message: 'Signup successful'
      }
    }
  } catch (error) {
    console.error(
      'Signup Error:',
      error
    )

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