const { generateAccessToken } = require('@adobe/aio-sdk').Core.AuthClient
const libDb = require('@adobe/aio-lib-db')

async function main(params) {
  let client

  try {
    const products = params.products || []

    console.log(`Products received: ${products.length}`)

    if (!products.length) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'No products supplied'
        }
      }
    }

    // Duplicate ID diagnostics
    const idCounts = {}
    const duplicateIds = []

    for (const product of products) {
      if (product.id === undefined || product.id === null) {
        continue
      }

      idCounts[product.id] = (idCounts[product.id] || 0) + 1
    }

    Object.keys(idCounts).forEach(id => {
      if (idCounts[id] > 1) {
        duplicateIds.push({
          id,
          count: idCounts[id]
        })
      }
    })

    console.log('Duplicate IDs:', JSON.stringify(duplicateIds))
    console.log(
  JSON.stringify(
    {
      IMS_CLIENT_ID: params.IMS_CLIENT_ID,
      IMS_CLIENT_SECRET: params.IMS_CLIENT_SECRET
        ? 'PRESENT'
        : 'MISSING',
      IMS_ORG_ID: params.IMS_ORG_ID
    },
    null,
    2
  )
)

    const token = await generateAccessToken(params)

    const db = await libDb.init({
      token: token.access_token,
      region: params.DB_REGION || 'apac'
    })

    client = await db.connect()

   const productsCollection = client.collection('products')

console.log(
  'Collection methods:',
  Object.getOwnPropertyNames(
    Object.getPrototypeOf(productsCollection)
  )
)
console.log(productsCollection)


    let inserted = 0
    let updated = 0
    const failedProducts = []

    for (const product of products) {
      try {
        console.log(`Processing Product ID: ${product.id}`)

        let existingProduct = null

        try {
          existingProduct = await productsCollection.findOne({
            id: product.id
          })
        } catch (e) {
          existingProduct = null
        }

        if (existingProduct) {
          await productsCollection.updateOne(
            { id: product.id },
            { $set: product }
          )

          updated++
          console.log(`Updated Product ID: ${product.id}`)
        } else {
          await productsCollection.insertOne(product)

          inserted++
          
          console.log(`Inserted Product ID: ${product.id}`)
        }
      } catch (err) {
        console.error(
          `Failed Product ID ${product.id}: ${err.message}`
        )

        failedProducts.push({
          id: product.id,
          error: err.message
        })
      }
    }

    console.log(
      JSON.stringify({
        totalReceived: products.length,
        inserted,
        updated,
        failedCount: failedProducts.length
      })
    )

    return {
      statusCode: 200,
      body: {
        success: true,
        totalReceived: products.length,
        inserted,
        updated,
        duplicatesFound: duplicateIds.length,
        duplicateIds,
        failedCount: failedProducts.length,
        failedProducts
      }
    }
  } catch (error) {
    console.error('Ingestion Error:', error)

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