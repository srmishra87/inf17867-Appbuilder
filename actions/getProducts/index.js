const { generateAccessToken } = require('@adobe/aio-sdk').Core.AuthClient

const libDb = require('@adobe/aio-lib-db')

async function main(params) {
  let client

  try {
    const { pageNo = 1, limit = 10, searchText = '', rating = 0, category = '', sortBy = 'title', sortOrder = 'asc' } = params

    const token = await generateAccessToken(params)

    const db = await libDb.init({
      token: token.access_token,
      region: params.DB_REGION || 'apac'
    })

    client = await db.connect()

    const productsCollection = client.collection('products')

    let allProducts = []

    try {
      allProducts = await productsCollection.find({}).toArray()
    } catch (e) {
      allProducts = []
    }

    console.log(`Products found in DB: ${allProducts.length}`)

    let filteredProducts = allProducts

    // Search by title or description
    if (searchText) {
      const search = searchText.toLowerCase()

      filteredProducts = filteredProducts.filter(
        (product) => (product.title && product.title.toLowerCase().includes(search)) || (product.description && product.description.toLowerCase().includes(search))
      )
    }

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    // Rating filter
    if (rating) {
      filteredProducts = filteredProducts.filter((product) => Number(product.rating) >= Number(rating))
    }

    filteredProducts.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1
      }

      return valueA < valueB ? 1 : -1
    })
    // Categories for filter dropdown
    const categories = [...new Set(allProducts.map((product) => product.category).filter(Boolean))]

    const totalRecords = filteredProducts.length

    const pageNumber = Number(pageNo)

    const limitNumber = Number(limit)

    const start = (pageNumber - 1) * limitNumber

    const end = start + limitNumber

    const paginatedProducts = filteredProducts.slice(start, end)

    console.log(
      JSON.stringify({
        totalProductsInDb: allProducts.length,
        filteredProducts: filteredProducts.length,
        pageNumber,
        limitNumber
      })
    )

    return {
      statusCode: 200,
      body: {
        success: true,
        pageNo: pageNumber,
        limit: limitNumber,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNumber),
        categories,
        products: paginatedProducts
      }
    }
  } catch (error) {
    console.error('getProducts error:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        message: error.message
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main
