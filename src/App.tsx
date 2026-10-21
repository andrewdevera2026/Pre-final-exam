
import { useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  price: number
  quantity: number
}

function App() {
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      price: Number(price),
      quantity: Number(quantity),
    }

    setProducts((currentProducts) => [...currentProducts, newProduct])

    setProductName('')
    setPrice('')
    setQuantity('')
  }

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

          <form className="product-form" onSubmit={handleAddProduct}>
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

        <section className="products-section inventory-section">
          <div className="section-heading">
            <h2>My Products</h2>
            <p>Products in your inventory: {products.length}</p>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Add a product using the form above.</p>
            </div>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <div>
                    <h3>{product.name}</h3>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                  <strong>
                    {product.price.toLocaleString('en-PH', {
                      style: 'currency',
                      currency: 'PHP',
                    })}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
