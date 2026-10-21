
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management App</h1>
        <p>Manage your products in one place.</p>
      </header>

      <main className="container">
        <section className="products-section">
          <div className="section-heading">
            <h2>My Products</h2>
            <p>View and manage your product inventory.</p>
          </div>

          <div className="empty-state">
            <h3>No products yet</h3>
            <p>Your products will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
