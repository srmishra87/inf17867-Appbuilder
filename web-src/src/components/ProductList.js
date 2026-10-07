import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import actionWebInvoke from '../utils'
import config from '../config.json'

export default function ProductList() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [pageNo, setPageNo] = useState(1)
  const [limit] = useState(10)

  const [searchText, setSearchText] = useState('')
  const [rating, setRating] = useState('')
  const [category, setCategory] = useState('')

  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    loadProducts()
  }, [pageNo, rating, category, sortBy, sortOrder])

  async function loadProducts() {
    try {
      setLoading(true)

      const result = await actionWebInvoke(
        config['New folder/getProducts'],
        {},
        {
          pageNo,
          limit,
          searchText,
          rating,
          category,
          sortBy,
          sortOrder
        }
      )

      const responseBody = result?.body || result || {}

      setProducts(Array.isArray(responseBody.products) ? responseBody.products : [])

      setCategories(Array.isArray(responseBody.categories) ? responseBody.categories : [])

      setTotalPages(responseBody.totalPages || 1)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  function clearFilters() {
    setSearchText('')
    setCategory('')
    setRating('')

    setSortBy('title')
    setSortOrder('asc')

    setPageNo(1)

    loadProducts()
  }
  function handleSearch() {
    setPageNo(1)
    loadProducts()
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
      </div>

      <div className="filter-section">
        <input type="text" placeholder="Search Product" value={searchText} onChange={(e) => setSearchText(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>

          {(categories || []).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">All Ratings</option>

          <option value="1">1+</option>

          <option value="2">2+</option>

          <option value="3">3+</option>

          <option value="4">4+</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Title</option>

          <option value="price">Price</option>

          <option value="rating">Rating</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>

          <option value="desc">Descending</option>
        </select>

        <button className="primary-btn" onClick={handleSearch}>
          Search
        </button>
        <button className="primary-btn" onClick={clearFilters}>
          Clear Filter
        </button>
      </div>

      {loading && <h3>Loading Products...</h3>}

      <div className="product-grid">
        {(products || []).map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnail || ''} alt={product.title} />

            <h3>{product.title}</h3>

            <p>
              <strong>Category:</strong>
              {product.category}
            </p>

            <p>
              <strong>Brand:</strong>
              {product.brand || 'N/A'}
            </p>

            <p>
              <strong>Price:</strong> ${product.price}
            </p>

            <p>
              <strong>Discount:</strong>
              {product.discountPercentage}%
            </p>

            <p>⭐ {product.rating}</p>

            <p>Stock: {product.stock}</p>

            <p
              style={{
                color: product.availabilityStatus === 'In Stock' ? 'green' : 'orange',
                fontWeight: 'bold'
              }}
            >
              {product.availabilityStatus}
            </p>

            <button className="primary-btn" onClick={() => navigate(`/products/${product.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={pageNo === 1} onClick={() => setPageNo(pageNo - 1)}>
          Previous
        </button>

        <span>
          Page {pageNo} of {totalPages}
        </span>

        <button disabled={pageNo === totalPages} onClick={() => setPageNo(pageNo + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
