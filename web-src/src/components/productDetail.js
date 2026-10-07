import React, { useEffect, useState } from 'react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import actionWebInvoke from '../utils'
import config from '../config.json'

export default function ProductDetail() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [product, setProduct] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [toast, setToast] =
    useState('')

  useEffect(() => {

    const token =
      localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    fetchProduct()

  }, [])

  async function fetchProduct() {

    try {

      const result =
        await actionWebInvoke(
          config['New folder/getProducts'],
          {},
          {
            pageNo: 1,
            limit: 100
          }
        )

      const responseBody =
        result?.body || result || {}

      const selectedProduct =
        (responseBody.products || []).find(
          p => String(p.id) === String(id)
        )

      setProduct(selectedProduct)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }
  }

  function handleAddToCart() {

    setToast(
      `${product.title} added to cart`
    )

    setTimeout(() => {
      setToast('')
    }, 3000)
  }

  if (loading)
    return <h2>Loading...</h2>

  if (!product)
    return <h2>Product not found</h2>

  const imageUrl =
    String(product.thumbnail || '')
      .match(/https?:\/\/[^"<>\s]+/)
      ?.at(0) || ''

  return (
    <div className="product-detail">

      {toast && (
        <div className="success-toast">
          ✅ {toast}
        </div>
      )}

      <button
        className="primary-btn"
        onClick={() =>
          navigate('/products')
        }
      >
        Back
      </button>

      <div className="product-detail-card">

        <img src={product.thumbnail || ''} alt={product.title} />

        <div>

          <h1>{product.title}</h1>

          <p>{product.description}</p>

          <h2>
            ${product.price}
          </h2>

          <p>
            <strong>Category:</strong>{' '}
            {product.category}
          </p>

          <p>
            <strong>Brand:</strong>{' '}
            {product.brand || 'N/A'}
          </p>

          <p>
            <strong>Rating:</strong>{' '}
            ⭐ {product.rating}
          </p>

          <p>
            <strong>Stock:</strong>{' '}
            {product.stock}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            <span
              style={{
                color:
                  product.availabilityStatus ===
                    'In Stock'
                    ? 'green'
                    : 'orange',
                fontWeight: 'bold'
              }}
            >
              {product.availabilityStatus}
            </span>
          </p>

          <p>
            <strong>Discount:</strong>{' '}
            {product.discountPercentage}%
          </p>

          <p>
            <strong>SKU:</strong>{' '}
            {product.sku}
          </p>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

        </div>

      </div>

    </div>
  )
}