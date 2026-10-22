
import { useState, type FormEvent } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  image: string
  category: string
  description: string
  specification: string
  rating: number
  price: number
  quantity: number
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    image: '/images/headphones.jpg',
    category: 'Electronics',
    description: 'Wireless headphones for music, study, and everyday use.',
    specification: 'Bluetooth, rechargeable battery',
    rating: 4.5,
    price: 1299,
    quantity: 10,
  },
  {
    id: 2,
    name: 'Backpack',
    image: '/images/backpack.jpg',
    category: 'Accessories',
    description: 'A practical backpack for school and daily activities.',
    specification: 'Multiple compartments, lightweight',
    rating: 4.2,
    price: 799,
    quantity: 3,
  },
  {
    id: 3,
    name: 'Running Shoes',
    image:  '/images/shoes.jpg',
    category: 'Clothing',
    description: 'Comfortable shoes for walking and everyday exercise.',
    specification: 'Breathable material, rubber sole',
    rating: 4.7,
    price: 1599,
    quantity: 8,
  },
]

const categories = ['All', 'Electronics', 'Accessories', 'Clothing']

function money(amount: number) {
  return amount.toLocaleString('en-PH', {
    style: 'currency',
    currency: 'PHP',
  })
}

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [productName, setProductName] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [specification, setSpecification] = useState('')
  const [rating, setRating] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const inventoryTotal = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  )

  const cartTotal = products.reduce(
    (total, product) =>
      total + product.price * (cart[product.id] ?? 0),
    0,
  )

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  )

  function resetForm() {
    setProductName('')
    setImage('')
    setCategory('')
    setDescription('')
    setSpecification('')
    setRating('')
    setPrice('')
    setQuantity('')
    setEditingId(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newDetails = {
      name: productName.trim(),
      image: image.trim(),
      category,
      description: description.trim(),
      specification: specification.trim(),
      rating: Number(rating),
      price: Number(price),
      quantity: Number(quantity),
    }

    if (
      !newDetails.name ||
      !newDetails.image ||
      !newDetails.category ||
      !newDetails.description ||
      !newDetails.specification ||
      rating === '' ||
      price === '' ||
      quantity === '' ||
      !Number.isFinite(newDetails.rating) ||
      newDetails.rating < 0 ||
      newDetails.rating > 5 ||
      !Number.isFinite(newDetails.price) ||
      newDetails.price <= 0 ||
      !Number.isInteger(newDetails.quantity) ||
      newDetails.quantity < 0
    ) {
      window.alert(
        'Please fill in every field. Rating must be 0–5, price must be positive, and quantity cannot be negative.',
      )
      return
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...product, ...newDetails }
            : product,
        ),
      )
    } else {
      setProducts((current) => [
        ...current,
        { id: Date.now(), ...newDetails },
      ])
    }

    resetForm()
  }

  function handleEdit(product: Product) {
    setProductName(product.name)
    setImage(product.image)
    setCategory(product.category)
    setDescription(product.description)
    setSpecification(product.specification)
    setRating(String(product.rating))
    setPrice(String(product.price))
    setQuantity(String(product.quantity))
    setEditingId(product.id)
    setSelectedProductId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setProducts((current) => current.filter((product) => product.id !== id))
    setCart((current) => {
      const updated = { ...current }
      delete updated[id]
      return updated
    })

    if (editingId === id) resetForm()
    if (selectedProductId === id) setSelectedProductId(null)
  }

  function changeCartQuantity(id: number, change: number) {
    const product = products.find((item) => item.id === id)
    if (!product) return

    setCart((current) => {
      const currentQuantity = current[id] ?? 0
      const nextQuantity = Math.max(
        0,
        Math.min(product.quantity, currentQuantity + change),
      )

      return { ...current, [id]: nextQuantity }
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management App</h1>
        <p>Manage your products, inventory, and shopping cart.</p>
        <div className="summary">
          <div className="summary-card">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="summary-card">
            <span>Inventory Value</span>
            <strong>{money(inventoryTotal)}</strong>
          </div>
          <div className="summary-card">
            <span>Cart Total</span>
            <strong>{money(cartTotal)}</strong>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="products-section">
          <div className="section-heading">
            <h2>{editingId !== null ? 'Edit Product' : 'Add a Product'}</h2>
            <p>Enter all the required product information.</p>
          </div>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Feature Image URL</label>
              <input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {categories.filter((item) => item !== 'All').map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specification">Product Specification</label>
              <textarea
                id="specification"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (0–5)</label>
              <input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Available Quantity</label>
              <input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {selectedProduct ? (
          <section className="products-section">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setSelectedProductId(null)}
            >
              ← Back to Products
            </button>
            <div className="detail-layout">
              <img
                className="detail-image"
                src={selectedProduct.image}
                alt={selectedProduct.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x300?text=Product'
                }}
              />
              <div>
                <h2>{selectedProduct.name}</h2>
                <p>Category: {selectedProduct.category}</p>
                <p>{selectedProduct.description}</p>
                <p>Specifications: {selectedProduct.specification}</p>
                <p>Rating: ⭐ {selectedProduct.rating}/5</p>
                <h3>{money(selectedProduct.price)}</h3>
                <p>Available: {selectedProduct.quantity}</p>
                <button
                  type="button"
                  className="add-button"
                  disabled={selectedProduct.quantity === 0}
                  onClick={() => changeCartQuantity(selectedProduct.id, 1)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="products-section inventory-section">
            <div className="section-heading">
              <h2>Product List</h2>
              <p>Subtotal = price × quantity</p>
            </div>

            <div className="filter-row">
              <label htmlFor="categoryFilter">Filter by category:</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Add a product or select another category.</p>
              </div>
            ) : (
              <div className="product-list">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300?text=Product'
                      }}
                    />

                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.category}</p>
                      <p>⭐ {product.rating}/5</p>
                      <p>Price: {money(product.price)}</p>
                      <p>Available quantity: {product.quantity}</p>

                      {product.quantity < 5 && (
                        <strong className="low-stock">Low Stock</strong>
                      )}

                      <p>
                        Subtotal: <strong>{money(product.price * product.quantity)}</strong>
                      </p>

                      <div className="cart-controls">
                        <button
                          type="button"
                          onClick={() => changeCartQuantity(product.id, -1)}
                          disabled={(cart[product.id] ?? 0) === 0}
                        >
                          −
                        </button>
                        <span>In cart: {cart[product.id] ?? 0}</span>
                        <button
                          type="button"
                          onClick={() => changeCartQuantity(product.id, 1)}
                          disabled={(cart[product.id] ?? 0) >= product.quantity}
                        >
                          +
                        </button>
                      </div>

                      <div className="product-actions">
                        <button
                          type="button"
                          className="add-button"
                          disabled={product.quantity === 0}
                          onClick={() => changeCartQuantity(product.id, 1)}
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => setSelectedProductId(product.id)}
                        >
                          Details
                        </button>
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
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="products-section">
          <div className="section-heading">
            <h2>Shopping Cart</h2>
            <p>Items currently added to your cart.</p>
          </div>

          {products.filter((product) => (cart[product.id] ?? 0) > 0).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            products
              .filter((product) => (cart[product.id] ?? 0) > 0)
              .map((product) => (
                <div className="cart-item" key={product.id}>
                  <span>{product.name} × {cart[product.id]}</span>
                  <strong>{money(product.price * (cart[product.id] ?? 0))}</strong>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => setCart((current) => ({ ...current, [product.id]: 0 }))}
                  >
                    Remove
                  </button>
                </div>
              ))
          )}

          <h3>Cart Total: {money(cartTotal)}</h3>
        </section>
      </main>
    </div>
  )
}

export default App
