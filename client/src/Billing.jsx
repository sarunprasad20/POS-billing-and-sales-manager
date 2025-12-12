import { useState, useEffect } from "react";
import { getFood } from "./api";
import "./Billing.css";

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoiceNumber] = useState(
    `INV-${Date.now()}`
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getFood();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setCart([]);
  };

  const total = calculateTotal();
  const gst = (total * 0.18).toFixed(2);
  const finalTotal = (parseFloat(total) + parseFloat(gst)).toFixed(2);

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="billing-container">
      <div className="billing-content">
        <div className="products-section">
          <h2>Available Products</h2>
          {error && <p className="error">{error}</p>}
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products available. Add products first!</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <h4>{product.name}</h4>
                  <p className="category">{product.category}</p>
                  <p className="price">₹{parseFloat(product.price).toFixed(2)}</p>
                  <button
                    className="add-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="invoice-section">
          <div className="invoice-header">
            <h2>Invoice</h2>
            <p className="invoice-number">{invoiceNumber}</p>
            <p className="invoice-date">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="invoice-items">
            <h3>Items</h3>
            {cart.length === 0 ? (
              <p className="empty-cart">No items in cart</p>
            ) : (
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>₹{parseFloat(item.price).toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="qty-input"
                        />
                      </td>
                      <td>
                        ₹
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{parseFloat(total).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹{gst}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <div className="invoice-actions">
            <button className="print-btn" onClick={handlePrint}>
              Print Invoice
            </button>
            <button className="clear-btn" onClick={handleClear}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
