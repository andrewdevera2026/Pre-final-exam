
import { useState, type FormEvent } from 'react'
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
  const [editingId, setEditingId] = useState<number | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId !== null) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: productName,
                price: Number(price),
                quantity: Number(quantity),
              }
            : product,
        ),
      )
      setEditingId(null)
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: productName,
        price: Number(price),
        quantity: Number(quantity),
      }

      setProducts((currentProducts) => [...currentProducts, newProduct])
    }

    setProductName('')
    setPrice('')
    setQuantity('')
  }

  function handleEdit(product: Product) {
    setProductName(product.name)
    setPrice(String(product.price))
    setQuantity(String(product.quantity))
    setEditingId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this product?')

    if (!confirmed) return

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id),
    )

    if (editingId === id) {
      cancelEdit()
    }
  }

  function cancelEdit() {
    setEditingId(null)
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
            <h2>{editingId !== null ? 'Edit Product' : 'Add a Product'}</h2>
            <p>
              {editingId !== null
                ? 'Update the product details below.'
                : 'Enter the details of your product below.'}
            </p>
          </div>

          <form className="product-form" onSubmit={handleSubmit}>
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
              {editingId !== null ? 'Save Changes' : 'Add Product'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}
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

                  <div className="product-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
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
