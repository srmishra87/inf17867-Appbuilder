/*
 * <license header>
 */

import React from 'react'

import { Provider, defaultTheme, View } from '@adobe/react-spectrum'

import ErrorBoundary from 'react-error-boundary'

import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'

import ActionsForm from './ActionsForm'
import { About } from './About'
import Auth from './Auth'
import ProductList from './ProductList'
import ProductDetail from './productDetail'

function Header() {
  const location = useLocation()
  function logout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)

  return (
    <>
      <header className="app-header">
        <div className="logo-section">🛒 Product Catalog</div>

        <nav className="header-links">
          <Link to="/" onClick={logout}>
            Logout
          </Link>

          <Link to="/products">Products</Link>

          <Link to="/actions">Actions</Link>

          <Link to="/about">About</Link>
        </nav>
      </header>

      <div className="breadcrumb-container">
        <Link to="/">Home</Link>

        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/')

          return (
            <React.Fragment key={path}>
              <span>{' > '}</span>

              <Link to={path}>{segment}</Link>
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

function App(props) {
  console.log('runtime object:', props.runtime)

  console.log('ims object:', props.ims)

  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', {
      imsOrg,
      imsToken,
      locale
    })
  })

  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', {
      type,
      path
    })
  })

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme="light">
          <View minHeight="100vh">
            <Header />

            <View padding="size-300">
              <Routes>
                <Route path="/" element={<Auth />} />

                <Route path="/products" element={<ProductList />} />

                <Route path="/products/:id" element={<ProductDetail />} />

                <Route path="/actions" element={<ActionsForm runtime={props.runtime} ims={props.ims} />} />

                <Route path="/about" element={<About />} />
              </Routes>
            </View>
          </View>
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  function onError(e, componentStack) {}

  function fallbackComponent({ componentStack, error }) {
    return (
      <>
        <h1
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >
          Something went wrong :(
        </h1>

        <pre>{componentStack + '\n' + error.message}</pre>
      </>
    )
  }
}

export default App
