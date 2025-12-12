import { useState, useEffect } from "react";
import { getFood, addFood, deleteFood, updateFood } from "./api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await updateFood(editingId, form, token);
        setEditingId(null);
      } else {
        await addFood(form, token);
      }
      setForm({ name: "", price: "", category: "" });
      fetchProducts();
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteFood(id, token);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", category: "" });
    setEditingId(null);
  };

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="products-container">
      <h2>Products Management</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            placeholder="Enter category"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>Product List</h3>
        {products.length === 0 ? (
          <p>No products available. Add one to get started!</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
