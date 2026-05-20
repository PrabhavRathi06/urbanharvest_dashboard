import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addProduct, 
  toggleAvailability, 
  deleteProduct, 
  setSearchQuery, 
  setSelectedCategory, 
  setSelectedStatus,
  resetFilters,
  selectFilteredProducts 
} from '../store/productSlice';
import { 
  Search, 
  Plus, 
  Trash2, 
  Sparkles,
  ShoppingBag,
  Inbox,
  XCircle,
  HelpCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import './pages.css';

const ProductPage = () => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);
  const { searchQuery, selectedCategory, selectedStatus } = useSelector((state) => state.products);
  
  // Inline form states
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: '250g pkt',
    stock: '',
    description: '',
    image: '',
  });
  
  const [formError, setFormError] = useState('');

  // Categories list
  const categories = ['All', 'Vegetables', 'Fruits', 'Herbs', 'Microgreens', 'Fungi'];

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCategorySelect = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleStatusSelect = (e) => {
    dispatch(setSelectedStatus(e.target.value));
  };

  const handleToggleAvailability = (productId) => {
    dispatch(toggleAvailability(productId));
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product from inventory?')) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleForm = () => {
    setFormOpen(prev => !prev);
    setFormError('');
    if (!formOpen) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const { name, price, stock, description } = newProduct;
    
    // Basic validations
    if (!name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setFormError('Please enter a valid price greater than 0.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setFormError('Please enter a valid stock quantity (0 or more).');
      return;
    }
    if (!description.trim()) {
      setFormError('Product description is required.');
      return;
    }

    // Submit product
    dispatch(addProduct({
      ...newProduct,
      price: parseFloat(price),
      stock: parseInt(stock),
      name: name.trim(),
      description: description.trim(),
      priceDisplay: `₹${parseFloat(price).toFixed(2)}/${newProduct.unit}`,
    }));

    // Reset state & close form
    setNewProduct({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: '250g pkt',
      stock: '',
      description: '',
      image: '',
    });
    setFormOpen(false);
  };

  // Get status tag badge color
  const getProductStatusBadge = (status) => {
    return status === 'Available' ? 'badge-success' : 'badge-danger';
  };

  return (
    <div className="animate-fade-in">
      
      {/* Search and Filters panel */}
      <div className="products-filter-bar">
        
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            id="product-search"
            type="text"
            placeholder="Search products, categories..."
            className="form-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Category Filters */}
        <div className="category-filters-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status dropdown */}
        <select
          id="status-filter"
          className="status-dropdown-filter"
          value={selectedStatus}
          onChange={handleStatusSelect}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Add Product Toggle Button */}
        <button 
          id="toggle-add-product"
          className={`btn ${formOpen ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleToggleForm}
        >
          {formOpen ? (
            <><ChevronUp size={18} /> Close Form</>
          ) : (
            <><Plus size={18} /> Add Product</>
          )}
        </button>
      </div>

      {/* Inline Add Product Form */}
      {formOpen && (
        <div className="inline-add-form" ref={formRef}>
          <div className="inline-form-header">
            <h3><Sparkles size={20} /> Add New Organic Product</h3>
          </div>

          {formError && (
            <div className="login-error" style={{ margin: '0 0 16px 0' }}>
              <XCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-grid">

              {/* Name - full width */}
              <div className="form-grid-full">
                <label className="login-form-label" htmlFor="prod-name">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Butterhead Lettuce"
                  value={newProduct.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label className="login-form-label" htmlFor="prod-category">Category *</label>
                <select
                  id="prod-category"
                  name="category"
                  className="form-input"
                  value={newProduct.category}
                  onChange={handleFormChange}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Microgreens">Microgreens</option>
                  <option value="Fungi">Fungi</option>
                </select>
              </div>

              <div>
                <label className="login-form-label" htmlFor="prod-price">Price (₹) *</label>
                <input
                  id="prod-price"
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="45"
                  value={newProduct.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label className="login-form-label" htmlFor="prod-unit">Unit *</label>
                <select
                  id="prod-unit"
                  name="unit"
                  className="form-input"
                  value={newProduct.unit}
                  onChange={handleFormChange}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="250g pkt">250g pkt</option>
                  <option value="500g pkt">500g pkt</option>
                  <option value="1kg bag">1kg bag</option>
                  <option value="100g bunch">100g bunch</option>
                  <option value="150g cup">150g cup</option>
                  <option value="200g bowl">200g bowl</option>
                  <option value="100g tub">100g tub</option>
                  <option value="pc">per piece</option>
                </select>
              </div>

              <div>
                <label className="login-form-label" htmlFor="prod-stock">Initial Stock *</label>
                <input
                  id="prod-stock"
                  type="number"
                  name="stock"
                  min="0"
                  className="form-input"
                  placeholder="20"
                  value={newProduct.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="form-grid-full">
                <label className="login-form-label" htmlFor="prod-image">Image URL (Optional)</label>
                <input
                  id="prod-image"
                  type="url"
                  name="image"
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProduct.image}
                  onChange={handleFormChange}
                />
              </div>

              {/* Description */}
              <div className="form-grid-full">
                <label className="login-form-label" htmlFor="prod-desc">Description *</label>
                <textarea
                  id="prod-desc"
                  name="description"
                  className="form-input"
                  rows="2"
                  placeholder="Tell us about the flavor, farming methods, or packaging..."
                  value={newProduct.description}
                  onChange={handleFormChange}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="inline-form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleToggleForm}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                <Plus size={16} /> Create Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-state-icon" size={56} />
          <h3 className="empty-state-title">No Products Found</h3>
          <p className="empty-state-desc">
            {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All Statuses'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Click "Add Product" to start building your inventory.'}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-card card-hover" key={product.id}>
              
              {/* Product Image */}
              <div className="product-image-container">
                <img 
                  src={product.image || `https://placehold.co/400x200/f1fbf4/2d7d41?text=${encodeURIComponent(product.name)}`} 
                  alt={product.name}
                  className="product-img"
                  onError={(e) => { e.target.src = `https://placehold.co/400x200/f1fbf4/2d7d41?text=${encodeURIComponent(product.name)}`; }}
                />
                <span className="product-category-tag">{product.category}</span>
                <span className={`product-status-tag badge ${getProductStatusBadge(product.status)}`}>
                  {product.status}
                </span>
              </div>

              {/* Product Body */}
              <div className="product-card-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-pricing-info">
                  <div>
                    <span className="product-price-label">Price</span>
                    <div className="product-price-val">
                      {product.priceDisplay || `₹${product.price.toFixed(2)}/${product.unit || '250g pkt'}`}
                    </div>
                  </div>
                  <div>
                    <span className="product-stock-label">Stock Level</span>
                    <div className={`product-stock-val ${product.stock <= 5 ? 'low' : ''}`}>
                      {product.stock} items
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="product-card-actions">
                <label className="toggle-stock-container" htmlFor={`toggle-${product.id}`}>
                  <span className="switch">
                    <input 
                      id={`toggle-${product.id}`}
                      type="checkbox" 
                      checked={product.status === 'Available'}
                      onChange={() => handleToggleAvailability(product.id)}
                    />
                    <span className="slider"></span>
                  </span>
                  <span>{product.status}</span>
                </label>
                <div className="card-action-btns">
                  <button 
                    className="action-icon-btn delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductPage;
