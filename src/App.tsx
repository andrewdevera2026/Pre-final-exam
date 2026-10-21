
import { useState } from 'react'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management App</h1>
        <p>Manage your products in one place.</p>
      </header>

      <main className="container">
        <section className="products-section">
          <div className="section-heading">
            <h2>Add a Product</h2>
            <p>Enter the details of your product below.</p>
          </div>

          <form
            className="product-form"
            onSubmit={(event) => {
              event.preventDefault()
              alert(
                `Product: ${productName}\nPrice: ₱${price}\nQuantity: ${quantity}`,
              )
            }}
          >
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₱)</label>
              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>

            <button type="submit" className="add-button">
              Add Product
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
