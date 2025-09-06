import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    inquiries: 0,
    pillows: 0,
    epeSheets: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [pillows, setPillows] = useState([]);
  const [epeSheets, setEpeSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [brokenImages, setBrokenImages] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [itemType, setItemType] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    density: '',
    size: '',
    color: '',
    image: null
  });
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrors({});
        
        // Fetch stats for overview
        const [productsRes, ordersRes, inquiriesRes, pillowsRes, epeSheetsRes] = await Promise.all([
          api.get('products/'),
          api.get('orders/'),
          api.get('inquiries/'),
          api.get('pillows/'),
          api.get('epe-sheets/')
        ]);
        
        setStats({
          products: productsRes.data.count || productsRes.data.length,
          orders: ordersRes.data.count || ordersRes.data.length,
          inquiries: inquiriesRes.data.count || inquiriesRes.data.length,
          pillows: pillowsRes.data.count || pillowsRes.data.length,
          epeSheets: epeSheetsRes.data.count || epeSheetsRes.data.length
        });

        // Fetch detailed data for tabs
        const detailedResults = await Promise.allSettled([
          api.get("orders/"),
          api.get("products/"),
          api.get("pillows/"),
          api.get("epe-sheets/")
        ]);

        if (detailedResults[0].status === "fulfilled") {
          setOrders(detailedResults[0].value.data);
        } else {
          setErrors(prev => ({...prev, orders: "Failed to load orders"}));
          console.error("Orders error:", detailedResults[0].reason);
        }

        if (detailedResults[1].status === "fulfilled") {
          setProducts(detailedResults[1].value.data);
        } else {
          setErrors(prev => ({...prev, products: "Failed to load products"}));
          console.error("Products error:", detailedResults[1].reason);
        }

        if (detailedResults[2].status === "fulfilled") {
          setPillows(detailedResults[2].value.data);
        } else {
          setErrors(prev => ({...prev, pillows: "Failed to load pillows"}));
          console.error("Pillows error:", detailedResults[2].reason);
        }

        if (detailedResults[3].status === "fulfilled") {
          setEpeSheets(detailedResults[3].value.data);
        } else {
          setErrors(prev => ({...prev, epeSheets: "Failed to load EPE sheets"}));
          console.error("EPE Sheets error:", detailedResults[3].reason);
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.is_staff) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle image loading errors
  const handleImageError = (id) => {
    setBrokenImages(prev => ({ ...prev, [id]: true }));
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`orders/${orderId}/`, { status: newStatus });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Function to handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemForm(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  // Function to save item changes
  const saveItemChanges = async () => {
    try {
      let endpoint = '';
      let method = 'post';
      let data = new FormData();
      
      // Append all form fields to FormData
      Object.keys(itemForm).forEach(key => {
        if (itemForm[key] !== null && itemForm[key] !== undefined) {
          data.append(key, itemForm[key]);
        }
      });
      
      // Determine endpoint and method based on whether we're adding or editing
      if (editingItem) {
        method = 'put';
        if (itemType === 'product') {
          endpoint = `products/${editingItem.id}/`;
        } else if (itemType === 'pillow') {
          endpoint = `pillows/${editingItem.id}/`;
        } else if (itemType === 'epeSheet') {
          endpoint = `epe-sheets/${editingItem.id}/`;
        }
      } else {
        if (itemType === 'product') {
          endpoint = 'products/';
        } else if (itemType === 'pillow') {
          endpoint = 'pillows/';
        } else if (itemType === 'epeSheet') {
          endpoint = 'epe-sheets/';
        }
      }
      
      // Make the API call
      if (method === 'put') {
        await api.put(endpoint, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post(endpoint, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      alert(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
      
      // Refresh data based on active tab
      if (activeTab === 'products') {
        const productsRes = await api.get('products/');
        setProducts(productsRes.data);
      } else if (activeTab === 'pillows') {
        const pillowsRes = await api.get('pillows/');
        setPillows(pillowsRes.data);
      } else if (activeTab === 'epeSheets') {
        const epeSheetsRes = await api.get('epe-sheets/');
        setEpeSheets(epeSheetsRes.data);
      }
      
      // Reset form and editing state
      setEditingItem(null);
      setIsAddingNew(false);
      setItemType(null);
      setItemForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        density: '',
        size: '',
        color: '',
        image: null
      });
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  // Function to edit an item
  const editItem = (item, type) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setItemType(type);
    
    // Set form values based on item type
    const formData = {
      name: item.name || '',
      price: item.price || '',
      stock: item.stock || 0,
      description: item.description || '',
      density: item.density || '',
      size: item.size || '',
      color: item.color || '',
      image: null
    };
    
    setItemForm(formData);
  };

  // Function to start adding a new item
  const startAddingNewItem = (type) => {
    setEditingItem(null);
    setIsAddingNew(true);
    setItemType(type);
    
    // Reset form
    setItemForm({
      name: '',
      price: '',
      stock: '',
      description: '',
      density: '',
      size: '',
      color: '',
      image: null
    });
  };

  // Function to cancel editing/adding
  const cancelEditing = () => {
    setEditingItem(null);
    setIsAddingNew(false);
    setItemType(null);
    setItemForm({
      name: '',
      price: '',
      stock: '',
      description: '',
      density: '',
      size: '',
      color: '',
      image: null
    });
  };

  // Function to delete an item
  const deleteItem = async (itemId, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        let endpoint = '';
        
        if (type === 'product') {
          endpoint = `products/${itemId}/`;
        } else if (type === 'pillow') {
          endpoint = `pillows/${itemId}/`;
        } else if (type === 'epeSheet') {
          endpoint = `epe-sheets/${itemId}/`;
        }
        
        await api.delete(endpoint);
        alert('Item deleted successfully!');
        
        // Refresh data based on active tab
        if (activeTab === 'products') {
          const productsRes = await api.get('products/');
          setProducts(productsRes.data);
        } else if (activeTab === 'pillows') {
          const pillowsRes = await api.get('pillows/');
          setPillows(pillowsRes.data);
        } else if (activeTab === 'epeSheets') {
          const epeSheetsRes = await api.get('epe-sheets/');
          setEpeSheets(epeSheetsRes.data);
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  // Function to render product cards in a grid
  const renderProductGrid = (items, errorKey, sectionName, type) => {
    if (errors[errorKey]) {
      return (
        <div style={styles.errorCard}>
          <p>Error loading {sectionName}: {errors[errorKey]}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }
    
    return (
      <div style={styles.productGrid}>
        {items.length === 0 ? (
          <p style={styles.emptyMessage}>No {sectionName} found</p>
        ) : (
          items.map(item => (
            <div key={item.id} style={styles.productCard}>
              <div style={styles.productImagePlaceholder}>
                {item.image && !brokenImages[item.id] ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={styles.productImage}
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div style={styles.imagePlaceholder}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <h4 style={styles.productName}>{item.name}</h4>
                <p style={styles.productPrice}>{formatCurrency(item.price)}</p>
                
                {/* Special fields for different product types */}
                {item.density && (
                  <p style={styles.productDetail}>Density: {item.density}</p>
                )}
                {item.size && (
                  <p style={styles.productDetail}>Size: {item.size}</p>
                )}
                {item.color && (
                  <p style={styles.productDetail}>Color: {item.color}</p>
                )}
                
                <p style={styles.productStock}>
                  Stock: {item.stock || 0}
                </p>
                
                <div style={styles.productActions}>
                  <button 
                    style={styles.editButton}
                    onClick={() => editItem(item, type)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => deleteItem(item.id, type)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !user.is_staff) {
    return (
      <div style={styles.accessDeniedContainer}>
        <h2>Access Denied</h2>
        <p>You need administrator privileges to access this page.</p>
        <button 
          style={styles.actionButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.header}>Admin Dashboard</h1>
        <button 
          style={styles.homeButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
      
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "overview" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("overview")}
        >
          <i className="fas fa-chart-pie" style={styles.tabIcon}></i>
          Overview
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "orders" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("orders")}
        >
          <i className="fas fa-shopping-cart" style={styles.tabIcon}></i>
          Orders
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "products" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("products")}
        >
          <i className="fas fa-box" style={styles.tabIcon}></i>
          Products
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "pillows" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("pillows")}
        >
          <i className="fas fa-bed" style={styles.tabIcon}></i>
          Pillows
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "epeSheets" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("epeSheets")}
        >
          <i className="fas fa-layer-group" style={styles.tabIcon}></i>
          EPE Sheets
        </button>
      </div>

      {activeTab === "overview" ? (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Dashboard Overview</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <i className="fas fa-box" style={styles.statIcon}></i>
              </div>
              <h3 style={styles.statTitle}>Products</h3>
              <p style={styles.statNumber}>{stats.products}</p>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <i className="fas fa-shopping-cart" style={styles.statIcon}></i>
              </div>
              <h3 style={styles.statTitle}>Orders</h3>
              <p style={styles.statNumber}>{stats.orders}</p>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <i className="fas fa-question-circle" style={styles.statIcon}></i>
              </div>
              <h3 style={styles.statTitle}>Inquiries</h3>
              <p style={styles.statNumber}>{stats.inquiries}</p>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <i className="fas fa-bed" style={styles.statIcon}></i>
              </div>
              <h3 style={styles.statTitle}>Pillows</h3>
              <p style={styles.statNumber}>{stats.pillows}</p>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <i className="fas fa-layer-group" style={styles.statIcon}></i>
              </div>
              <h3 style={styles.statTitle}>EPE Sheets</h3>
              <p style={styles.statNumber}>{stats.epeSheets}</p>
            </div>
          </div>
        </div>
      ) : activeTab === "orders" ? (
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h3 style={styles.sectionHeader}>Recent Orders</h3>
            <button 
              style={styles.refreshButton}
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          {errors.orders ? (
            <div style={styles.errorCard}>
              <p>Error loading orders: {errors.orders}</p>
              <button 
                style={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <p style={styles.emptyMessage}>No orders found</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Order ID</th>
                    <th style={styles.tableHeader}>Customer</th>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Amount</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>#{order.id}</td>
                      <td style={styles.tableCell}>{order.user?.username || 'Guest'}</td>
                      <td style={styles.tableCell}>{formatDate(order.created_at)}</td>
                      <td style={styles.tableCell}>{formatCurrency(order.total_amount)}</td>
                      <td style={styles.tableCell}>
                        <span style={getStatusStyle(order.status)}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <select 
                          value={order.status || ''} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "products" ? (
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h3 style={styles.sectionHeader}>Products Management</h3>
            <button 
              style={styles.addButton}
              onClick={() => startAddingNewItem('product')}
            >
              <i className="fas fa-plus"></i> Add New Product
            </button>
          </div>
          
          {(editingItem || isAddingNew) && itemType === 'product' && (
            <div style={styles.productForm}>
              <h4 style={styles.formTitle}>{editingItem ? 'Edit Product' : 'Add New Product'}</h4>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={itemForm.name}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={itemForm.stock}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Density</label>
                  <input
                    type="text"
                    name="density"
                    placeholder="Density"
                    value={itemForm.density}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Size</label>
                  <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={itemForm.size}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Color</label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={itemForm.color}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={itemForm.description}
                  onChange={handleFormChange}
                  style={styles.formTextarea}
                  rows="4"
                />
              </div>
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  {editingItem ? 'Update Product' : 'Add Product'}
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing Products</h4>
          {renderProductGrid(products, "products", "products", "product")}
        </div>
      ) : activeTab === "pillows" ? (
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h3 style={styles.sectionHeader}>Pillows Management</h3>
            <button 
              style={styles.addButton}
              onClick={() => startAddingNewItem('pillow')}
            >
              <i className="fas fa-plus"></i> Add New Pillow
            </button>
          </div>
          
          {(editingItem || isAddingNew) && itemType === 'pillow' && (
            <div style={styles.productForm}>
              <h4 style={styles.formTitle}>{editingItem ? 'Edit Pillow' : 'Add New Pillow'}</h4>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Pillow Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Pillow Name"
                    value={itemForm.name}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={itemForm.stock}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Color</label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={itemForm.color}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Pillow Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  placeholder="Pillow Description"
                  value={itemForm.description}
                  onChange={handleFormChange}
                  style={styles.formTextarea}
                  rows="4"
                />
              </div>
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  {editingItem ? 'Update Pillow' : 'Add Pillow'}
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing Pillows</h4>
          {renderProductGrid(pillows, "pillows", "pillows", "pillow")}
        </div>
      ) : (
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h3 style={styles.sectionHeader}>EPE Sheets Management</h3>
            <button 
              style={styles.addButton}
              onClick={() => startAddingNewItem('epeSheet')}
            >
              <i className="fas fa-plus"></i> Add New EPE Sheet
            </button>
          </div>
          
          {(editingItem || isAddingNew) && itemType === 'epeSheet' && (
            <div style={styles.productForm}>
              <h4 style={styles.formTitle}>{editingItem ? 'Edit EPE Sheet' : 'Add New EPE Sheet'}</h4>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>EPE Sheet Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="EPE Sheet Name"
                    value={itemForm.name}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={itemForm.stock}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Size</label>
                  <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={itemForm.size}
                    onChange={handleFormChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>EPE Sheet Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  placeholder="EPE Sheet Description"
                  value={itemForm.description}
                  onChange={handleFormChange}
                  style={styles.formTextarea}
                  rows="4"
                />
              </div>
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  {editingItem ? 'Update EPE Sheet' : 'Add EPE Sheet'}
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing EPE Sheets</h4>
          {renderProductGrid(epeSheets, "epeSheets", "EPE sheets", "epeSheet")}
        </div>
      )}
    </div>
  );
};

// Helper function for status styling
function getStatusStyle(status) {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    display: 'inline-block',
    minWidth: '90px',
    textAlign: 'center'
  };

  switch (status?.toLowerCase()) {
    case 'delivered':
      return {
        ...baseStyle,
        backgroundColor: '#e6f7e6',
        color: '#2e7d32'
      };
    case 'shipped':
      return {
        ...baseStyle,
        backgroundColor: '#e3f2fd',
        color: '#1565c0'
      };
    case 'cancelled':
      return {
        ...baseStyle,
        backgroundColor: '#ffebee',
        color: '#c62828'
      };
    case 'confirmed':
      return {
        ...baseStyle,
        backgroundColor: '#fff3e0',
        color: '#e65100'
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#f5f5f5',
        color: '#757575'
      };
  }
}

// Enhanced styles with professional design and mobile responsiveness
const styles = {
  container: {
    padding: '1rem',
    maxWidth: '1600px',
    margin: '0 auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.5rem 1rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  header: {
    color: '#1e293b',
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #40916c 0%, #2d6a4f 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  homeButton: {
    backgroundColor: 'white',
    color: '#40916c',
    border: '2px solid #40916c',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  tabs: {
    display: 'flex',
    marginBottom: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    flexWrap: 'wrap'
  },
  tabButton: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#64748b',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: '1',
    justifyContent: 'center',
    minWidth: '140px'
  },
  activeTab: {
    color: '#40916c',
    backgroundColor: '#f0fdf4',
    boxShadow: 'inset 0 -3px 0 #40916c'
  },
  tabIcon: {
    fontSize: '1rem'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem'
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionHeader: {
    color: '#1e293b',
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  subHeader: {
    color: '#1e293b',
    margin: '2rem 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statIconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  statIcon: {
    fontSize: '1.5rem',
    color: '#40916c'
  },
  statTitle: {
    margin: '0 0 0.5rem 0',
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  tableHeaderRow: {
    backgroundColor: '#f8fafc'
  },
  tableHeader: {
    padding: '16px',
    textAlign: 'left',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.875rem',
    borderBottom: '2px solid #e2e8f0'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
  },
  tableRowHover: {
    backgroundColor: '#f8fafc'
  },
  tableCell: {
    padding: '16px',
    color: '#334155',
    fontSize: '0.9rem',
    verticalAlign: 'middle'
  },
  statusSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '120px'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
  },
  productImagePlaceholder: {
    height: '180px',
    backgroundColor: '#f7fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #e2e8f0'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    color: '#94a3b8',
    fontSize: '0.9rem'
  },
  productInfo: {
    padding: '1.25rem'
  },
  productName: {
    margin: '0 0 0.75rem 0',
    color: '#1e293b',
    fontSize: '1.1rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  productPrice: {
    margin: '0 0 0.5rem 0',
    color: '#40916c',
    fontWeight: '700',
    fontSize: '1.2rem'
  },
  productDetail: {
    margin: '0 0 0.25rem 0',
    color: '#64748b',
    fontSize: '0.9rem'
  },
  productStock: {
    margin: '0.75rem 0 0 0',
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  productActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.25rem'
  },
  editButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    flex: 1,
    transition: 'background-color 0.2s ease'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    flex: 1,
    transition: 'background-color 0.2s ease'
  },
  productForm: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0'
  },
  formTitle: {
    margin: '0 0 1.5rem 0',
    color: '#1e293b',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  formGroup: {
    flex: '1 1 300px',
    marginBottom: '1rem'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },
  formTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    minHeight: '100px',
    marginBottom: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  saveButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  cancelButton: {
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease'
  },
  addButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  emptyMessage: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    fontStyle: 'italic'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: '#64748b'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #40916c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  accessDeniedContainer: {
    padding: '2rem',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginTop: '2rem'
  },
  actionButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    marginTop: '1rem'
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '1rem 0',
    border: '1px solid #fecaca'
  },
  retryButton: {
    backgroundColor: '#b91c1c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s ease'
  }
};

// Add keyframes for spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default AdminDashboard;